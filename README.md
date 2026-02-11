# 📄 Resume Builder

<div align="center">

![Resume Builder Logo](client/public/logo.png)

> Create humanized, ATS-friendly resumes tailored to your dream job using AI.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.2-2D3748?logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

</div>

**Resume Builder** is a modern, full-stack web application designed to help job seekers create professional, AI-optimized resumes. By leveraging Google's Gemini AI, it intelligently tailors your resume for specific job descriptions, ensuring you pass through Applicant Tracking Systems (ATS) while maintaining a human touch.

---

## ✨ Features

- 🤖 **AI-Powered Tailoring**: Automatically optimize your resume for specific job descriptions using Gemini AI
- 📄 **PDF Generation**: Generate beautiful, professional PDFs with Puppeteer
- ☁️ **Cloud Storage**: Seamless PDF storage and retrieval via Cloudinary
- 📤 **Resume Upload**: Upload existing resumes (PDF) and let AI extract and improve content
- 🛠️ **Manual Editing**: Full control over resume content with an intuitive editor
- ⚡ **Real-time Preview**: See changes instantly as you build
- 🚀 **ATS Optimization**: Structured to be easily readable by modern recruitment software
- 🐳 **Docker Support**: Containerized deployment for easy setup and scaling
- 🔒 **Production Ready**: Deployed on Vercel (frontend) and Render (backend)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **State Management**: React 19 Hooks

### Backend
- **Framework**: Express 5.2.1
- **Language**: TypeScript 5
- **Database**: PostgreSQL (Neon) via Prisma ORM 6.19.2
- **AI Integration**: Google Generative AI (Gemini)
- **Cloud Storage**: Cloudinary
- **PDF Generation**: Puppeteer 24
- **File Uploads**: Multer 2
- **PDF Parsing**: pdf-parse
- **Security**: Helmet, CORS

### DevOps & Infrastructure
- **Containerization**: Docker
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: Neon (Serverless PostgreSQL)

---

## 📁 Project Structure

```text
.
├── client/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   └── components/       # React components
│   ├── public/               # Static assets
│   └── package.json
│
├── server/                    # Express backend API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── repositories/     # Data access layer
│   │   └── server.ts         # Entry point
│   ├── prisma/               # Database schema and migrations
│   ├── Dockerfile            # Docker configuration
│   ├── docker-compose.yml    # Docker Compose setup
│   ├── .env.example          # Environment variables template
│   └── package.json
│
├── CONTRIBUTING.md
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ 
- **PostgreSQL** (or use Neon for serverless)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
- **Cloudinary Account** ([Sign up here](https://cloudinary.com/))
- **Docker** (optional, for containerized setup)

---

## 📦 Installation Options

### Option 1: Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/farazshafi/Resume-Builder.git
cd Resume-Builder
```

#### 2. Setup Backend
```bash
cd server
cp .env.example .env
```

**Edit `.env` with your credentials:**
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/resume_builder?schema=public"
GEMINI_API_KEY="your_gemini_api_key_here"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NODE_ENV=development
PUPPETEER_EXECUTABLE_PATH=""  # Leave empty for local development
```

**Install dependencies and setup database:**
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

---

### Option 2: Docker Setup 🐳

#### 1. Clone the Repository
```bash
git clone https://github.com/farazshafi/Resume-Builder.git
cd Resume-Builder/server
```

#### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your production credentials
```

**Update `.env` for Docker:**
```env
PORT=5000
DATABASE_URL="your_neon_or_postgres_url"
GEMINI_API_KEY="your_gemini_api_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NODE_ENV=production
PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
```

#### 3. Build and Run with Docker Compose
```bash
docker-compose up --build
```

The server will be available at `http://localhost:5000`

#### Alternative: Build Docker Image Manually
```bash
docker build -t resume-builder-server .
docker run -p 5000:5000 --env-file .env resume-builder-server
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Deploy

### Backend Deployment (Render)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables from `.env.example`
5. Set `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable`
6. Deploy

---

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PUPPETEER_EXECUTABLE_PATH` | Chrome executable path (for Render/Docker) | No |

---

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:5000`
- **Production**: Your Render deployment URL

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/resume/upload` | Upload and parse PDF resume |
| `POST` | `/api/resume/generate` | Generate AI-optimized resume |
| `GET` | `/api/resume/:id` | Get resume by ID |
| `PUT` | `/api/resume/:id` | Update resume |
| `DELETE` | `/api/resume/:id` | Delete resume |

---

## 🧪 Development Scripts

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema changes to database
```

### Frontend
```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

---

## 🐳 Docker Commands

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild without cache
docker-compose build --no-cache
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful AI capabilities
- [Cloudinary](https://cloudinary.com/) for reliable cloud storage
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [Vercel](https://vercel.com/) & [Render](https://render.com/) for hosting

---

<div align="center">

**Made with ❤️ by [Faraz Shafi](https://github.com/farazshafi)**

⭐ Star this repo if you find it helpful!

</div>
