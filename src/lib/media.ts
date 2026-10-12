/* Placeholder lesson footage.
 *
 * The real lessons live on YouTube; until each topic has its own video URL,
 * every player and thumbnail in the LMS uses one of these public sample clips
 * so the interface reads like a real learning platform. Swap `lessonVideo`
 * for a per-topic lookup when the recordings are wired in. */

import { hash } from "@/data/curriculum";

const SAMPLE_CLIPS = [
  "https://vjs.zencdn.net/v/oceans.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
];

export function lessonVideo(topicId: string): string {
  return SAMPLE_CLIPS[hash(topicId) % SAMPLE_CLIPS.length];
}

/** A URL that makes the browser paint a representative frame as a poster. */
export function lessonThumb(topicId: string): string {
  return `${lessonVideo(topicId)}#t=3`;
}

/* Placeholder thumbnails: real YouTube tutorial thumbnails (Python, RAG,
 * agents/MCP, Docker/Kubernetes, system design), assigned to lessons by a
 * stable hash so each lesson always shows the same one. Replace with the
 * programme's own video IDs when the lessons are published. */
const SAMPLE_YT_IDS = [
  "qN_2fnOPY-M", "vAK0iqA6-QI", "RosLeHGBLoY", "YLPNA1j7kmQ", "gweRh5Xtkq0", "sVcwVQRHIc8",
  "LwPpGUYTb2E", "gYoIOb7q9A4", "rfscVS0vtbw", "eWRfhZUzrAc", "ERCMXc8x7mc", "qHx8if-2lPw",
  "Rq5gJVxz55Q", "lKJfUvS9rMU", "sxTmJE4k0ho", "XnSasPR2KJI", "_aWbUudZ5Yo", "OvOQJba-edM",
  "BVnrTXPrHow", "h7xFlch7c_o", "kVGbMtH7PXI", "kTp5xUtcalw", "TiLvrUxJEo4", "PInLETR-cKU",
  "O-LXtyjh1HM", "F9mgEFor0cA", "2QjrYLT9NMw", "BM39OouLNsM", "T9t9kDXY92U", "Iy1yF_SAmUY",
  "HKGJQknq4JE",
];

/** YouTube-style thumbnail image for a lesson (480×360; crop to 16:9 with object-cover). */
export function lessonThumbnail(topicId: string): string {
  return `https://i.ytimg.com/vi/${SAMPLE_YT_IDS[hash(topicId + "yt") % SAMPLE_YT_IDS.length]}/hqdefault.jpg`;
}
