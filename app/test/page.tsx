"use client";
import { CldUploadButton } from "next-cloudinary";
import React from "react";

export default function testPage() {
  return (
    <CldUploadButton
      signatureEndpoint="./api/sign-upload"
      uploadPreset="signedTest1"
    />
  );
}
