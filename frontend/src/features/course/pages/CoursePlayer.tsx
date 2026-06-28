import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../lib/authInstance";

/* ─── Types ─── */
interface Lesson {
  _id: string; title: string; description: string;
  duration: number; isPreview: boolean; order: number; videoUrl?: string;
}
interface Section { _id: string; title: string; order: number; lessons: Lesson[]; }
interface CourseData {
  _id: string; title: string; description: string;
  thumbnail: string; price: number; isPublished: boolean; sections: Section[];
}

/* ─── Helpers ─── */
function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
function flatLessons(sections: Section[]): Lesson[] {
  return sections.flatMap((s) => s.lessons);
}

/* ─── Icons ─── */
const PlayIcon = () => <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const SeekBack = () => <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.41c0 .45-.08.79-.24 1.03-.16.24-.4.37-.71.37-.31 0-.55-.12-.71-.37-.16-.24-.24-.58-.24-1.03v-.47c0-.45.08-.79.24-1.03.16-.24.4-.36.71-.36.31 0 .55.12.71.36.16.24.24.58.24 1.03v.47zm-.85-1.25c-.07.13-.1.34-.1.64v.38c0 .3.03.51.1.64.07.13.17.2.3.2.13 0 .23-.07.3-.2.07-.13.1-.34.1-.64v-.38c0-.3-.03-.51-.1-.64-.07-.13-.17-.2-.3-.2-.13 0-.23.07-.3.2z"/></svg>;
const SeekFwd = () => <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.41c0 .45-.08.79-.24 1.03-.16.24-.4.37-.71.37-.31 0-.55-.12-.71-.37-.16-.24-.24-.58-.24-1.03v-.47c0-.45.08-.79.24-1.03.16-.24.4-.36.71-.36.31 0 .55.12.71.36.16.24.24.58.24 1.03v.47zm-.85-1.25c-.07.13-.1.34-.1.64v.38c0 .3.03.51.1.64.07.13.17.2.3.2.13 0 .23-.07.3-.2.07-.13.1-.34.1-.64v-.38c0-.3-.03-.51-.1-.64-.07-.13-.17-.2-.3-.2-.13 0-.23.07-.3.2z"/></svg>;
const VolumeIcon = ({ muted, volume }: { muted: boolean; volume: number }) => {
  if (muted || volume === 0) return <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>;
  if (volume < 0.5) return <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>;
  return <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
};
const FullscreenIcon = ({ active }: { active: boolean }) => active
  ? <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
  : <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>;
const LockIcon = () => <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>;
const CheckCircleIcon = () => <svg className="w-3.5 h-3.5 text-white/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const MenuIcon = () => <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>;

