/**
 * Mux integration — recorded video upload, playback, and transcription.
 *
 * STATUS: Stub. Implements the real interface; mock mode returns deterministic
 * IDs so the rest of the app works without keys.
 *
 * To go live: install `@mux/mux-node`, set MUX_TOKEN_ID + MUX_TOKEN_SECRET, and
 * replace the marked TODOs with the SDK calls.
 */

const MOCK = !process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET;

export type MuxAsset = {
  assetId: string;
  playbackId: string;
  status: "preparing" | "ready" | "errored";
  duration?: number;
};

export type MuxUploadUrl = {
  uploadId: string;
  url: string;
};

export const mux = {
  /** Generate a direct-upload URL that the client can PUT a file to. */
  async createUploadUrl(): Promise<MuxUploadUrl> {
    if (MOCK) {
      const id = `mock-upload-${Math.random().toString(36).slice(2, 10)}`;
      return { uploadId: id, url: `https://mock.mux.local/upload/${id}` };
    }
    // TODO: const upload = await muxClient.video.uploads.create({...});
    throw new Error("Mux SDK not implemented yet.");
  },

  /** Fetch metadata for an asset by ID. */
  async getAsset(assetId: string): Promise<MuxAsset> {
    if (MOCK) {
      return {
        assetId,
        playbackId: `playback-${assetId}`,
        status: "ready",
        duration: 1800,
      };
    }
    throw new Error("Mux SDK not implemented yet.");
  },

  /** Build a playback URL from a playback ID. */
  playbackUrl(playbackId: string): string {
    return `https://stream.mux.com/${playbackId}.m3u8`;
  },

  /** Build a thumbnail URL from a playback ID. */
  thumbnailUrl(playbackId: string, time = 5): string {
    return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}`;
  },

  /** True if the integration is running in stub/mock mode. */
  isMock: MOCK,
};
