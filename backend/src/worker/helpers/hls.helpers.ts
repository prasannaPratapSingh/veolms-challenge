
import { execSync } from "child_process";
import fs from "fs";


export const RESOLUTIONS = [
    { name: "360p", width: 640, height: 360, bitrate: "800k", audioBitrate: "96k" },
    { name: "480p", width: 854, height: 480, bitrate: "1400k", audioBitrate: "128k" },
    { name: "720p", width: 1280, height: 720, bitrate: "2800k", audioBitrate: "128k" },
    { name: "1080p", width: 1920, height: 1080, bitrate: "5000k", audioBitrate: "192k" },
];

export interface Resolution {
    name: string;
    width: number;
    height: number;
    bitrate: string;
    audioBitrate: string;
}

// ab har ek resolution ek liye hume transcode karna hoga HLS me isika ka use karke hum baad me
// loop chala denge upar RESOLUTIONS ka use karke to humare pass 4 RESOLUTIONS hai to itne hi
// containers spin up honge 
// for that we need to create job for each resolution, for this job we use child process
// ab ek function create karte hai jo ffmpeg chalayega and create-hls-playlist.ts me use karenge 

export const transcodeToHLS = (inputPath: string, outputDir: string, resolution: Resolution): void => {

    fs.mkdirSync(outputDir, { recursive: true });

    const cmd = [
        `ffmpeg -i "${inputPath}"`,
        `-vf scale=${resolution.width}:${resolution.height}`,
        `-c:v libx264 -preset fast -crf 22`,
        `-b:v ${resolution.bitrate}`,
        `-maxrate ${resolution.bitrate}`,
        `-bufsize ${parseInt(resolution.bitrate) * 2}k`,
        `-c:a aac -b:a ${resolution.audioBitrate}`,
        `-hls_time 6`,           // har segment 6 seconds ka
        `-hls_playlist_type vod`, // video on demand
        `-hls_segment_filename "${outputDir}/seg_%03d.ts"`,
        `"${outputDir}/index.m3u8"`,
        `-y`, // overwrite if exists
    ].join(" ");
    execSync(cmd, { stdio: "inherit" });
}

// ab humara transcoding ho hogayi ab hume master playlist banani hogi!!

export const generateMasterPlaylist = (
    resolutions: Resolution[]
): string => {
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


