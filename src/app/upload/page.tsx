"use client"

import type React from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ProfileMenu from '@/components/profile-menu'




export default function UploadPage() {
  const { status } = useSession()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [status, router])

  if (status === "loading") {
    return <p>Loading...</p>
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError(null)
      setUploadSuccess(false)
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
      setError(null)
      setUploadSuccess(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) return;

    const formData = new FormData();
    formData.append("resume", file);

    setIsLoading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      // Step 1: Extract resume text
      const parseResponse = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        throw new Error(await parseResponse.text() || "Failed to parse resume");
      }

      const { text } = await parseResponse.json();

      // Step 2: Parse job description separately
      const jobResponse = await fetch("/api/parse-job-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: jobDescription }),
      });

      if (!jobResponse.ok) {
        throw new Error(await jobResponse.text() || "Failed to parse job description");
      }

      const parsedJobDetails = await jobResponse.json();
      console.log("Parsed Job Details:", parsedJobDetails);

      // Step 3: Process both resume and job description
      const processResponse = await fetch("/api/process-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, jobDescription }),
      });

      if (!processResponse.ok) {
        throw new Error(await processResponse.text() || "Failed to process resume");
      }

      const parsedData = await processResponse.json();
      console.log("Parsed Resume Data:", parsedData);

      // Save to localStorage
      localStorage.setItem("resumeData", JSON.stringify(parsedData));
      localStorage.setItem("jobDetails", JSON.stringify(parsedJobDetails));

      setUploadSuccess(true);

    } catch (error) {
      console.error("Upload error:", error);
      setError((error as Error).message || "Failed to process resume");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full flex justify-end">
        <ProfileMenu />
      </div>

      <h1 className="text-3xl font-bold mb-6">Upload Your Resume & Job Description</h1>

      <form onSubmit={handleUpload} className="flex flex-col items-center w-full max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Resume Upload Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex-1 h-[300px] flex flex-col items-center justify-center p-8 border-2 rounded-xl ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } transition-all duration-300 shadow-md hover:shadow-lg`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              {file ? (
                <div className="text-center">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div className="text-gray-500 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p>
                    Drag & Drop your resume here
                    <br />
                    or click to browse
                  </p>
                  <p className="text-xs mt-2">Supported formats: PDF, DOC, DOCX</p>
                </div>
              )}
            </label>
          </div>

          {/* Job Description Box */}
          <div className="flex-1 flex flex-col">
            <div className="h-[300px] p-6 border-2 border-gray-300 rounded-xl shadow-md hover:shadow-lg">
              <textarea
                className="w-full h-full resize-none rounded-md p-4 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Paste or type the Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={!file || !jobDescription.trim() || isLoading}
          className={`mt-6 px-6 py-2 rounded-lg transition ${
            !file || !jobDescription.trim() || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Processing..." : "Upload Resume"}
        </button>

        {/* Upload success message */}
        {uploadSuccess && (
          <p className="mt-4 text-green-600 font-medium">✅ Resume uploaded successfully.</p>
        )}

        {/* Compare Button */}
        <button
          type="button"
          onClick={() => window.location.href = "/compare"}
          disabled={!uploadSuccess}
          className={`mt-4 px-6 py-2 rounded-lg transition ${
            uploadSuccess
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Compare
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 w-full max-w-5xl">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
