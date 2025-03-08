"use client";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";

//we need to configure CORS
//gsutil cors set cors.json gs://<app-name.appspot.com
//gsutil cors set cors.json gs://chat-with-pdf-ed866.appspot.com
//go here >>> https://console.cloud.google.com/
//create new file in editor calls cors.json
//run >>> // gsutil cors set cors.json gs://chat-with-pdf-ed866.appspot.com
//https://firebase.google.com/docs/storage/web/download-files#cors_configuration


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfView({ url }: { url: string }) {
  return <div>pdfview</div>;
}

export default PdfView;
