import { spawn } from "child_process";
import fs from "fs";

export const RESOLUTIONS = [
    { name: "360p",  width: 640,  height: 360,  bitrate: "800k",  audioBitrate: "96k"  },
    { name: "480p",  width: 854,  height: 480,  bitrate: "1400k", audioBitrate: "128k" },
    { name: "720p",  width: 1280, height: 720,  bitrate: "2800k", audioBitrate: "128k" },
    { name: "1080p", width: 1920, height: 1080, bitrate: "5000k", audioBitrate: "192k" },
];

export interface Resolution {
    name: string;
    width: number;
    height: number;
    bitrate: string;
    audioBitrate: string;
}

/**
 * Transcode a single video to HLS at the given resolution using spawn.
 * spawn is non-blocking and streams stderr live — far better than execSync
 * for large files because it doesn't buffer the entire output in memory.
 */
export const transcodeToHLS = (
    inputPath: string,
    outputDir: string,
    resolution: Resolution
): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.mkdirSync(outputDir, { recursive: true });

        // Build args as an array — no shell injection risk, no string escaping issues
        const args = [
            "-i", inputPath,
            "-vf", `scale=${resolution.width}:${resolution.height}`,
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "22",
            "-b:v", resolution.bitrate,
            "-maxrate", resolution.bitrate,
            "-bufsize", `${parseInt(resolution.bitrate) * 2}k`,
            "-c:a", "aac",
            "-b:a", resolution.audioBitrate,
            "-hls_time", "6",
            "-hls_playlist_type", "vod",
            "-hls_segment_filename", `${outputDir}/seg_%03d.ts`,
            `${outputDir}/index.m3u8`,
            "-y",
        ];

        const ffmpeg = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });

        // Stream stderr to console in real time without buffering
        ffmpeg.stderr.on("data", (chunk: Buffer) => {
            process.stdout.write(`[ffmpeg/${resolution.name}] ${chunk.toString()}`);
        });

        ffmpeg.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`ffmpeg exited with code ${code} for resolution ${resolution.name}`));
            }
        });

        ffmpeg.on("error", (err) => {
            reject(new Error(`ffmpeg spawn error: ${err.message}`));
        });
    });
};

export const generateMasterPlaylist = (resolutions: Resolution[]): string => {
    const header = `#EXTM3U\n#EXT-X-VERSION:3\n`;

    const variants = resolutions.map((res) => {
        const bandwidth = parseInt(res.bitrate) * 1000;
        return [
            `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${res.width}x${res.height},NAME="${res.name}"`,
            `${res.name}/index.m3u8`,
        ].join("\n");
    });

    return header + variants.join("\n");
};
