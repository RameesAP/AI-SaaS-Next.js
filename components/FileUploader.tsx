"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import type { JSX } from "react";

import {
  // CheckCircle,
  CheckCircleIcon,
  //   CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  //   HammerIcon,
  RocketIcon,
  //   SaveIcon,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";

const FileUploader = () => {
  const { progress, status, fileId, handleUpload } = useUpload();

  const router = useRouter();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // console.log(acceptedFiles);

      const file = acceptedFiles[0];
      if (file) {
        await handleUpload(file);
      } else {
        //toast...
      }
    },
    [handleUpload]
  );

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-2 w-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: <RocketIcon className="h-20 w-20 text-indigo-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-indigo-600 animate-bounce" />
    ),
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadProgress = progress != null && progress >= 0 && progress <= 100;

  return (
    <div className=" flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              
              // @ts-expect-error idk
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </div>
          {
           
            // @ts-expect-error idk
            statusIcons[status!]
          }
          {
           
        
          }
          <p className="text-indigo-600 animate-pulse">{status}</p>
        </div>
      )}
      {!uploadProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-indigo-600 text-indigo-600 border-2 border-dashed mt-10 w-[90%] rounded-lg h-96 flex items-center justify-center ${
            isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-100"
          }`}
        >
          <input {...getInputProps()} />
          <div className=" flex flex-col items-center justify-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-ping " />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p>Drag n Drop some files here, or click to select files</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
