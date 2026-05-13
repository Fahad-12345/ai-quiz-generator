# AI Quiz Generator

An AI-powered quiz generation platform that creates multiple-choice quizzes from uploaded documents or pasted text using local LLMs through Ollama.

The system allows users to upload study materials and instantly generate quizzes for learning, revision, and self-assessment.

---

# Features

- Upload and process:
  - PDF files
  - Word documents (.docx)
  - PowerPoint presentations (.pptx)

<img width="1920" height="955" alt="Screenshot (243)" src="https://github.com/user-attachments/assets/fe93134f-a3bc-485c-8b22-d5ed76ba317a" />


- Generate quizzes from:
  - Uploaded files
  - Manually pasted text

- AI-generated multiple-choice questions

- Download generated quizzes as PDF files

- Responsive and user-friendly interface

<img width="1920" height="969" alt="Screenshot (244)" src="https://github.com/user-attachments/assets/a39fc574-4af1-479e-9f18-561e74056606" />


---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Axios

## Backend
- Node.js
- Fastify
- PostgreSQL

## AI & Processing
- Ollama
- gemma2:2b
- pdf-parse

---

# How It Works

```text
Upload File / Paste Text
            ↓
      Text Extraction
            ↓
      AI Quiz Generation
            ↓
  Multiple Choice Questions
            ↓
      PDF Quiz Export
```

---

# Supported File Formats

- PDF
- DOCX
- PPTX

---

# Key Functionalities

- File upload handling
- Document text extraction
- AI-based question generation
- Multiple-choice quiz creation
- Dynamic frontend rendering
- PDF export functionality

---

# Project Highlights

- Built a full-stack AI-powered application using Next.js and Fastify
- Integrated local LLM inference with Ollama
- Implemented document parsing and quiz generation workflow
- Designed scalable API architecture for AI processing
- Handled long-running AI requests and frontend state management

---

# Future Improvements

- User authentication
- Quiz history management
- Difficulty-level selection
- Timer-based quiz mode
- Multi-language support
- Cloud deployment

---

# Author

Fahad Irfan  
Electrical Engineer | Full Stack Developer 
