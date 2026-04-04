"use client";

import { useState } from "react";

type AdminImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function AdminImageUploader({
  value,
  onChange,
}: AdminImageUploaderProps) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    try {
      setIsUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Upload failed.");
        return;
      }

      onChange(result.imageUrl || "");
      setMessage(result.success || "Uploaded.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium dark:border-zinc-700 dark:text-white">
          {isUploading ? "Uploading..." : "Upload Cover Image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
        </label>

        {message ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
        ) : null}
      </div>

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <img
            src={value}
            alt="Preview"
            className="h-40 w-full rounded-xl object-cover"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No cover image uploaded yet.
        </div>
      )}
    </div>
  );
}