/* ─── SidebarSection ─── */
function SidebarSection({ section, currentLessonId, completedLessons, onSelectLesson }: {
  section: Section; currentLessonId: string;
  completedLessons: Set<string>; onSelectLesson: (l: Lesson) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-white/5">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors text-left">
        <span className="text-xs font-bold text-white/60 uppercase tracking-wider truncate pr-2">{section.title}</span>
        <svg className={`w-3.5 h-3.5 text-white/30 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
            {section.lessons.map((lesson) => {
              const isActive = lesson._id === currentLessonId;
              const isCompleted = completedLessons.has(lesson._id);
              const hasVideo = !!lesson.videoUrl;
              return (
                <button key={lesson._id} onClick={() => hasVideo && onSelectLesson(lesson)} disabled={!hasVideo}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors relative
                    ${isActive ? "bg-white/[0.06] border-l-2 border-white" : "border-l-2 border-transparent hover:bg-white/[0.03]"}
                    ${!hasVideo ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                  <div className="mt-0.5 shrink-0">
                    {!hasVideo ? <LockIcon /> : isCompleted ? <CheckCircleIcon /> : (
                      <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium leading-snug truncate ${isActive ? "text-white" : "text-white/60"}`}>{lesson.title}</p>
                    {lesson.duration > 0 && <p className="text-white/25 text-[10px] mt-0.5">{formatTime(lesson.duration)}</p>}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── VideoPlayer ─── */
function VideoPlayer({ videoUrl, onEnded }: { videoUrl: string; onEnded: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [qualities, setQualities] = useState<{ label: string; index: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);

  // HLS load
  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;
    const video = videoRef.current;
    setIsLoading(true); setPlaying(false);
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoading(false);
        setQualities(data.levels.map((l, i) => ({ label: l.height ? `${l.height}p` : `Level ${i}`, index: i })));
        setCurrentQuality(-1);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else { hls.destroy(); hls.loadSource(videoUrl); hls.attachMedia(video); }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => setIsLoading(false), { once: true });
      video.play().catch(() => {});
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [videoUrl]);

  // Video event listeners + rAF progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onDurChange = () => setDuration(video.duration);
    const onVolChange = () => { setVolume(video.volume); setMuted(video.muted); };
    const onEnded_ = () => { setPlaying(false); onEnded(); };
    const tick = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) setBuffered(video.buffered.end(video.buffered.length - 1));
      rafRef.current = requestAnimationFrame(tick);
    };
    video.addEventListener("play", onPlay); video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting); video.addEventListener("canplay", onCanPlay);
    video.addEventListener("durationchange", onDurChange); video.addEventListener("volumechange", onVolChange);
    video.addEventListener("ended", onEnded_);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      video.removeEventListener("play", onPlay); video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting); video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("durationchange", onDurChange); video.removeEventListener("volumechange", onVolChange);
      video.removeEventListener("ended", onEnded_);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onEnded]);

  // Fullscreen change
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) v.play().catch(() => {}); else v.pause();
  }, []);

  // Keyboard: Space = play/pause, Left/Right = seek ±10s
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "SELECT") return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.code === "ArrowRight") { e.preventDefault(); const v = videoRef.current; if (v) v.currentTime = Math.min(v.duration, v.currentTime + 10); }
      if (e.code === "ArrowLeft") { e.preventDefault(); const v = videoRef.current; if (v) v.currentTime = Math.max(0, v.currentTime - 10); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [togglePlay]);

  const seek = (secs: number) => { const v = videoRef.current; if (!v) return; v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + secs)); };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => { const v = videoRef.current; if (!v || !duration) return; v.currentTime = (Number(e.target.value) / 1000) * duration; };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => { const v = videoRef.current; if (!v) return; const val = Number(e.target.value) / 100; v.volume = val; v.muted = val === 0; };
  const toggleMute = () => { const v = videoRef.current; if (v) v.muted = !v.muted; };
  const setRate = (r: number) => { const v = videoRef.current; if (v) v.playbackRate = r; setSpeed(r); };
  const setQuality = (i: number) => { if (hlsRef.current) hlsRef.current.currentLevel = i; setCurrentQuality(i); };
  const toggleFS = () => { const el = containerRef.current; if (!el) return; if (!document.fullscreenElement) el.requestFullscreen(); else document.exitFullscreen(); };

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => { if (!playing) setShowControls(true); }, [playing]);

  const seekPct = duration > 0 ? (currentTime / duration) * 1000 : 0;
  const bufPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
      onMouseMove={revealControls} onMouseLeave={() => playing && setShowControls(false)}
      onTouchStart={revealControls}>
      <video ref={videoRef} className="w-full h-full object-contain" onClick={togglePlay} playsInline />

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
          <span className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"/>
        </div>
      )}

      {/* Controls overlay */}
      <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 pointer-events-none ${showControls ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)" }}>

        {/* ── Seek bar ── */}
        <div className="px-3 sm:px-4 pointer-events-auto" style={{ paddingBottom: "6px" }}>
          <div className="relative h-5 flex items-center">
            {/* Track base */}
            <div className="absolute inset-x-0 h-1 rounded-full bg-white/15">
              {/* Buffered */}
              <div className="h-full rounded-full bg-white/30 transition-all" style={{ width: `${bufPct}%` }}/>
              {/* Played */}
              <div className="absolute top-0 left-0 h-full rounded-full bg-white pointer-events-none" style={{ width: `${seekPct / 10}%` }}/>
            </div>
            <input type="range" min={0} max={1000} step={1} value={Math.round(seekPct)} onChange={handleSeek}
              className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer z-10 touch-none"
              style={{ margin: 0, padding: 0 }}/>
            {/* Thumb — perfectly centered on track */}
            <div className="absolute h-3 w-3 rounded-full bg-white shadow-md pointer-events-none"
              style={{ left: `calc(${seekPct / 10}% - 6px)`, top: "50%", transform: "translateY(-50%)" }}/>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 pb-3 pointer-events-auto flex-wrap sm:flex-nowrap">
          {/* Play/Pause */}
          <button onClick={togglePlay} className="p-1.5 hover:scale-110 transition-transform shrink-0">
            {playing ? <PauseIcon/> : <PlayIcon/>}
          </button>

          {/* Seek -10 / +10 */}
          <button onClick={() => seek(-10)} className="p-1.5 hover:scale-110 transition-transform shrink-0" title="Back 10s"><SeekBack/></button>
          <button onClick={() => seek(10)}  className="p-1.5 hover:scale-110 transition-transform shrink-0" title="Forward 10s"><SeekFwd/></button>

          {/* Volume — hidden on small screens */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <button onClick={toggleMute} className="p-1.5 hover:scale-110 transition-transform"><VolumeIcon muted={muted} volume={volume}/></button>
            <input type="range" min={0} max={100} step={1} value={muted ? 0 : Math.round(volume * 100)} onChange={handleVolume}
              className="w-16 h-1 appearance-none rounded-full cursor-pointer bg-white/20
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"/>
          </div>

          {/* Time */}
          <span className="text-white/70 text-xs font-mono select-none">{formatTime(currentTime)} / {formatTime(duration)}</span>

          <div className="flex-1"/>

          {/* Speed */}
          <select value={speed} onChange={(e) => setRate(Number(e.target.value))}
            className="bg-black/60 border border-white/15 text-white text-xs rounded px-1.5 py-1 cursor-pointer outline-none hidden sm:block">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(r => <option key={r} value={r} className="bg-neutral-900">{r}x</option>)}
          </select>

          {/* Quality */}
          {qualities.length > 0 && (
            <select value={currentQuality} onChange={(e) => setQuality(Number(e.target.value))}
              className="bg-black/60 border border-white/15 text-white text-xs rounded px-1.5 py-1 cursor-pointer outline-none hidden sm:block">
              <option value={-1} className="bg-neutral-900">Auto</option>
              {qualities.map(q => <option key={q.index} value={q.index} className="bg-neutral-900">{q.label}</option>)}
            </select>
          )}

          {/* Fullscreen */}
          <button onClick={toggleFS} className="p-1.5 hover:scale-110 transition-transform shrink-0"><FullscreenIcon active={isFullscreen}/></button>
        </div>
      </div>
    </div>
  );
}

