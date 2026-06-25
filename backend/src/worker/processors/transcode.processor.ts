import { Job } from "bullmq";
import fs from "fs";
import path from "path";
import { TranscodeJobData } from "../../infrastructure/queue/videoQueue.js";
import { downloadFromR2, uploadFileToR2, uploadStringToR2 } from "../helpers/r2.helpers.js";
import { transcodeToHLS, generateMasterPlaylist, RESOLUTIONS } from "../helpers/hls.helpers.js";
import envConfig from "../../config/envConfig.js";
import { Lesson } from "../../modules/lesson/lesson.model.js";


export const transcodeProcessor = async (
  job: Job<TranscodeJobData>
): Promise<void> => {
  const { rawKey, lessonId } = job.data;
  const tmpDir = path.join("/tmp", `lesson-${lessonId}-${Date.now()}`);

  try {
    // ─── Step 1: Download ───────────────────────────────
    await job.updateProgress(5);
    console.log(`[${lessonId}] Downloading from R2...`);
    fs.mkdirSync(tmpDir, { recursive: true });
    const inputPath = path.join(tmpDir, "input.mp4");
    await downloadFromR2(rawKey, inputPath);

    // ─── Step 2: Transcode each resolution ─────────────
    for (let i = 0; i < RESOLUTIONS.length; i++) {
      const res = RESOLUTIONS[i];
      const progress = 10 + (i / RESOLUTIONS.length) * 70; // 10% → 80%

      await job.updateProgress(Math.floor(progress));
      console.log(`[${lessonId}] Transcoding ${res.name}...`);

      const resOutputDir = path.join(tmpDir, res.name);
      transcodeToHLS(inputPath, resOutputDir, res);
    }

    // ─── Step 3: Upload segments to R2 ─────────────────
    await job.updateProgress(82);
    console.log(`[${lessonId}] Uploading HLS segments to R2...`);

    for (const res of RESOLUTIONS) {
      const resDir = path.join(tmpDir, res.name);
      const files = fs.readdirSync(resDir);

      for (const file of files) {
        const localPath = path.join(resDir, file);
        const r2Key = `hls/${lessonId}/${res.name}/${file}`;
        const contentType = file.endsWith(".m3u8")
          ? "application/x-mpegURL"
          : "video/MP2T";

        await uploadFileToR2(localPath, r2Key, contentType, envConfig.R2_HLS_BUCKET);
      }
    }

    // ─── Step 4: Master playlist upload ────────────────
    await job.updateProgress(93);
    const masterPlaylist = generateMasterPlaylist(RESOLUTIONS);
    await uploadStringToR2(
      masterPlaylist,
      `hls/${lessonId}/master.m3u8`,
      "application/x-mpegURL",
      envConfig.R2_HLS_BUCKET
    );

    // ─── Step 5: DB update ──────────────────────────────
    await job.updateProgress(98);
    const videoUrl = `${envConfig.R2_PUBLIC_URL}/hls/${lessonId}/master.m3u8`;

    await Lesson.findByIdAndUpdate(lessonId, { $set: { videoUrl } });
    console.log(`[${lessonId}] Done! URL saved to lesson: ${videoUrl}`);

    await job.updateProgress(100);

  } finally {
    // Cleanup — chahe error aaye ya na aaye
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
};