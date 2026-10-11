"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ArrowRight, ExternalLink, Play, Video, Trash2, Cast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/useGameStore";

const STORAGE_KEY = "termo-video-link";
const DEFAULT_LINK = "";

/**
 * Ubah tautan YouTube / Google Drive menjadi URL embed.
 * YouTube: youtu.be, watch?v=, shorts, live, embed, m.youtube.com.
 * Drive: /file/d/ID/view, /open?id=ID, /uc?id=ID, docs.google.com/uc?id=ID.
 */
function getEmbedUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.toLowerCase();
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com") ||
      hostname === "youtube-nocookie.com" ||
      hostname.endsWith(".youtube-nocookie.com")
    ) {
      videoId =
        url.searchParams.get("v") ??
        url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ??
        "";
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&playsinline=1&enablejsapi=1`;
    }

    if (
      hostname === "drive.google.com" ||
      hostname.endsWith(".drive.google.com") ||
      hostname === "docs.google.com" ||
      hostname.endsWith(".docs.google.com")
    ) {
      const match =
        url.pathname.match(/\/d\/([^/]+)/) ??
        (url.searchParams.get("id")
          ? [null, url.searchParams.get("id") as string]
          : null);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${encodeURIComponent(match[1])}/preview`;
      }
    }
  } catch {
    return "";
  }
  return "";
}

/** Baca tautan tersimpan dari localStorage (dipisah agar pure & aman SSR). */
function readSavedLink() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && getEmbedUrl(saved) ? saved : "";
  } catch {
    return "";
  }
}

