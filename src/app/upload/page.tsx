"use client"

import type React from "react"

import { useState } from "react"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [parsedText, setParsedText] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setParsedText(null)
      setError(null)
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
      setParsedText(null)
      setError(null)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("resume", file)

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to parse resume")
      }

      setParsedText(result.text)
      console.log("Parsed text:", result.text)
    } catch (error) {
      console.error("Upload error:", error)
      setError((error as Error).message || "Failed to parse resume")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Upload Your Resume</h1>

      <form onSubmit={handleUpload} className="flex flex-col items-center w-full max-w-5xl">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`w-full h-[300px] flex flex-col items-center justify-center p-8 border-2 rounded-xl ${
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

        <button
          type="submit"
          disabled={!file || isLoading}
          className={`mt-6 px-6 py-2 rounded-lg transition ${
            !file || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Processing..." : "Parse Resume"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 w-full max-w-5xl">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {parsedText && (
        <div className="mt-6 w-full max-w-5xl">
          <h2 className="text-xl font-semibold mb-2">Extracted Text</h2>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-[400px] overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-sm">{parsedText}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
