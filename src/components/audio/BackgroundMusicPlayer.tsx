"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMusic } from "@/context/MusicContext";

export default function BackgroundMusicPlayer() {
  const {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    isLoading,
    hasError,
    isPendingGesture,
    togglePlay,
    toggleMute,
    setVolume,
    seek,
  } = useMusic();

  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 left-5 z-40 select-none print:hidden transition-all duration-300 font-sans"
      aria-label="Background Music Controller"
    >
      {/* EXPANDED LUXURY AUDIO CONTROLLER CARD */}
      {isExpanded && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl bg-[#FFF9F0]/95 backdrop-blur-xl border border-[#B8A28A]/40 shadow-2xl p-4 text-[#1C201D] animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#B8A28A]/20">
            <div className="flex items-center gap-2.5">
              {/* Spinning Vinyl / Disc Icon */}
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-tr from-[#234E3F] to-[#2e6451] flex items-center justify-center text-white shadow-sm ${
                  isPlaying ? "animate-spin" : ""
                }`}
                style={{ animationDuration: "6s" }}
              >
                <svg
                  className="w-4 h-4 text-[#E6D7C3]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="3" fill="#FFF9F0" />
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-semibold tracking-wide text-[#234E3F] font-serif">
                  BOH Signature Ambience
                </h4>
                <p suppressHydrationWarning className="text-[10px] text-[#555E54] tracking-tight">
                  {isPlaying
                    ? "Playing luxury serenade (Looping)"
                    : isPendingGesture
                    ? "Tap anywhere to play serenade"
                    : "Music paused"}
                </p>
              </div>
            </div>

            {/* Close popover button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#555E54] hover:text-[#1C201D] hover:bg-[#B8A28A]/20 transition-colors"
              aria-label="Collapse player"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Timeline Scrubber */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-[#555E54] font-mono mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="relative w-full h-1.5 bg-[#E6D7C3]/60 rounded-full cursor-pointer overflow-hidden group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = clickX / rect.width;
                if (duration > 0) seek(pct * duration);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-[#234E3F] via-[#7A1B28] to-[#58111A] rounded-full transition-all duration-100 group-hover:from-[#C8A876] group-hover:to-[#58111A]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls: Play/Pause, Mute, Volume */}
          <div className="mt-4 flex items-center justify-between gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={() => togglePlay()}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#234E3F] text-[#FFF9F0] hover:bg-[#1B3B30] active:scale-95 transition-all text-xs font-medium shadow-md shadow-[#234E3F]/20"
              aria-label={isPlaying ? "Pause background music" : "Play background music"}
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-[#FFF9F0] border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Volume Control & Mute */}
            <div className="flex items-center gap-2 flex-1 max-w-[130px]">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full text-[#234E3F] hover:bg-[#B8A28A]/20 transition-colors"
                aria-label={isMuted ? "Unmute music" : "Mute music"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#E6D7C3] rounded-lg appearance-none cursor-pointer accent-[#234E3F]"
                aria-label="Volume slider"
              />
              <span className="text-[10px] text-[#555E54] font-mono min-w-[24px]">
                {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>

          {/* Error notice if audio file fails to load */}
          {hasError && (
            <div className="mt-2 text-[10px] text-amber-700 bg-amber-50 rounded-lg p-1.5 border border-amber-200">
              Audio file temporarily unavailable.
            </div>
          )}
        </div>
      )}

      {/* COMPACT FLOATING LUXURY PILL */}
      <div className="flex items-center gap-1.5 rounded-full bg-[#FFF9F0]/90 backdrop-blur-md border border-[#B8A28A]/35 shadow-lg p-1.5 pr-3 hover:bg-[#FFF9F0] hover:border-[#B8A28A]/60 transition-all duration-200 group">
        {/* Play/Pause Quick Toggle Circle */}
        <button
          onClick={() => togglePlay()}
          disabled={isLoading}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all transform active:scale-90 ${
            isPlaying
              ? "bg-[#234E3F] shadow-sm shadow-[#234E3F]/30"
              : isPendingGesture
              ? "bg-[#234E3F]/85 shadow-sm shadow-[#234E3F]/30 hover:bg-[#234E3F]"
              : "bg-[#555E54] hover:bg-[#234E3F]"
          }`}
          aria-label={
            isPlaying
              ? "Pause background music"
              : isPendingGesture
              ? "Play background music (Standby)"
              : "Play background music"
          }
          title={
            isPlaying
              ? "Pause background music"
              : isPendingGesture
              ? "Click to start music"
              : "Play background music"
          }
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <svg className="w-4 h-4 text-[#FFF9F0]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-[#FFF9F0] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Animated Equalizer Waveform & Expand Trigger */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 text-left pl-1 group-hover:opacity-100 transition-opacity"
          aria-label={isExpanded ? "Collapse music details" : "Expand music details"}
        >
          {/* Animated 4-bar equalizer */}
          <div className="flex items-end gap-0.5 h-4 w-4">
            <span
              className={`w-0.5 bg-[#234E3F] rounded-full transition-all duration-200 ${
                isPlaying ? "animate-pulse h-3" : isPendingGesture ? "h-2 bg-[#234E3F]/70" : "h-1 opacity-50"
              }`}
              style={{ animationDelay: "0ms" }}
            />
            <span
              className={`w-0.5 bg-[#58111A] rounded-full transition-all duration-200 ${
                isPlaying ? "animate-pulse h-4" : isPendingGesture ? "h-3 bg-[#58111A]/70" : "h-2 opacity-50"
              }`}
              style={{ animationDelay: "150ms" }}
            />
            <span
              className={`w-0.5 bg-[#234E3F] rounded-full transition-all duration-200 ${
                isPlaying ? "animate-pulse h-2.5" : isPendingGesture ? "h-2.5 bg-[#234E3F]/70" : "h-1.5 opacity-50"
              }`}
              style={{ animationDelay: "300ms" }}
            />
            <span
              className={`w-0.5 bg-[#58111A] rounded-full transition-all duration-200 ${
                isPlaying ? "animate-pulse h-3.5" : isPendingGesture ? "h-3 bg-[#58111A]/70" : "h-1 opacity-50"
              }`}
              style={{ animationDelay: "450ms" }}
            />
          </div>

          {/* Text indicator */}
          <div className="flex flex-col">
            <span suppressHydrationWarning className="text-[11px] font-medium text-[#1C201D] leading-none tracking-tight">
              {!mounted
                ? "Background Music"
                : isPlaying
                ? "Music Playing"
                : isPendingGesture
                ? "Tap to Play"
                : "Music Paused"}
            </span>
            <span suppressHydrationWarning className="text-[9px] text-[#555E54] tracking-tight leading-none mt-0.5">
              {!mounted
                ? "Boutique BGM"
                : isMuted
                ? "Muted"
                : `${Math.round(volume * 100)}% volume`}
            </span>
          </div>

          {/* Subtle chevron */}
          <svg
            className={`w-3.5 h-3.5 text-[#555E54] transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