export default function ScreenVideoPemantik() {
  const nextScreen = useGameStore((state) => state.nextScreen);
  const [link, setLink] = useState(DEFAULT_LINK);
  const [videoUrl, setVideoUrl] = useState(DEFAULT_LINK);
  const [videoError, setVideoError] = useState(false);
  const [
    localFile,
    setLocalFile,
  ] = useState<File | null>(null);
  const [
    localUrl,
    setLocalUrl,
  ] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const embedUrl = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);
  const isSupportedLink = link.trim() === "" || getEmbedUrl(link) !== "";
  const loadVideo = () => {
    setVideoError(false);
    setVideoUrl(link.trim());
  };

  // restore link tersimpan (guru cukup tempel tautan sekali).
  // setState dipanggil di dalam callback (bukan sinkron di body effect)
  // agar render tidak berantai (react-hooks/set-state-in-effect).
  useEffect(() => {
    const saved = readSavedLink();
    if (!saved) return;
    const t = setTimeout(() => {
      setLink(saved);
      setVideoUrl(saved);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // simpan link saat berubah
  useEffect(() => {
    try {
      if (videoUrl) localStorage.setItem(STORAGE_KEY, videoUrl);
    } catch {
      /* abaikan */
    }
  }, [videoUrl]);

  // bersihkan objectURL bila file berubah
  useEffect(() => {
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [localUrl]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setVideoError(true);
      event.target.value = "";
      return;
    }
    setLocalFile(file);
    setLocalUrl(URL.createObjectURL(file));
    setVideoError(false);
  }, []);

  const chooseFromDevice = useCallback(() => fileInputRef.current?.click(), []);

  const clearLocal = useCallback(() => {
    setLocalFile(null);
    if (localUrl) URL.revokeObjectURL(localUrl);
    setLocalUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [localUrl]);

  const showLocal = !!localUrl && !(videoRef.current?.ended ?? false);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-145px)] max-w-5xl flex-col items-center gap-6 px-4 py-8 sm:py-12">
      <div className="text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[#EAF6FF] text-[#2777BA]">
          <Video className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#1F2A44] sm:text-5xl">Video Pemantik</h1>
        <h2 className="mt-2 font-serif text-xl font-bold text-[#E36D50] sm:text-2xl">
          Bu Guru Zindo
        </h2>
        <p className="mt-2 text-base font-semibold text-[#5B6B85] sm:text-lg">
          Simak video berikut, lalu kita mulai misi bilangan bulat.
        </p>
      </div>

      <section className="w-full rounded-3xl border border-[#D7E4F0] bg-white p-4 shadow-[0_18px_50px_rgba(31,42,68,0.12)] sm:p-6">
        <div className="aspect-video overflow-hidden rounded-2xl bg-[#16263A]">
          {embedUrl && !videoError && !localFile ? (
            <iframe
              key={embedUrl}
              className="h-full w-full"
              src={embedUrl}
              title="Video pemantik pembelajaran bilangan bulat"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setVideoError(true)}
            />
          ) : showLocal ? (
            <video
              ref={videoRef}
              className="h-full w-full"
              src={localUrl}
              autoPlay
              controls
              playsInline
              muted
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
              <Play className="mb-3 h-12 w-12 text-[#8FD3FF]" />
              <p className="text-lg font-bold">
                {videoError ? "Video tidak dapat dimuat di dalam aplikasi" : "Tempel tautan video atau pilih dari perangkat untuk mulai menonton"}
              </p>
              <p className="mt-1 max-w-lg text-sm text-white/70">
                {videoError
                  ? "Coba buka di tab baru, atau pastikan video mengizinkan embedding."
                  : "Mendukung tautan YouTube dan Google Drive, atau putar video dari file di perangkat."}
              </p>
              {videoUrl && (
                <Button
                  type="button"
                  asChild
                  className="mt-4 rounded-xl bg-[#8FD3FF] font-bold text-[#16263A] hover:bg-white"
                >
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Buka di tab baru
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="video-link" className="text-sm font-bold text-[#1F2A44]">Tautan video YouTube atau Google Drive</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="video-link"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && isSupportedLink && link.trim()) loadVideo();
              }}
              placeholder="https://youtu.be/... atau https://drive.google.com/file/d/.../view"
              className="h-12 min-w-0 flex-1 rounded-xl border border-[#C9D9E8] px-4 text-sm text-[#1F2A44] outline-none transition focus:border-[#2777BA] focus:ring-2 focus:ring-[#2777BA]/20"
            />
            <div className="flex gap-2">
              <Button type="button" onClick={loadVideo} disabled={!isSupportedLink || !link.trim()} className="h-12 rounded-xl bg-[#2777BA] font-bold text-white hover:bg-[#1f659f]">
                Putar Video
              </Button>
              {localFile ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearLocal}
                  className="h-12 rounded-xl border-[#2777BA]/30 text-[#2777BA]"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus lokal
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLink("");
                    setVideoUrl("");
                    setVideoError(false);
                    try {
                      localStorage.removeItem(STORAGE_KEY);
                    } catch {
                      /* abaikan */
                    }
                  }}
                  disabled={!link}
                  className="h-12 rounded-xl border-[#2777BA]/30 text-[#2777BA]"
                >
                  Bersihkan
                </Button>
              )}
              {videoUrl && !localFile && (
                <Button type="button" variant="outline" asChild className="h-12 rounded-xl border-[#2777BA]/30 text-[#2777BA]">
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Tab baru
                  </a>
                </Button>
              )}
              {localFile && (
                <Button type="button" variant="outline" onClick={() => videoRef.current?.play?.()} className="h-12 rounded-xl border-[#2777BA]/30 text-[#2777BA]">
                  <Play className="mr-2 h-4 w-4" />
                  Putar
                </Button>
              )}
            </div>
          </div>
          {!isSupportedLink && !localFile && <p className="mt-2 text-sm font-semibold text-red-600">Masukkan tautan YouTube atau Google Drive yang valid.</p>}
          {localFile && <p className="mt-2 text-sm font-semibold text-[#1E6FD9]">Memutar dari perangkat: {localFile.name}</p>}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        <Button type="button" variant="outline" onClick={chooseFromDevice} className="h-13 rounded-2xl text-base font-extrabold border-[#1E6FD9] text-[#1E6FD9]">
          <Cast className="mr-2 h-5 w-5" />
          Pilih dari perangkat
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button onClick={nextScreen} size="lg" className="h-13 rounded-2xl bg-[#2777BA] px-7 text-base font-extrabold text-white shadow-lg hover:bg-[#1f659f]">
          Lanjut ke Misi
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
