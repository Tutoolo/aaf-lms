"use client";

import { useState } from "react";

/**
 * Video player that adapts to mock vs. real Mux state.
 *
 * MOCK mode (playback ID starts with "mock-" / "demo-" or is short):
 *   Plays a small public sample MP4 so the experience is visible without
 *   requiring a Mux account. Shows a clear "Sample video" overlay.
 *
 * REAL mode (real Mux playback ID):
 *   Loads the Mux MP4 rendition via stream.mux.com — works in every browser
 *   without an HLS library. For adaptive streaming and analytics, swap in
 *   <MuxPlayer> from @mux/mux-player-react when going to production.
 */

// Small reliable public test video (~1.7 MB, hosted by W3Schools for ~10 years)
const SAMPLE_MP4 = "https://www.w3schools.com/html/mov_bbb.mp4";
// Backup if the primary fails (Internet Archive, also reliable)
const FALLBACK_MP4 =
  "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";

export function VideoPlayer({ playbackId }: { playbackId: string }) {
  const isMock =
    playbackId.startsWith("mock-") ||
    playbackId.startsWith("demo-") ||
    playbackId.length < 20;

  const [src, setSrc] = useState(
    isMock ? SAMPLE_MP4 : `https://stream.mux.com/${playbackId}/medium.mp4`,
  );
  const [errored, setErrored] = useState(false);

  function onError() {
    if (src === SAMPLE_MP4) {
      setSrc(FALLBACK_MP4); // try the backup once
    } else {
      setErrored(true);
    }
  }

  return (
    <div className="relative aspect-video bg-black">
      {errored ? (
        <div className="flex h-full w-full items-center justify-center text-cream">
          <div className="px-6 text-center text-sm">
            <p className="text-cream/80">
              Couldn't load the sample video (network blocked?).
            </p>
            <p className="mt-2 text-cream/60">
              Set <code className="rounded bg-brown-mid px-1.5 py-0.5">MUX_TOKEN_ID</code> in
              <code className="ml-1 rounded bg-brown-mid px-1.5 py-0.5">.env.local</code> for
              real playback.
            </p>
          </div>
        </div>
      ) : (
        <video
          key={src}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full"
          src={src}
          onError={onError}
          poster={isMock ? undefined : `https://image.mux.com/${playbackId}/thumbnail.jpg`}
        />
      )}

      {isMock && !errored && (
        <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-brown-deep/85 px-3 py-1.5 text-xs text-cream backdrop-blur">
          <div className="font-medium text-gold">Sample video</div>
          <div className="text-cream/70">
            Set MUX keys in .env.local for real playback
          </div>
        </div>
      )}
    </div>
  );
}
