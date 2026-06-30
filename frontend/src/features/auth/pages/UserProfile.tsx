import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuth } from "../hook/auth.hook";
import type { RootState } from "../../../app/store/app.store";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ProfileForm {
  name: string;
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  );
}

export default function UserProfile() {
  const navigate = useNavigate();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const { handleGetMe, handleUpdateProfile } = useAuth();

  const displayName: string =
    reduxUser?.data?.name ?? reduxUser?.user?.name ?? reduxUser?.name ?? "";
  const email: string =
    reduxUser?.data?.email ?? reduxUser?.user?.email ?? reduxUser?.email ?? "";
  const currentAvatar: string =
    reduxUser?.data?.avatarUrl ?? reduxUser?.user?.avatarUrl ?? reduxUser?.avatarUrl ?? "";

  const [preview, setPreview] = useState<string>(currentAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({ defaultValues: { name: displayName } });

  // Keep form in sync if Redux user loads after mount
  useEffect(() => {
    reset({ name: displayName });
    setPreview(currentAvatar);
  }, [displayName, currentAvatar, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProfileForm) => {
    await handleUpdateProfile(data.name, avatarFile ?? undefined);
    setAvatarFile(null);
  };

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-[68px]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Back link */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            Your Profile
          </h1>
          <p className="text-neutral-400 text-sm">Manage your name and avatar</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
        >
          {/* Avatar section */}
          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-white/5 flex flex-col sm:flex-row items-center sm:items-end gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/10 bg-neutral-800 flex items-center justify-center shrink-0">
                {preview ? (
                  <img src={preview} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white/60">{initial}</span>
                )}
              </div>
              {/* Overlay click target */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                title="Change avatar"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="text-center sm:text-left">
              <p className="text-white font-bold text-lg leading-tight">{displayName || "—"}</p>
              <p className="text-neutral-500 text-sm mt-0.5">{email}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-xs font-semibold text-white/50 hover:text-white transition-colors underline underline-offset-2"
              >
                Change avatar
              </button>
              {avatarFile && (
                <p className="text-xs text-white/30 mt-1 truncate max-w-[180px]">{avatarFile.name}</p>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 sm:px-8 py-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all placeholder:text-neutral-600"
                placeholder="Your full name"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  maxLength: { value: 50, message: "Name is too long" },
                })}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            {/* Email — read only */}
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white/40 cursor-not-allowed select-none"
              />
              <p className="text-neutral-600 text-xs mt-1.5">Email cannot be changed</p>
            </div>

            {/* Save */}
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="w-full sm:w-auto px-8 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Spinner /> Saving…</> : "Save Changes"}
              </motion.button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
