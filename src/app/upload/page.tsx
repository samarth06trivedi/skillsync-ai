"use client"

import type React from "react"
import { useState } from "react"
import { ResumeData , JobDetails } from '@/lib/types';


export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isParsingJD, setIsParsingJD] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<ResumeData | null>(null)
  const [parsedJobDetails, setParsedJobDetails] = useState<JobDetails | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setParsedData(null)
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
      setParsedData(null)
      setError(null)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
  
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
  
    setIsLoading(true);
    setError(null);
  
    try {
      // Step 1: First parse the file to get raw text
      const parseResponse = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
  
      if (!parseResponse.ok) {
        throw new Error(await parseResponse.text() || "Failed to parse resume");
      }
  
      const { text } = await parseResponse.json();
  
      // Step 2: Send the extracted text to your API route for processing
      const processResponse = await fetch("/api/process-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
  
      if (!processResponse.ok) {
        throw new Error(await processResponse.text() || "Failed to analyze resume");
      }
  
      const structuredData = await processResponse.json();
      setParsedData(structuredData);
      
    } catch (error) {
      console.error("Upload error:", error);
      setError((error as Error).message || "Failed to process resume");
    } finally {
      setIsLoading(false);
    }
  };

  const parseJobDescription = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description")
      return
    }

    setIsParsingJD(true)
    setError(null)

    try {
      const response = await fetch("/api/parse-job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: jobDescription }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to parse job description")
      }

      setParsedJobDetails(result)
      console.log("Parsed Job Details:", result)
    } catch (error) {
      console.error("Job description parsing error:", error)
      setError((error as Error).message || "Failed to parse job description")
    } finally {
      setIsParsingJD(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Upload Your Resume & Job Description</h1>

      <form onSubmit={handleUpload} className="flex flex-col items-center w-full max-w-7xl">
        {/* Upload Section */}
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

          {/* Job Description Box with Parse Button */}
          <div className="flex-1 flex flex-col">
            <div className="h-[250px] p-6 border-2 border-gray-300 rounded-xl shadow-md hover:shadow-lg">
              <textarea
                className="w-full h-full resize-none rounded-md p-4 border focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Paste or type the Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={parseJobDescription}
              disabled={!jobDescription || isParsingJD}
              className={`mt-4 px-4 py-2 self-end rounded-lg transition ${
                !jobDescription || isParsingJD
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isParsingJD ? "Parsing..." : "Parse Job Description"}
            </button>
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={!file || isLoading}
          className={`mt-6 px-6 py-2 rounded-lg transition ${
            !file || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Processing..." : "Upload Resume"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 w-full max-w-5xl">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Parsed Resume Data */}
      {parsedData && (
        <div className="mt-6 w-full max-w-5xl p-6 bg-white border border-gray-300 rounded-2xl shadow-md space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Resume Summary</h2>
          
          <div className="space-y-2 text-gray-700">
            <p><span className="font-semibold">Name:</span> {parsedData.name}</p>
            <p><span className="font-semibold">Email:</span> {parsedData.email}</p>
            <p><span className="font-semibold">Phone:</span> {parsedData.phone}</p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-700 mb-2">Education:</h3>
            {parsedData.education && parsedData.education.length > 0 ? (
              parsedData.education.map((edu, index) => (
                <div key={index} className="mb-4 ml-4 text-gray-600">
                  <p className="font-bold">{edu.degree}</p>
                  {edu.university && <p className="text-sm ">{edu.university}</p>}
                  {edu.duration && <p className="text-sm text-gray-600">{edu.duration}</p>}
                  <ul className="list-disc list-inside ml-4 text-sm">
                    {edu.details?.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-500 ml-4">No education information found</p>
            )}  
          </div>
          
          <div>
            <h3 className="font-bold text-gray-700 mb-2">Skills:</h3>
            {parsedData.skills && parsedData.skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                {parsedData.skills.map((skillCategory, index) => (
                  <div key={index} className="mb-2 text-gray-600">
                    <p className="font-bold">{skillCategory.category || 'Uncategorized'}</p>
                    <ul className="list-disc list-inside ml-4 text-gray-500">
                      {skillCategory.items?.map((skill, i) => (
                        <li key={i} className="text-sm text-gray-600">{skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 ml-4">No skills information found</p>
            )}
          </div>
        </div>
      )}

      {/* Hidden debug output for job description parsing */}
      {parsedJobDetails && (
        <div className="hidden">
          {JSON.stringify(parsedJobDetails, null, 2)}
        </div>
      )}
    </div>
  )
}

