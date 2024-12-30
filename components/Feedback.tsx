"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function Feedback() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const deleteSuccess = searchParams.get("deletesuccess");
  const editSuccess = searchParams.get("editSuccess");
  const error = searchParams.get("error");

  return (
    <>
      {editSuccess === "true" && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          Challenge erfolgreich angepasst!
        </div>
      )}
      {deleteSuccess === "true" && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          Challenge erfolgreich gelöscht!
        </div>
      )}
      {success === "false" && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          Challenge konnte nicht erstellt werden!
        </div>
      )}
      {success === "true" && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          Challenge erfolgreich erstellt!
        </div>
      )}
      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          Fehler: {error}
        </div>
      )}
    </>
  );
}
