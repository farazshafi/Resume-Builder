# 📄 Resume Builder

> Create humanized, ATS-friendly resumes tailored to your dream job using AI.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748?logo=prisma)](https://www.prisma.io/)

**Resume Builder** is a modern web application designed to help job seekers create professional, AI-optimized resumes. By leveraging Google's Gemini AI, it tailors your resume to search for specific job descriptions, ensuring you pass through Applicant Tracking Systems (ATS) while maintaining a human touch.

## ✨ Features

- 🤖 **AI-Powered Tailoring**: Automatically optimize your resume for specific job descriptions using Gemini AI.
- 📄 **PDF Generation**: Generate beautiful, professional PDFs ready for job applications.
- 📤 **Resume Upload**: Upload your existing resume (PDF) and let the AI extract and improve it.
- 🛠️ **Manual Editing**: Full control over your resume content with a sleek, intuitive editor.
- ⚡ **Real-time Preview**: See your changes instantly as you build.
- 🚀 **ATS Optimization**: Structured to be easily readable by modern recruitment software.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks

### Backend
- **Framework**: Express 5
- **Database**: PostgreSQL (via Prisma ORM)
- **AI Integration**: Google Generative AI (Gemini)
- **Caching**: Redis
- **Tooling**: Puppeteer (PDF generation), Multer (File uploads)

## 📁 Project Structure

```text
.
├── client/          # Next.js frontend application
│   ├── src/app/     # App router pages
│   └── src/components/ # React components
├── server/          # Express backend API
│   ├── src/controllers/ # Request handlers
│   ├── src/services/    # Business logic
│   └── src/repositories/# Data access layer
└── prisma/          # Database schema and migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/resume-builder.git
   cd resume-builder
   ```

2. **Setup Server**
   ```bash
   cd server
   cp .env.example .env
   # Update .env with your credentials
   npm install
   npx prisma generate
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.
