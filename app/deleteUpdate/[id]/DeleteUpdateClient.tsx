// app/deleteUpdate/[id]/DeleteUpdateClient.tsx
"use client";

/* import { useRouter } from "next/navigation";
 */ import { useState } from "react";
import { Update } from "@/types/types";
import { deleteUpdate } from "@/actions/challengeActions/deleteUpdate";

export default function DeleteUpdateClient({ update }: { update: Update }) {
  /*   const router = useRouter();

 */ const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    setBusy(true);
    const formData = new FormData();
    formData.append("updateId", update.id.toString());
    await deleteUpdate(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded shadow p-6 space-y-6">
      <h2 className="text-xl font-bold text-red-600">Update löschen?</h2>
      <p className="text-gray-700">
        Bist du sicher, dass du dieses Update löschen möchtest?
      </p>

      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          <strong>Erstellt am:</strong>{" "}
          {new Date(update.createdAt).toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {update.content}
        </p>
      </div>

      <button
        onClick={handleDelete}
        disabled={busy}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition disabled:opacity-50"
      >
        {busy ? "Lösche ..." : "Update löschen"}
      </button>
    </div>
  );
}
