"use client"

import React, { useEffect, useState } from "react"
import { ResumeData, JobDetails , MatchResult , MissingResult, SkillCategory } from "@/lib/types";


export default function ComparePage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);    
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null)
  const [matches, setMatches] = useState<MatchResult>({})
  const [missing, setMissing] = useState<MissingResult>({})

  useEffect(() => {
    try {
      const storedResume = localStorage.getItem("resumeData");
      const storedJob = localStorage.getItem("jobDetails");
    //   console.log("Raw resumeData from localStorage:", storedResume);
    //   console.log("Raw jobDetails from localStorage:", storedJob);
      if (!storedResume || !storedJob) {
        console.warn("Missing resumeData or jobDetails in localStorage");
        return;
      }
  
      const resume: ResumeData = JSON.parse(storedResume);
      const job: JobDetails = JSON.parse(storedJob);
  
      setResumeData(resume);
      setJobDetails(job);
  
      if (resume?.skills && job?.skills) {
        const resumeSkills = resume.skills.flatMap((cat: SkillCategory) => cat.items || []);
        const jobSkills = job.skills.map((s) => s.toLowerCase()); // normalize
  
        const matchedSkills = resumeSkills.filter((skill: string) =>
          jobSkills.includes(skill.toLowerCase())
        );
        const missingSkills = jobSkills.filter((skill: string) =>
          !resumeSkills.map((s) => s.toLowerCase()).includes(skill)
        );
  
        const matchPct =
          jobSkills.length > 0
            ? Math.round((matchedSkills.length / jobSkills.length) * 100)
            : 0;
  
        setMatchPercentage(matchPct);
        setMatches({ skills: matchedSkills });
        setMissing({ skills: missingSkills });
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, []);
  

  if (!resumeData || !jobDetails) {
    return <p className="text-center mt-10">Loading comparison data...</p>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">Resume vs Job Description Comparison</h1>

      <div className="bg-blue-50 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold text-gray-700">Match Percentage:</h2>
        <p className="text-4xl font-bold text-green-600">{matchPercentage ?? "N/A"}%</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 border rounded-xl shadow">
          <h3 className="text-xl font-bold mb-2 text-gray-700">Resume Summary</h3>
          <p className="font-bold text-gray-600"><strong>Name:</strong> {resumeData.name}</p>
          <p className="font-bold text-gray-600"><strong>Email:</strong> {resumeData.email}</p>
          <p className="font-bold text-gray-600"><strong>Phone:</strong> {resumeData.phone}</p>
          <p className="font-bold text-gray-600"><strong>Skills:</strong> {resumeData.skills?.flatMap((cat: SkillCategory) => cat.items).join(", ")}</p>
        </div>

        <div className="bg-white p-4 border rounded-xl shadow">
          <h3 className="text-xl font-bold mb-2 text-gray-700">Job Description Summary</h3>
          <p className="font-bold text-gray-600"><strong>Skills Required:</strong> {jobDetails.skills?.join(", ")}</p>
          <p className="font-bold text-gray-600"><strong>Experience:</strong> {jobDetails.experience}</p>
          <p className="font-bold text-gray-600"><strong>Education:</strong> {jobDetails.education?.join(", ")}</p>
        </div>
      </div>

      <div className="bg-white p-4 border rounded-xl shadow">
        <h3 className="text-xl font-bold mb-2 text-gray-700">Comparison</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-green-700">Matched Skills</h4>
            <ul className="list-disc list-inside text-green-600">
              {matches.skills?.map((skill: string, idx: number) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-red-700">Missing Skills</h4>
            <ul className="list-disc list-inside text-red-600">
              {missing.skills?.map((skill: string, idx: number) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
