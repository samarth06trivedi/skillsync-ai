//api/parse-resume/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract"
import * as mammoth from "mammoth"

// Configure AWS
const textractClient = new TextractClient({
  region: process.env.AWS_REGION || "", // Change to your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("resume") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Check file type
    const fileType = file.name.split(".").pop()?.toLowerCase()

    if (!fileType || !["pdf", "doc", "docx"].includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type. Please upload a PDF or Word document." }, { status: 400 })
    }

    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    let text = ""

    // Parse based on file type
    if (fileType === "pdf") {
      // Use AWS Textract for PDF parsing
      const params = {
        Document: {
          Bytes: Buffer.from(arrayBuffer),
        },
      }

      const command = new DetectDocumentTextCommand(params)
      const response = await textractClient.send(command)

      // Combine detected text blocks
      text =
        response.Blocks?.filter((block) => block.BlockType === "LINE")
          .map((block) => block.Text)
          .join("\n") || ""
    } else if (fileType === "doc" || fileType === "docx") {
      // Parse DOCX
      const result = await mammoth.extractRawText({
        arrayBuffer: arrayBuffer,
      })
      text = result.value
    }

    // Return the extracted text
    return NextResponse.json({
      success: true,
      text,
      fileName: file.name,
      fileType,
      fileSize: file.size,
    })
  } catch (error) {
    console.error("Error parsing resume:", error)
    return NextResponse.json({ error: "Failed to parse resume", details: (error as Error).message }, { status: 500 })
  }
}