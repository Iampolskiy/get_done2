"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function Feedback() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const deleteSuccess = searchParams.get("deletesuccess");
  const editSuccess = searchParams.get("editSuccess");
  const error = searchParams.get("error");

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hasFeedback = success || deleteSuccess || editSuccess || error;

    if (hasFeedback) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, deleteSuccess, editSuccess, error]);

  if (!visible) return null;

  const baseStyle =
    "flex items-center gap-3 px-4 py-3 rounded-lg shadow-md w-fit mx-auto animate-fade-in-down";

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      {editSuccess === "true" && (
        <div className={`${baseStyle} bg-green-100 text-green-800`}>
          <CheckCircle className="w-5 h-5" />
          <span>Challenge erfolgreich angepasst!</span>
        </div>
      )}
      {deleteSuccess === "true" && (
        <div className={`${baseStyle} bg-green-100 text-green-800`}>
          <CheckCircle className="w-5 h-5" />
          <span>Challenge erfolgreich gelöscht!</span>
        </div>
      )}
      {success === "false" && (
        <div className={`${baseStyle} bg-red-100 text-red-800`}>
          <XCircle className="w-5 h-5" />
          <span>Challenge konnte nicht erstellt werden!</span>
        </div>
      )}
      {success === "true" && (
        <div className={`${baseStyle} bg-blue-100 text-blue-800`}>
          <CheckCircle className="w-5 h-5" />
          <span>Challenge erfolgreich erstellt!</span>
        </div>
      )}
      {error && (
        <div className={`${baseStyle} bg-yellow-100 text-yellow-800`}>
          <AlertTriangle className="w-5 h-5" />
          <span>Fehler: {error}</span>
        </div>
      )}
    </div>
  );
}
