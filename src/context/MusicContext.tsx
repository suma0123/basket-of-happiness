"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0 to 1
  currentTime: number;
  duration: number;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  isPendingGesture: boolean;
  togglePlay: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const AUDIO_SRC = "/audio/background-music.mp3";
const STORAGE_ENABLED_KEY = "boh_bgm_enabled";
const STORAGE_VOLUME_KEY = "boh_bgm_volume";
const STORAGE_MUTED_KEY = "boh_bgm_muted";
const SESSION_TIME_KEY = "boh_bgm_time";

// Module-level persistent audio singleton.
// Outlives React component mounts, unmounts, StrictMode, and page navigations.
let globalAudio: HTMLAudioElement | null = null;
let autoplayAttemptInProgress = false;
let gestureListenersAttached = false;
let removeGestureListeners: (() => void) | null = null;

/**
 * Returns or creates the persistent HTMLAudioElement singleton.
 */
function getOrCreateAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  if (!globalAudio) {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");

    // Restore volume and mute preferences from localStorage
    try {
      const savedVol = localStorage.getItem(STORAGE_VOLUME_KEY);
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        audio.volume = !isNaN(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0.35;
      } else {
        audio.volume = 0.35;
      }

      const savedMuted = localStorage.getItem(STORAGE_MUTED_KEY);
      audio.muted = savedMuted === "true";
    } catch {
      audio.volume = 0.35;
      audio.muted = false;
    }

    // Diagnostic event logging
    audio.addEventListener("loadstart", () => console.log("[BOH Audio Event] loadstart"));
    audio.addEventListener("loadedmetadata", () =>
      console.log(`[BOH Audio Event] loadedmetadata (duration: ${audio.duration.toFixed(1)}s)`)
    );
    audio.addEventListener("canplay", () =>
      console.log(`[BOH Audio Event] canplay (readyState: ${audio.readyState})`)
    );
    audio.addEventListener("canplaythrough", () =>
      console.log(`[BOH Audio Event] canplaythrough (readyState: ${audio.readyState})`)
    );
    audio.addEventListener("play", () =>
      console.log(`[BOH Audio Event] play (currentTime: ${audio.currentTime.toFixed(1)}s)`)
    );
    audio.addEventListener("playing", () => console.log("[BOH Audio Event] playing"));
    audio.addEventListener("pause", () =>
      console.log(`[BOH Audio Event] pause (currentTime: ${audio.currentTime.toFixed(1)}s)`)
    );
    audio.addEventListener("error", (e) => {
      const err = audio.error;
      console.warn("[BOH Audio Event] error:", err?.code, err?.message, e);
    });

    // Save playback position periodically to session storage for seamless reload continuity
    audio.addEventListener("timeupdate", () => {
      try {
        if (!isNaN(audio.currentTime) && audio.currentTime > 0) {
          sessionStorage.setItem(SESSION_TIME_KEY, String(audio.currentTime));
        }
      } catch {}
    });

    globalAudio = audio;
    (window as unknown as { __boh_audio?: HTMLAudioElement }).__boh_audio = audio;
  }

  return globalAudio;
}

/**
 * Returns a Promise that resolves when the audio element has loaded enough data to play.
 * Prevents calling play() on readyState 0 (HAVE_NOTHING).
 */
function waitForAudioReady(audio: HTMLAudioElement): Promise<void> {
  // readyState >= 2 means HAVE_CURRENT_DATA or higher (ready to begin playing)
  if (audio.readyState >= 2) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const onCanPlay = () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
      resolve();
    };
    const onError = () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
      resolve(); // resolve anyway to allow caller to handle playback rejection
    };

    audio.addEventListener("canplay", onCanPlay, { once: true });
    audio.addEventListener("error", onError, { once: true });
  });
}

/**
 * Restores the previous playback position from sessionStorage if valid.
 */
