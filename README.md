# visit the live website at: https://skillsync-ai-nu.vercel.app/
# SkillSync AI

SkillSync AI is a smart resume-job matcher web app that compares your resume against job descriptions, highlighting matched and missing skills with a match percentage. Built with Next.js, TailwindCSS, and OpenRouter AI APIs, it helps job seekers optimize their resumes for specific roles.

![Screenshot](public/screenshot.png)

---

## 🚀 Features

- 🔐 **Authentication** with NextAuth
- 📄 **Resume Upload** with AWS Textract for text extraction (PDF parsing)
- ✍️ **Job Description Parsing** via AI (OpenRouter/DeepSeek)
- 🤖 **Smart Matching** of skills between resume and job description
- 📊 **Match Percentage** breakdown with matched/missing skill lists
- 💾 **LocalStorage** support for fast comparison persistence

---

## 🧠 How It Works

1. **Upload Resume** (PDF) → parsed with AWS Textract
2. **Paste Job Description** → parsed via LLM into structured data
3. **Compare Page** → SkillSync AI shows a match percentage and details
4. **Save Jobs** to track status (Offer / Rejected / In Progress)

---

## 📸 UI Preview

| Upload Page                         | Compare Page                         | Dashboard                          |
|-------------------------------------|--------------------------------------|-------------------------------------|
| ![](public/screens/upload.png)      | ![](public/screens/compare.png)      | ![](public/screens/dashboard.png)  |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, TypeScript
- **Auth**: NextAuth (no Prisma)
- **Backend API**: AWS Textract + OpenRouter (DeepSeek model)
- **State Management**: React Context + LocalStorage
- **Deployment**: Vercel (Recommended)

---

## 🧪 Local Development

### 1. Clone the repo

```bash
git clone https://github.com/your-username/skillsync-ai.git
cd skillsync-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env.local` file with:

```env
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region

OPENROUTER_API_KEY=your_openrouter_key
```

### 4. Run the dev server

```bash
npm run dev
```

App will be running at [http://localhost:3000](http://localhost:3000)

---

## ✅ Todos

- [x] Resume + JD parsing flow
- [x] Compare page with match/miss skills
- [x] Dashboard with CRUD per status
- [ ] Export comparison as PDF
- [ ] Improve matching logic using embeddings (future)

---

## 📄 License

MIT License. Free to use and modify.

---

## 🙌 Acknowledgements

- [AWS Textract](https://aws.amazon.com/textract/)
- [OpenRouter](https://openrouter.ai/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