/* ─── CoursePlayer (main page) ─── */
export default function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!courseId) return;
    axiosInstance.get(`/course/getCourse/${courseId}`)
      .then((res) => {
        const data: CourseData = res.data?.data ?? res.data;
        setCourse(data);
        const first = flatLessons(data.sections).find(l => !!l.videoUrl);
        if (first) setCurrentLesson(first);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [courseId]);

  const markComplete = useCallback(async (lessonId: string) => {
    setCompletedLessons(prev => new Set(prev).add(lessonId));
    try { await axiosInstance.patch(`/progress/lesson/${lessonId}/complete`, { courseId }); } catch {}
  }, [courseId]);

  const advanceToNext = useCallback(() => {
    if (!course || !currentLesson) return;
    const all = flatLessons(course.sections);
    const next = all.slice(all.findIndex(l => l._id === currentLesson._id) + 1).find(l => !!l.videoUrl);
    if (next) {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = setTimeout(() => setCurrentLesson(next), 3000);
    }
  }, [course, currentLesson]);

  const handleVideoEnded = useCallback(() => {
    if (!currentLesson) return;
    markComplete(currentLesson._id);
    advanceToNext();
  }, [currentLesson, markComplete, advanceToNext]);

  useEffect(() => () => { if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current); }, []);

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center pt-[68px]">
      <span className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin"/>
    </div>
  );
  if (notFound || !course) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4 pt-[68px]">
      <p className="text-white/40 text-lg">Course not found.</p>
      <button onClick={() => navigate(-1)} className="text-sm text-white/60 hover:text-white underline underline-offset-4">← Go back</button>
    </div>
  );

  const totalCount = flatLessons(course.sections).length;

  return (
    <div className="h-screen bg-neutral-950 flex flex-col pt-[68px] overflow-hidden text-white">
      {/* Header */}
      <div className="h-12 shrink-0 bg-[#111] border-b border-white/5 flex items-center px-3 sm:px-4 gap-3">
        <button onClick={() => navigate(`/course/${courseId}`)}
          className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm font-medium shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="w-px h-4 bg-white/10 shrink-0"/>
        <h1 className="text-white text-sm font-semibold truncate flex-1">{course.title}</h1>
        {currentLesson && <span className="text-white/30 text-xs truncate max-w-[160px] hidden md:block">{currentLesson.title}</span>}
        {/* Sidebar toggle button */}
        <button onClick={() => setSidebarOpen(v => !v)}
          className="p-1.5 text-white/50 hover:text-white transition-colors shrink-0 ml-auto sm:ml-0" title="Toggle course content">
          <MenuIcon/>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-w-0">
          {currentLesson?.videoUrl ? (
            <VideoPlayer key={currentLesson._id} videoUrl={currentLesson.videoUrl} onEnded={handleVideoEnded}/>
          ) : (
            <div className="text-white/20 text-sm text-center p-8">
              <p className="text-4xl mb-4">🔒</p>
              <p>Select a lesson from the sidebar to start learning.</p>
            </div>
          )}
        </div>

        {/* Sidebar — slide in/out */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 bg-[#0d0d0d] border-l border-white/5 flex flex-col overflow-hidden"
              style={{ minWidth: 0 }}
            >
              <div className="px-4 py-3 border-b border-white/5 shrink-0 flex items-center justify-between">
                <div>
                  <h2 className="text-white text-sm font-bold">Course Content</h2>
                  <p className="text-white/30 text-xs mt-0.5">{totalCount} lessons</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {course.sections.map(section => (
                  <SidebarSection key={section._id} section={section}
                    currentLessonId={currentLesson?._id ?? ""} completedLessons={completedLessons}
                    onSelectLesson={(lesson) => {
                      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
                      setCurrentLesson(lesson);
                    }}/>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