function restoreSavedPlaybackTime(audio: HTMLAudioElement) {
  try {
    const savedTimeStr = sessionStorage.getItem(SESSION_TIME_KEY);
    if (savedTimeStr !== null) {
      const parsed = parseFloat(savedTimeStr);
      if (
        !isNaN(parsed) &&
        parsed > 0 &&
        (!isNaN(audio.duration) ? parsed < audio.duration : true)
      ) {
        audio.currentTime = parsed;
        console.log(`[BOH Audio] Restored playback position to ${parsed.toFixed(1)}s`);
      }
    }
  } catch {}
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.35);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPendingGesture, setIsPendingGesture] = useState(false);

  // Cleanup gesture listeners helper
  const detachGestureListeners = useCallback(() => {
    if (removeGestureListeners) {
      removeGestureListeners();
      removeGestureListeners = null;
    }
    gestureListenersAttached = false;
    setIsPendingGesture(false);
  }, []);

  // Synchronize component state with persistent audio instance
  useEffect(() => {
    const audio = getOrCreateAudio();
    if (!audio) return;

    // Immediately sync current audio state after hydration
    setIsPlaying(!audio.paused && !audio.ended);
    setIsMuted(audio.muted);
    setVolumeState(audio.volume);
    setCurrentTime(audio.currentTime);
    if (!isNaN(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }

    // Audio event listeners
    const onPlay = () => {
      setIsPlaying(true);
      setIsPendingGesture(false);
      try {
        localStorage.setItem(STORAGE_ENABLED_KEY, "true");
      } catch {}
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setHasError(false);
      setErrorMessage(null);
    };

    const onError = () => {
      setIsPlaying(false);
      setHasError(true);
      setErrorMessage("Audio file unavailable or failed to load");
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);

    // Initial load & refresh recovery
    const initiateAutoplay = async () => {
      if (autoplayAttemptInProgress) return;
      autoplayAttemptInProgress = true;

      // Check stored preference: default is TRUE unless explicitly paused ("false")
      let shouldPlay = true;
      try {
        const storedPref = localStorage.getItem(STORAGE_ENABLED_KEY);
        if (storedPref === "false") {
          shouldPlay = false;
        }
      } catch {}

      console.log(`[BOH Audio Init] Page loaded. Stored preference shouldPlay: ${shouldPlay}`);

      if (!shouldPlay) {
        console.log("[BOH Audio Init] Music explicitly disabled in preferences. Autoplay skipped.");
        return;
      }

      // If already playing (e.g. fast client-side transition), do nothing
      if (!audio.paused && !audio.ended) {
        setIsPlaying(true);
        return;
      }

      console.log("[BOH Audio Init] Waiting for audio to be ready before attempting playback...");
      await waitForAudioReady(audio);
      restoreSavedPlaybackTime(audio);

      // Attempt direct audible autoplay
      console.log("[BOH Audio Init] Audio ready. Attempting direct audible audio.play()...");
      try {
        await audio.play();
        console.log("[BOH Audio Init] SUCCESS: Direct audible autoplay succeeded!");
        setIsPlaying(true);
        setIsPendingGesture(false);
      } catch (err: unknown) {
        const error = err as Error;
        console.warn(
          `[BOH Audio Init] Direct autoplay rejected by browser policy: ${error.name} - ${error.message}`
        );
        console.log(
          "[BOH Audio Init] Preserving user preference=true. Attaching gesture listener for first user interaction."
        );

        // DO NOT set preference to "false". Preserve the visitor's preference!
        setIsPendingGesture(true);

        // Attach one-time trusted gesture listeners
        if (!gestureListenersAttached) {
          gestureListenersAttached = true;

          const gestureEvents = ["pointerdown", "touchend", "keydown"];
          let interactionHandled = false;

          const handleUserInteraction = async (evt: Event) => {
            if (interactionHandled) return;

            // Check if preference was changed to false in the meantime
            if (localStorage.getItem(STORAGE_ENABLED_KEY) === "false") {
              cleanupGestures();
              return;
            }

            console.log(
              `[BOH Audio Gesture] First user gesture detected (${evt.type}). Starting playback...`
            );
            interactionHandled = true;
            cleanupGestures();

            try {
              if (audio.paused) {
                await audio.play();
                console.log("[BOH Audio Gesture] SUCCESS: Playback started via user interaction!");
                setIsPlaying(true);
                setIsPendingGesture(false);
              }
            } catch (playErr) {
              console.warn("[BOH Audio Gesture] Playback retry on gesture failed:", playErr);
            }
          };

          const cleanupGestures = () => {
            console.log("[BOH Audio Gesture] Cleaning up gesture listeners.");
            gestureEvents.forEach((type) => {
              window.removeEventListener(type, handleUserInteraction, { capture: true });
            });
            gestureListenersAttached = false;
            removeGestureListeners = null;
            setIsPendingGesture(false);
          };

          removeGestureListeners = cleanupGestures;

          gestureEvents.forEach((type) => {
            window.addEventListener(type, handleUserInteraction, {
              capture: true,
              passive: true,
            });
          });
        }
      }
    };

    initiateAutoplay();

    // React cleanup: DO NOT pause audio here (allows persistent playback during route transitions)
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
    };
  }, [detachGestureListeners]);

  // Explicit user play action
  const play = useCallback(async () => {
    const audio = getOrCreateAudio();
    if (!audio) return;

    try {
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(null);

      // Clean up any pending auto-start gesture listeners
      detachGestureListeners();

      // Persist user preference: enabled
      try {
        localStorage.setItem(STORAGE_ENABLED_KEY, "true");
      } catch {}

      await waitForAudioReady(audio);
      await audio.play();
      setIsPlaying(true);
      setIsPendingGesture(false);
    } catch (err: unknown) {
      console.warn("[BOH Audio] Play request failed:", err);
      setIsPlaying(false);
      const msg = err instanceof Error ? err.message : "Playback error";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [detachGestureListeners]);

  // Explicit user pause action
  const pause = useCallback(() => {
    const audio = getOrCreateAudio();
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);

    // Clean up any pending auto-start gesture listeners so subsequent clicks don't restart it
    detachGestureListeners();

    // Persist user preference: explicitly disabled
    try {
      localStorage.setItem(STORAGE_ENABLED_KEY, "false");
    } catch {}
  }, [detachGestureListeners]);

  // Toggle play/pause
  const togglePlay = useCallback(async () => {
    const audio = getOrCreateAudio();
    if (!audio) return;

    if (!audio.paused && !audio.ended) {
      pause();
    } else {
      await play();
    }
  }, [pause, play]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = getOrCreateAudio();
    if (!audio) return;

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);

    try {
      localStorage.setItem(STORAGE_MUTED_KEY, String(nextMuted));
    } catch {}
  }, []);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    const audio = getOrCreateAudio();
    if (!audio) return;

    const clamped = Math.max(0, Math.min(1, newVolume));
    audio.volume = clamped;
    setVolumeState(clamped);

    if (clamped > 0 && audio.muted) {
      audio.muted = false;
      setIsMuted(false);
      try {
        localStorage.setItem(STORAGE_MUTED_KEY, "false");
      } catch {}
    }

    try {
      localStorage.setItem(STORAGE_VOLUME_KEY, String(clamped));
    } catch {}
  }, []);

  // Seek
  const seek = useCallback((time: number) => {
    const audio = getOrCreateAudio();
    if (audio && isFinite(time)) {
      audio.currentTime = time;
      setCurrentTime(time);
      try {
        sessionStorage.setItem(SESSION_TIME_KEY, String(time));
      } catch {}
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTime,
        duration,
        isLoading,
        hasError,
        errorMessage,
        isPendingGesture,
        togglePlay,
        play,
        pause,
        toggleMute,
        setVolume,
        seek,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
