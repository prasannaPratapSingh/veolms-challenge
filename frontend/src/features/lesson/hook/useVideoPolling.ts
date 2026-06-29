import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import type { RootState } from "../../../app/store/app.store";
import {
    updateLessonInState,
    setLessons,
    addPendingPoll,
    removePendingPoll,
} from "../state/lesson.slice";
import {
    getJobStatus,
    getLessonsBySection,
    getInProgressLessons,
} from "../service/lesson.service";

const POLL_INTERVAL_MS = 8000;

/**
 * Global video processing poller — mounted ONCE in App.tsx.
 *
 * On mount: calls GET /lesson/in-progress to fetch all queued/processing
 * lessons from the DB and registers them in pendingPolls. This handles:
 *   - Closing the tab and coming back (Redux is empty, DB has truth)
 *   - Page refresh
 *   - Multiple concurrent uploads
 *
 * A single setInterval polls all pendingPolls every 8 s in parallel.
 * On done/failed: removes from registry, toasts, re-fetches section.
 */
export function useVideoPolling() {
    const dispatch = useDispatch();
    const pendingPolls = useSelector((state: RootState) => state.lesson.pendingPolls);

    // Always-fresh ref so the interval callback never captures a stale list
    const pendingRef = useRef(pendingPolls);
    useEffect(() => { pendingRef.current = pendingPolls; }, [pendingPolls]);

    // On mount: fetch in-progress lessons from DB and register them
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getInProgressLessons();
                if (cancelled) return;
                const lessons: { _id: string; sectionId: string; processingStatus: string; videoUrl: string }[] =
                    data?.data || [];
                lessons.forEach(l => {
                    dispatch(addPendingPoll({ lessonId: l._id, sectionId: String(l.sectionId) }));
                    // Also seed Redux so the UI shows correct status immediately
                    dispatch(updateLessonInState({
                        sectionId: String(l.sectionId),
                        lesson: {
                            _id: l._id,
                            sectionId: String(l.sectionId),
                            processingStatus: l.processingStatus as any,
                            videoUrl: l.videoUrl || "",
                        } as any,
                    }));
                });
            } catch {
                // Non-admin or network issue — silently ignore
            }
        })();
        return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Single interval for the app lifetime — polls all pending items in parallel
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const current = pendingRef.current;
            if (current.length === 0) return;

            await Promise.all(
                current.map(async ({ lessonId, sectionId }) => {
                    try {
                        const data = await getJobStatus(lessonId);
                        const { processingStatus, videoUrl } = data.data;

                        dispatch(updateLessonInState({
                            sectionId,
                            lesson: {
                                _id: lessonId,
                                sectionId,
                                processingStatus,
                                videoUrl: videoUrl || "",
                            } as any,
                        }));

                        if (processingStatus === "done" || processingStatus === "failed") {
                            dispatch(removePendingPoll(lessonId));

                            if (processingStatus === "done") {
                                toast.success("Video processing complete!");
                                try {
                                    const fresh = await getLessonsBySection(sectionId);
                                    dispatch(setLessons({ sectionId, lessons: fresh?.data || [] }));
                                } catch { /* non-critical */ }
                            } else {
                                toast.error("Video processing failed. You can retry the upload.");
                            }
                        }
                    } catch {
                        // Network hiccup — keep polling silently
                    }
                })
            );
        }, POLL_INTERVAL_MS);

        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // single interval for the lifetime of the app
}
