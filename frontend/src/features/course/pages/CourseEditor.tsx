import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useCourse } from '../hook/course.hook';
import { useSection } from '../../section/hook/section.hook';
import { useLesson } from '../../lesson/hook/lesson.hook';
import type { RootState } from '../../../app/store/app.store';
import type { Section } from '../../section/state/section.slice';
import type { Lesson } from '../../lesson/state/lesson.slice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

// Drag and drop
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ── Inline SVG Icons (no external icon lib required) ── */
const IconLoader = () => (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
);
const IconLoaderLg = () => (
    <svg className="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
);
const IconArrowLeft = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
);
const IconSave = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);
const IconImage = () => (
    <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg>
);
const IconPlus = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
);
const IconChevronDown = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
);
const IconChevronRight = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
);
const IconTrash = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const IconEdit = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);
const IconUpload = () => (
    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);
const IconVideo = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);
const IconVideoLg = () => (
    <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);
const IconX = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);
const IconWarning = () => (
    <svg className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
);
const IconCheck = () => (
    <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const IconSpinSm = () => (
    <svg className="w-3 h-3 animate-spin inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
);

/* ── Types ── */
interface CourseGeneralForm {
    title: string;
    description: string;
    price: number;
    createdBy: string;
    thumbnail?: FileList;
}

interface SectionForm {
    title: string;
    order: number;
}

interface LessonForm {
    title: string;
    description: string;
    duration: number;
    isPreview: boolean;
    order: number;
}

/* ── Main component ── */
export default function CourseEditor() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { courses, fetchCoursesAdmin, handleUpdateCourse, loading } = useCourse();
    const [activeTab, setActiveTab] = useState<'general' | 'curriculum'>('general');

    const course = courses.find(c => c._id === courseId);

    useEffect(() => {
        if (courseId) fetchCoursesAdmin();
    }, [courseId]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CourseGeneralForm>({
        defaultValues: {
            title: course?.title || '',
            description: course?.description || '',
            price: course?.price || 0,
            createdBy: course?.createdBy || '',
        }
    });

    useEffect(() => {
        if (course) {
            reset({
                title: course.title,
                description: course.description,
                price: course.price,
                createdBy: course.createdBy,
            });
        }
    }, [course, reset]);

    const onSubmitGeneral = async (data: CourseGeneralForm) => {
        if (!courseId) return;
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("createdBy", data.createdBy);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        if (data.thumbnail && data.thumbnail.length > 0) {
            formData.append("thumbnail", data.thumbnail[0]);
        }
        await handleUpdateCourse(courseId, formData);
    };

    if (loading && !course) {
        return (
            <div className="flex h-screen items-center justify-center" style={{ background: "#0B0F14" }}>
                <span className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "rgba(157, 180, 198,0.15)", borderTopColor: "#9DB4C6" }} />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex h-screen items-center justify-center" style={{ background: "#0B0F14", color: "#F5F8FA" }}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Course not found</h2>
                    <button onClick={() => navigate('/admin/veodashboard')} style={{ color: "#9DB4C6" }} className="hover:opacity-80 underline underline-offset-2">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-sans relative" style={{ background: "#0B0F14", color: "#F5F8FA" }}>
            {/* Ambient glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-1/2 h-64 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(157, 180, 198,0.05) 0%, transparent 70%)" }} />

            {/* Header */}
            <header className="sticky top-0 z-20 backdrop-blur-xl" style={{ background: "rgba(11, 15, 20,0.95)", borderBottom: "1px solid rgba(157, 180, 198,0.1)" }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/admin/veodashboard')}
                            className="p-2 rounded-sm transition-colors"
                            style={{ color: "rgba(157, 180, 198,0.5)" }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#9DB4C6")}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(157, 180, 198,0.5)")}
                        >
                            <IconArrowLeft />
                        </button>
                        <div>
                            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#F5F8FA" }} className="text-lg font-extrabold truncate max-w-xs">
                                {course.title}
                            </h1>
                            <p style={{ color: "rgba(157, 180, 198,0.45)" }} className="text-xs">Course Editor</p>
                        </div>
                    </div>
                    <div className="flex rounded-sm p-1" style={{ background: "rgba(157, 180, 198,0.06)", border: "1px solid rgba(157, 180, 198,0.12)" }}>
                        {(['general', 'curriculum'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={activeTab === tab
                                    ? { background: "#9DB4C6", color: "#0B0F14", border: "1px solid #9DB4C6" }
                                    : { color: "rgba(245, 248, 250,0.45)", border: "1px solid transparent" }}
                                className="px-4 py-1.5 rounded-sm text-sm font-semibold transition-all capitalize"
                            >
                                {tab === 'general' ? 'General Info' : 'Curriculum'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {activeTab === 'general' ? (
                    <GeneralTab
                        course={course}
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        onSubmitGeneral={onSubmitGeneral}
                    />
                ) : (
                    <CurriculumTab courseId={courseId!} />
                )}
            </main>
        </div>
    );
}

/* ── General Tab ── */
function GeneralTab({ course, register, handleSubmit, errors, isSubmitting, onSubmitGeneral }: {
    course: any;
    register: any;
    handleSubmit: any;
    errors: any;
    isSubmitting: boolean;
    onSubmitGeneral: (data: CourseGeneralForm) => Promise<void>;
}) {
    const inputClass = "w-full rounded-sm px-4 py-3 text-sm focus:outline-none transition-all auth-input placeholder:text-[rgba(245, 248, 250,0.2)]";
    const inputStyle = { background: "rgba(157, 180, 198,0.04)", border: "1px solid rgba(157, 180, 198,0.15)", color: "#F5F8FA" };
    const errorStyle = { background: "rgba(224,112,112,0.04)", border: "1px solid rgba(224,112,112,0.4)", color: "#F5F8FA" };
    const labelClass = "block text-xs font-bold uppercase tracking-widest mb-2";
    const labelStyle = { color: "rgba(157, 180, 198,0.6)" };

    return (
        <div style={{ background: "#1E2A39", border: "1px solid rgba(157, 180, 198,0.12)" }} className="rounded-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(157, 180, 198,0.08)", background: "rgba(157, 180, 198,0.02)" }}>
                <div>
                    <h2 style={{ color: "#F5F8FA" }} className="text-base font-semibold">General Information</h2>
                    <p style={{ color: "rgba(245, 248, 250,0.38)" }} className="text-sm mt-0.5 font-light">Update your course details and cover image.</p>
                </div>
                <button
                    onClick={handleSubmit(onSubmitGeneral)}
                    disabled={isSubmitting}
                    style={{ background: isSubmitting ? "rgba(157, 180, 198,0.3)" : "#9DB4C6", color: "#0B0F14" }}
                    className="flex items-center gap-2 px-4 py-2 rounded-sm font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                >
                    {isSubmitting ? <IconLoader /> : <IconSave />}
                    Save Changes
                </button>
            </div>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClass} style={labelStyle}>Course Title</label>
                        <input type="text" className={inputClass} style={inputStyle} {...register("title", { required: "Title is required" })} />
                        {errors.title && <p style={{ color: "#e07070" }} className="text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass} style={labelStyle}>Educator Name</label>
                        <input type="text" className={inputClass} style={inputStyle} {...register("createdBy", { required: "Educator name is required" })} />
                        {errors.createdBy && <p style={{ color: "#e07070" }} className="text-xs mt-1">{errors.createdBy.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass} style={labelStyle}>Price (₹)</label>
                        <input type="number" step="0.01" className={inputClass} style={inputStyle} {...register("price", { required: "Price is required", min: 0 })} />
                        {errors.price && <p style={{ color: "#e07070" }} className="text-xs mt-1">{errors.price.message}</p>}
                    </div>
                </div>
                <div>
                    <label className={labelClass} style={labelStyle}>Course Description</label>
                    <textarea rows={4} className={`${inputClass} resize-none`} style={inputStyle} {...register("description", { required: "Description is required" })} />
                    {errors.description && <p style={{ color: "#e07070" }} className="text-xs mt-1">{errors.description.message}</p>}
                </div>
                <div>
                    <label className={labelClass} style={labelStyle}>Cover Image</label>
                    <div className="flex items-start gap-6">
                        <div style={{ background: "rgba(157, 180, 198,0.06)", border: "1px solid rgba(157, 180, 198,0.12)" }} className="w-40 h-24 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                            {course.thumbnail
                                ? <img src={course.thumbnail} alt="Cover" className="w-full h-full object-cover" />
                                : <IconImage />
                            }
                        </div>
                        <div className="flex-1">
                            <input type="file" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold transition-colors" style={{ color: "rgba(245, 248, 250,0.4)" }} {...register("thumbnail")} />
                            <p style={{ color: "rgba(157, 180, 198,0.35)" }} className="mt-2 text-xs">Upload a new image to replace the current one. 16:9 ratio recommended.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Curriculum Tab ── */
const EMPTY_SECTIONS: Section[] = [];
const EMPTY_LESSONS: Lesson[] = [];
function CurriculumTab({ courseId }: { courseId: string }) {
    const { handleGetSectionsByCourse, handleCreateSection, handleUpdateSection, handleDeleteSection, handleReorderSections } = useSection();
    const sections = useSelector((state: RootState) => state.section.sectionsByCourse[courseId] ?? EMPTY_SECTIONS);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [showAddSection, setShowAddSection] = useState(false);
    const [editingSection, setEditingSection] = useState<Section | null>(null);

    const { register: regSection, handleSubmit: submitSection, reset: resetSection, formState: { errors: errSection, isSubmitting: submittingSection } } = useForm<SectionForm>();
    const { register: regEditSection, handleSubmit: submitEditSection, reset: resetEditSection, formState: { errors: errEditSection, isSubmitting: submittingEditSection } } = useForm<SectionForm>();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Sort sections by order for consistent rendering
    const sortedSections = useMemo(() => {
        return [...sections].sort((a, b) => a.order - b.order);
    }, [sections]);

    useEffect(() => {
        handleGetSectionsByCourse(courseId);
    }, [courseId]);

    const handleSectionDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortedSections.findIndex(s => s._id === active.id);
            const newIndex = sortedSections.findIndex(s => s._id === over.id);

            const reordered = arrayMove(sortedSections, oldIndex, newIndex);
            handleReorderSections(courseId, reordered);
        }
    };

    const toggleSection = (id: string) =>
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));

    const onAddSection = async (data: SectionForm) => {
        await handleCreateSection(courseId, { title: data.title, order: Number(data.order) });
        resetSection();
        setShowAddSection(false);
    };

    const onEditSection = async (data: SectionForm) => {
        if (!editingSection) return;
        await handleUpdateSection(courseId, editingSection._id, { title: data.title, order: Number(data.order) });
        setEditingSection(null);
    };

    const startEditSection = (section: Section) => {
        setEditingSection(section);
        resetEditSection({ title: section.title, order: section.order });
    };

    const inputClass = "w-full rounded-sm px-4 py-3 text-sm focus:outline-none transition-all auth-input placeholder:text-[rgba(245, 248, 250,0.2)]";
    const inputStyle = { background: "rgba(157, 180, 198,0.04)", border: "1px solid rgba(157, 180, 198,0.15)", color: "#F5F8FA" };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 style={{ color: "#F5F8FA" }} className="text-base font-semibold">Curriculum Builder</h2>
                    <p style={{ color: "rgba(245, 248, 250,0.38)" }} className="text-sm mt-0.5 font-light">{sections.length} section{sections.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => setShowAddSection(v => !v)}
                    style={{ background: "#9DB4C6", color: "#0B0F14" }}
                    className="flex items-center gap-2 px-4 py-2 rounded-sm font-semibold text-sm hover:opacity-90 transition-all"
                >
                    <IconPlus />
                    Add Section
                </button>
            </div>

            {/* Add Section Form */}
            {showAddSection && (
                <div style={{ background: "rgba(157, 180, 198,0.04)", border: "1px solid rgba(157, 180, 198,0.15)" }} className="rounded-sm p-5 mb-4">
                    <h3 style={{ color: "#9DB4C6", letterSpacing: "0.12em" }} className="text-xs font-bold uppercase mb-4">New Section</h3>
                    <form onSubmit={submitSection(onAddSection)} className="flex items-end gap-4">
                        <div className="flex-1">
                            <label style={{ color: "rgba(157, 180, 198,0.6)", letterSpacing: "0.12em" }} className="block text-xs font-bold uppercase mb-2">Title</label>
                            <input type="text" placeholder="e.g. Introduction" className={inputClass} style={inputStyle} {...regSection("title", { required: "Title is required" })} />
                            {errSection.title && <p style={{ color: "#e07070" }} className="text-xs mt-1">{errSection.title.message}</p>}
                        </div>
                        <div className="w-24">
                            <label style={{ color: "rgba(157, 180, 198,0.6)", letterSpacing: "0.12em" }} className="block text-xs font-bold uppercase mb-2">Order</label>
                            <input type="number" min={1} placeholder="1" className={inputClass} style={inputStyle} {...regSection("order", { required: true, min: 1 })} />
                        </div>
                        <div className="flex gap-2 pb-0.5">
                            <button type="submit" disabled={submittingSection} style={{ background: "#9DB4C6", color: "#0B0F14" }} className="px-4 py-3 rounded-sm text-sm font-semibold transition-colors disabled:opacity-50 hover:opacity-90">
                                {submittingSection ? <IconLoader /> : "Create"}
                            </button>
                            <button type="button" onClick={() => setShowAddSection(false)} style={{ border: "1px solid rgba(157, 180, 198,0.15)", color: "rgba(245, 248, 250,0.5)" }} className="px-4 py-3 rounded-sm text-sm font-semibold transition-colors hover:text-[#F5F8FA]">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Section Modal */}
            {editingSection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingSection(null)} />
                    <div style={{ background: "#1E2A39", border: "1px solid rgba(157, 180, 198,0.15)" }} className="relative w-full max-w-md rounded-sm shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 style={{ color: "#F5F8FA" }} className="font-bold">Edit Section</h3>
                            <button onClick={() => setEditingSection(null)} style={{ color: "rgba(157, 180, 198,0.4)" }} className="hover:text-[#9DB4C6] transition-colors"><IconX /></button>
                        </div>
                        <form onSubmit={submitEditSection(onEditSection)} className="space-y-4">
                            <div>
                                <label style={{ color: "rgba(157, 180, 198,0.6)", letterSpacing: "0.12em" }} className="block text-xs font-bold uppercase mb-2">Title</label>
                                <input type="text" className={inputClass} style={inputStyle} {...regEditSection("title", { required: "Title is required" })} />
                                {errEditSection.title && <p style={{ color: "#e07070" }} className="text-xs mt-1">{errEditSection.title.message}</p>}
                            </div>
                            <div>
                                <label style={{ color: "rgba(157, 180, 198,0.6)", letterSpacing: "0.12em" }} className="block text-xs font-bold uppercase mb-2">Order</label>
                                <input type="number" min={1} className={inputClass} style={inputStyle} {...regEditSection("order", { required: true, min: 1 })} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={submittingEditSection} style={{ background: "#9DB4C6", color: "#0B0F14" }} className="flex-1 py-3 rounded-sm text-sm font-semibold transition-colors disabled:opacity-50 hover:opacity-90">
                                    {submittingEditSection ? <IconLoader /> : "Save Changes"}
                                </button>
                                <button type="button" onClick={() => setEditingSection(null)} style={{ border: "1px solid rgba(157, 180, 198,0.12)", color: "rgba(245, 248, 250,0.45)" }} className="flex-1 py-3 rounded-sm text-sm font-semibold hover:text-[#F5F8FA] transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sections list */}
            {sections.length === 0 && !showAddSection ? (
                <div className="text-center py-20 rounded-sm" style={{ border: "1px dashed rgba(157, 180, 198,0.12)", background: "rgba(157, 180, 198,0.01)" }}>
                    <div style={{ background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.15)" }} className="w-14 h-14 mx-auto rounded-sm flex items-center justify-center mb-4">
                        <span style={{ color: "rgba(157, 180, 198,0.5)" }}><IconPlus /></span>
                    </div>
                    <p style={{ color: "rgba(245, 248, 250,0.35)" }} className="text-sm">No sections yet. Add one to get started.</p>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                    <SortableContext items={sortedSections.map(s => s._id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                            {sortedSections.map((section) => (
                                <SortableSectionCard
                                    key={section._id}
                                    section={section}
                                    courseId={courseId}
                                    isExpanded={!!expandedSections[section._id]}
                                    onToggle={() => toggleSection(section._id)}
                                    onEdit={() => startEditSection(section)}
                                    onDelete={() => handleDeleteSection(courseId, section._id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}

/* ── Sortable Section Card Wrapper ── */
function SortableSectionCard({ section, courseId, isExpanded, onToggle, onEdit, onDelete }: {
    section: Section;
    courseId: string;
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <SectionCard
                section={section}
                courseId={courseId}
                isExpanded={isExpanded}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}

/* ── Section Card ── */
function SectionCard({ section, courseId, isExpanded, onToggle, onEdit, onDelete, dragHandleProps }: {
    section: Section;
    courseId: string;
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    dragHandleProps?: any;
}) {
    const { handleGetLessonsBySection, handleCreateLesson, handleDeleteLesson, handleReorderLessons } = useLesson();
    const lessons = useSelector((state: RootState) => state.lesson.lessonsBySection[section._id] ?? EMPTY_LESSONS);
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [uploadingLesson, setUploadingLesson] = useState<Lesson | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LessonForm>();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Sort lessons by order
    const sortedLessons = useMemo(() => {
        return [...lessons].sort((a, b) => a.order - b.order);
    }, [lessons]);

    const handleLessonDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortedLessons.findIndex(l => l._id === active.id);
            const newIndex = sortedLessons.findIndex(l => l._id === over.id);

            const reordered = arrayMove(sortedLessons, oldIndex, newIndex);
            handleReorderLessons(section._id, reordered);
        }
    };

    useEffect(() => {
        if (isExpanded) handleGetLessonsBySection(section._id);
    }, [isExpanded, section._id]);

    const onAddLesson = async (data: LessonForm) => {
        await handleCreateLesson({
            title: data.title,
            description: data.description,
            duration: Number(data.duration),
            sectionId: section._id,
            isPreview: data.isPreview,
            order: Number(data.order),
        });
        reset();
        setShowAddLesson(false);
    };

    const inputClass = "w-full rounded-sm px-4 py-2.5 text-sm focus:outline-none transition-all auth-input placeholder:text-[rgba(245, 248, 250,0.2)]";
    const inputStyle = { background: "rgba(157, 180, 198,0.04)", border: "1px solid rgba(157, 180, 198,0.15)", color: "#F5F8FA" };

    return (
        <div style={{ background: "rgba(157, 180, 198,0.02)", border: "1px solid rgba(157, 180, 198,0.1)" }} className="rounded-sm overflow-hidden transition-colors hover:border-[rgba(157, 180, 198,0.2)]">
            {/* Section header row */}
            <div className="flex items-center gap-4 px-5 py-4">
                {/* Drag handle */}
                <button {...dragHandleProps} style={{ color: "rgba(157, 180, 198,0.25)" }} className="hover:text-[rgba(157, 180, 198,0.5)] cursor-grab active:cursor-grabbing p-1 -ml-1" title="Drag to reorder sections">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
                </button>
                <button onClick={onToggle} style={{ color: "rgba(157, 180, 198,0.4)" }} className="hover:text-[#9DB4C6] transition-colors">
                    {isExpanded ? <IconChevronDown /> : <IconChevronRight />}
                </button>
                <div className="flex-1 min-w-0">
                    <button onClick={onToggle} className="text-left w-full">
                        <p style={{ color: "#F5F8FA" }} className="font-semibold truncate">{section.title}</p>
                        <p style={{ color: "rgba(157, 180, 198,0.4)" }} className="text-xs mt-0.5">Order: {section.order} · {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</p>
                    </button>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={onEdit} style={{ color: "rgba(157, 180, 198,0.35)" }} className="p-2 rounded-sm transition-colors hover:text-[#9DB4C6]" title="Edit section">
                        <IconEdit />
                    </button>
                    <button onClick={onDelete} style={{ color: "rgba(157, 180, 198,0.35)" }} className="p-2 rounded-sm transition-colors hover:text-[#e07070]" title="Delete section">
                        <IconTrash />
                    </button>
                </div>
            </div>

        { isExpanded && (
            <div className="px-5 pb-5 pt-4" style={{ borderTop: "1px solid rgba(157, 180, 198,0.07)" }}>
                {lessons.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {sortedLessons.length > 0 ? (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLessonDragEnd}>
                                <SortableContext items={sortedLessons.map(l => l._id)} strategy={verticalListSortingStrategy}>
                                    {sortedLessons.map(lesson => (
                                        <SortableLessonRow key={lesson._id} lesson={lesson} sectionId={section._id}
                                            onDelete={() => handleDeleteLesson(section._id, lesson._id)}
                                            onUpload={() => setUploadingLesson(lesson)} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        ) : (
                            lessons.map(lesson => (
                                <LessonRow key={lesson._id} lesson={lesson} sectionId={section._id}
                                    onDelete={() => handleDeleteLesson(section._id, lesson._id)}
                                    onUpload={() => setUploadingLesson(lesson)} />
                            ))
                        )}
                    </div>
                )}

                {showAddLesson ? (
                    <div style={{ background: "rgba(157, 180, 198,0.03)", border: "1px solid rgba(157, 180, 198,0.12)" }} className="rounded-sm p-4">
                        <h4 style={{ color: "rgba(157, 180, 198,0.55)", letterSpacing: "0.12em" }} className="text-xs font-bold uppercase mb-3">New Lesson</h4>
                        <form onSubmit={handleSubmit(onAddLesson)} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <input type="text" placeholder="Lesson title" className={inputClass} style={inputStyle} {...register("title", { required: "Title is required" })} />
                                    {errors.title && <p style={{ color: "#e07070" }} className="text-xs mt-1">{errors.title.message}</p>}
                                </div>
                                <div className="col-span-2">
                                    <textarea rows={2} placeholder="Short description" className={`${inputClass} resize-none`} style={inputStyle} {...register("description", { required: "Description is required" })} />
                                    {errors.description && <p style={{ color: "#e07070" }} className="text-xs mt-1">{errors.description.message}</p>}
                                </div>
                                <div>
                                    <input type="number" min={0} placeholder="Duration (min)" className={inputClass} style={inputStyle} {...register("duration", { required: true, min: 0 })} />
                                </div>
                                <div>
                                    <input type="number" min={1} placeholder="Order" className={inputClass} style={inputStyle} {...register("order", { required: true, min: 1 })} />
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input type="checkbox" id={`preview-${section._id}`} className="w-4 h-4" style={{ accentColor: "#9DB4C6" }} {...register("isPreview")} />
                                    <label htmlFor={`preview-${section._id}`} style={{ color: "rgba(245, 248, 250,0.5)" }} className="text-sm select-none">Free preview lesson</label>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button type="submit" disabled={isSubmitting} style={{ background: "#9DB4C6", color: "#0B0F14" }} className="px-4 py-2 rounded-sm text-sm font-semibold transition-colors disabled:opacity-50 hover:opacity-90">
                                    {isSubmitting ? <IconLoader /> : "Add Lesson"}
                                </button>
                                <button type="button" onClick={() => { setShowAddLesson(false); reset(); }} style={{ border: "1px solid rgba(157, 180, 198,0.12)", color: "rgba(245, 248, 250,0.45)" }} className="px-4 py-2 rounded-sm text-sm font-semibold hover:text-[#F5F8FA] transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddLesson(true)}
                        style={{ border: "1px dashed rgba(157, 180, 198,0.15)", color: "rgba(157, 180, 198,0.45)" }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm hover:text-[#9DB4C6] hover:border-[rgba(157, 180, 198,0.3)] transition-colors"
                    >
                        <IconPlus />
                        Add Lesson
                    </button>
                )}
            </div>
        )
}

{/* Video Upload Modal */ }
{
    uploadingLesson && (
        <VideoUploadModal
            lesson={uploadingLesson}
            onClose={() => setUploadingLesson(null)}
        />
    )
}
        </div >
    );
}

/* ── Sortable Lesson Row Wrapper ── */
function SortableLessonRow({ lesson, sectionId, onDelete, onUpload }: {
    lesson: Lesson;
    sectionId: string;
    onDelete: () => void;
    onUpload: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lesson._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <LessonRow
                lesson={lesson}
                sectionId={sectionId}
                onDelete={onDelete}
                onUpload={onUpload}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}

/* ── Lesson Row ── */
function LessonRow({ lesson, sectionId, onDelete, onUpload, dragHandleProps }: {
    lesson: Lesson;
    sectionId: string;
    onDelete: () => void;
    onUpload: () => void;
    dragHandleProps?: any;
}) {
    const status = lesson.processingStatus ?? "idle";
    const hasVideo = !!lesson.videoUrl && status === "done";
    const isProcessing = status === "queued" || status === "processing";

    const statusBadge = () => {
        switch (status) {
            case "queued":
                return <span style={{ color: "#9DB4C6", background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.2)" }} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm flex items-center gap-1"><IconSpinSm />Queued</span>;
            case "processing":
                return <span style={{ color: "#9DB4C6", background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.2)" }} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm flex items-center gap-1"><IconSpinSm />Processing</span>;
            case "done":
                return <span style={{ color: "rgba(157, 180, 198,0.9)", background: "rgba(157, 180, 198,0.1)", border: "1px solid rgba(157, 180, 198,0.25)" }} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Ready</span>;
            case "failed":
                return <span style={{ color: "#e07070", background: "rgba(224,112,112,0.08)", border: "1px solid rgba(224,112,112,0.2)" }} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Failed</span>;
            default:
                return <span style={{ color: "rgba(245, 248, 250,0.3)", background: "rgba(157, 180, 198,0.04)", border: "1px solid rgba(157, 180, 198,0.1)" }} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">No video</span>;
        }
    };

    return (
        <div style={{ background: "rgba(157, 180, 198,0.02)", border: "1px solid rgba(157, 180, 198,0.08)" }} className="flex items-center gap-3 px-4 py-3 rounded-sm group hover:border-[rgba(157, 180, 198,0.18)] transition-colors">
            {dragHandleProps && (
                <button {...dragHandleProps} style={{ color: "rgba(157, 180, 198,0.2)" }} className="hover:text-[rgba(157, 180, 198,0.45)] cursor-grab active:cursor-grabbing p-1 -ml-2" title="Drag to reorder lessons">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
                </button>
            )}
            <div style={{ background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.12)" }} className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 text-xs font-bold">
                <span style={{ color: "rgba(157, 180, 198,0.6)" }}>{lesson.order}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p style={{ color: "#F5F8FA" }} className="text-sm font-medium truncate">{lesson.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {lesson.isPreview && <span style={{ color: "#9DB4C6", background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.2)" }} className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">Preview</span>}
                    <span style={{ color: "rgba(157, 180, 198,0.4)" }} className="text-xs">{lesson.duration} min</span>
                    {statusBadge()}
                    {hasVideo && (
                        <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#9DB4C6" }} className="text-[10px] font-bold hover:opacity-70 underline underline-offset-2 transition-colors" title={lesson.videoUrl}>
                            View HLS
                        </a>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onUpload} disabled={isProcessing} style={{ color: "rgba(157, 180, 198,0.4)" }} className="p-2 rounded-sm transition-colors hover:text-[#9DB4C6] hover:bg-[rgba(157, 180, 198,0.08)] disabled:opacity-20 disabled:cursor-not-allowed" title={isProcessing ? "Processing…" : "Upload video"}>
                    <IconVideo />
                </button>
                <button onClick={onDelete} style={{ color: "rgba(157, 180, 198,0.4)" }} className="p-2 rounded-sm transition-colors hover:text-[#e07070] hover:bg-[rgba(224,112,112,0.08)]" title="Delete lesson">
                    <IconTrash />
                </button>
            </div>
        </div>
    );
}

/* ── Video Upload Modal ── */
type UploadPhase = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

function VideoUploadModal({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
    const { handleVideoUpload } = useLesson();
    const [file, setFile] = useState<File | null>(null);
    const [phase, setPhase] = useState<UploadPhase>('idle');
    const [progress, setProgress] = useState(0);
    const [jobId, setJobId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Warn user before closing tab during upload
    useEffect(() => {
        const warn = (e: BeforeUnloadEvent) => {
            if (phase === 'uploading' || phase === 'processing') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [phase]);

    const isActive = phase === 'uploading' || phase === 'processing';

    const handleStart = async () => {
        if (!file) { toast.error("Please select a video file first."); return; }
        setPhase('uploading');
        setProgress(0);
        setErrorMsg('');
        try {
            const result = await handleVideoUpload(lesson._id, lesson.sectionId, file, (pct) => {
                setProgress(pct);
                if (pct === 100) setPhase('processing');
            });
            setJobId(result.jobId);
            setPhase('done');
            // Global poller (useVideoPolling in App.tsx) handles status tracking
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || err?.message || 'Upload failed. Please try again.');
            setPhase('error');
        }
    };

    const handleClose = () => {
        if (isActive) return; // un-closable during upload
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop — only dismissible when not active */}
            <div
                className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${isActive ? 'cursor-not-allowed' : 'cursor-default'}`}
                onClick={handleClose}
            />

            <div style={{ background: "#1E2A39", border: "1px solid rgba(157, 180, 198,0.15)" }} className="relative w-full max-w-lg rounded-sm shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(157, 180, 198,0.08)", background: "rgba(157, 180, 198,0.02)" }}>
                    <div className="flex items-center gap-2">
                        <span style={{ color: "#9DB4C6" }}><IconUpload /></span>
                        <h3 style={{ color: "#F5F8FA" }} className="font-bold">Upload Video</h3>
                    </div>
                    <button onClick={handleClose} disabled={isActive} style={{ color: "rgba(157, 180, 198,0.4)" }} className="p-2 rounded-sm hover:text-[#9DB4C6] transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
                        <IconX />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Lesson info */}
                    <div style={{ background: "rgba(157, 180, 198,0.04)", border: "1px solid rgba(157, 180, 198,0.1)" }} className="rounded-sm px-4 py-3">
                        <p style={{ color: "rgba(157, 180, 198,0.55)", letterSpacing: "0.12em" }} className="text-xs uppercase font-bold mb-0.5">Lesson</p>
                        <p style={{ color: "#F5F8FA" }} className="text-sm font-semibold">{lesson.title}</p>
                    </div>

                    {/* Warning during upload */}
                    {isActive && (
                        <div style={{ background: "rgba(157, 180, 198,0.06)", border: "1px solid rgba(157, 180, 198,0.25)" }} className="flex items-start gap-3 rounded-sm p-4">
                            <IconWarning />
                            <div>
                                <p style={{ color: "#9DB4C6" }} className="text-sm font-bold">Do not close or refresh this page</p>
                                <p style={{ color: "rgba(157, 180, 198,0.55)" }} className="text-xs mt-1">
                                    Your video is being {phase === 'uploading' ? 'uploaded to storage' : 'submitted for processing'}. Leaving now will interrupt the operation.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* File picker */}
                    {(phase === 'idle' || phase === 'error') ? (
                        <div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer rounded-sm p-8 flex flex-col items-center gap-3 transition-colors group"
                                style={{ border: "2px dashed rgba(157, 180, 198,0.15)" }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(157, 180, 198,0.35)")}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(157, 180, 198,0.15)")}
                            >
                                <div style={{ background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.2)" }} className="w-12 h-12 rounded-sm flex items-center justify-center">
                                    <span style={{ color: "#9DB4C6" }}><IconVideoLg /></span>
                                </div>
                                {file ? (
                                    <>
                                        <p style={{ color: "#F5F8FA" }} className="text-sm font-semibold">{file.name}</p>
                                        <p style={{ color: "rgba(157, 180, 198,0.45)" }} className="text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB · Click to change</p>
                                    </>
                                ) : (
                                    <>
                                        <p style={{ color: "#F5F8FA" }} className="text-sm font-semibold">Click to select a video</p>
                                        <p style={{ color: "rgba(157, 180, 198,0.45)" }} className="text-xs">MP4, MOV, MKV, WebM supported</p>
                                    </>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setPhase('idle'); setErrorMsg(''); } }} />
                            {phase === 'error' && <p style={{ color: "#e07070" }} className="text-sm mt-2 text-center">{errorMsg}</p>}
                        </div>
                    ) : null}

                    {/* Progress bar */}
                    {(phase === 'uploading' || phase === 'processing') && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs" style={{ color: "rgba(157, 180, 198,0.5)" }}>
                                <span>{phase === 'uploading' ? `Uploading… ${progress}%` : 'Submitting to processing queue…'}</span>
                                <span>{phase === 'uploading' ? `${progress}%` : ''}</span>
                            </div>
                            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "rgba(157, 180, 198,0.1)" }}>
                                <div className="h-2 rounded-full transition-all duration-300" style={{ width: phase === 'uploading' ? `${progress}%` : '100%', background: "#9DB4C6" }} />
                            </div>
                            {phase === 'processing' && <p style={{ color: "rgba(157, 180, 198,0.4)" }} className="text-xs text-center">Waiting for server acknowledgment…</p>}
                        </div>
                    )}

                    {/* Done state */}
                    {phase === 'done' && (
                        <div className="flex flex-col items-center gap-3 py-4">
                            <div style={{ background: "rgba(157, 180, 198,0.1)", border: "1px solid rgba(157, 180, 198,0.25)" }} className="w-14 h-14 rounded-full flex items-center justify-center">
                                <span style={{ color: "#9DB4C6" }}><IconCheck /></span>
                            </div>
                            <p style={{ color: "#F5F8FA" }} className="text-base font-bold">Video queued for processing</p>
                            <p style={{ color: "rgba(157, 180, 198,0.5)" }} className="text-sm text-center max-w-xs">
                                Job submitted (ID: <span style={{ color: "#9DB4C6" }} className="font-mono">{jobId}</span>). You can safely navigate away.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    {(phase === 'idle' || phase === 'error') && (
                        <button onClick={handleStart} disabled={!file} style={{ background: file ? "#9DB4C6" : "rgba(157, 180, 198,0.2)", color: file ? "#0B0F14" : "rgba(245, 248, 250,0.3)" }}
                            className="flex-1 py-3 rounded-sm font-semibold text-sm transition-all disabled:cursor-not-allowed hover:opacity-90">
                            Start Upload
                        </button>
                    )}
                    {phase === 'done' && (
                        <button onClick={handleClose} style={{ background: "rgba(157, 180, 198,0.08)", border: "1px solid rgba(157, 180, 198,0.15)", color: "rgba(245, 248, 250,0.6)" }} className="flex-1 py-3 rounded-sm font-semibold text-sm transition-colors hover:text-[#F5F8FA]">
                            Close
                        </button>
                    )}
                    {!isActive && phase !== 'done' && (
                        <button onClick={handleClose} style={{ border: "1px solid rgba(157, 180, 198,0.12)", color: "rgba(245, 248, 250,0.45)" }} className="py-3 px-5 rounded-sm text-sm font-semibold hover:text-[#F5F8FA] transition-colors">
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
