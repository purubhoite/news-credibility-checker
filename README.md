# News Check Analysis 📰

A hybrid AI-powered web application designed to help users verify the authenticity of news claims and combat misinformation in real-time.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## ✨ Live Demo

[**https://news-credibility-checker.vercel.app**](https://news-credibility-checker.vercel.app) ---

## 🎯 The Problem

In a world of rapid information sharing, misinformation spreads quickly through social media and messaging apps. People often lack the time or tools to verify if what they're reading is true. This project aims to solve that problem by providing a fast, reliable, and transparent fact-checking service.

---

## 🚀 Features

* **Real-time Fact-Checking:** Submit any news claim, snippet, or URL for instant analysis.
* **Hybrid AI Pipeline:** Leverages Perplexity AI for broad web research and Google Gemini for structured reasoning and analysis.
* **Detailed Verdicts:** Provides a clear verdict (**True**, **False**, **Partially True**), a confidence score, and a concise summary of the findings.
* **Sourced & Transparent:** Every analysis includes a list of the reputable news articles and sources used to reach the conclusion.
* **Claim History:** Saves your previous checks for future reference (powered by a PostgreSQL database).

---

## 🛠️ Tech Stack & Architecture

This is a full-stack application built with a modern, type-safe technology stack.

* **Frontend:** **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **shadcn/ui**
* **Backend:** **Node.js**, **Express**, **TypeScript**
* **Database:** **PostgreSQL** with **Prisma ORM**
* **AI & APIs:** **Perplexity AI** (for research), **Google Gemini** (for formatting & final verdict)
* **Caching:** **Redis** (with `ioredis`)
* **Deployment:** **Vercel** (Frontend), **Render** (Backend, Database & Cache)

### ⚙️ Application Flow

The application uses a two-step AI process to ensure high-quality results:

1.  **User Submits Claim:** The React frontend sends the claim to the backend.
2.  **Perplexity Investigates:** The backend asks Perplexity AI to act as a research assistant, scouring the web for relevant articles and generating a detailed text summary.
3.  **Gemini Analyzes & Structures:** The backend sends Perplexity's research to Google Gemini to act as an expert analyst. Gemini determines the final verdict, writes the summary, and formats everything into a clean JSON object.
4.  **Data Persistence:** The structured result is saved to the PostgreSQL database and cached in Redis.
5.  **Result Displayed:** The final JSON is sent back to the frontend and displayed to the user.

---

## 🏁 Getting Started

To run this project locally, follow these steps.

### Prerequisites

* Node.js (v18 or later)
* npm or yarn
* Git

### 1. Clone the Repository

```bash
git clone [https://github.com/purubhoite/news-credibility-checker.git](https://github.com/purubhoite/news-credibility-checker.git)
cd news-credibility-checker
```

### 2. Set Up Environment Variables

You will need to create `.env` files for both the frontend and backend.

* **Backend:** Create a file at `backend/.env` and add the following keys:

    ```env
    # backend/.env

    # From your Render PostgreSQL database
    DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

    # Your API keys
    PERPLEXITY_API_KEY="your_perplexity_key"
    GEMINI_API_KEY="your_gemini_key"

    # Recommended model names
    PERPLEXITY_MODEL="llama-3-sonar-small-32k-online"
    GEMINI_MODEL="gemini-1.5-flash-latest"
    ```

* **Frontend:** Create a file at the root of the project named `.env.local`:

    ```env
    # .env.local (in the root folder)

    # The local URL of your backend server
    VITE_API_URL=http://localhost:8080
    ```

### 3. Install Dependencies

Install packages for both the backend and the frontend.

```bash
# Install backend dependencies
cd backend
npm install

# Go back to the root and install frontend dependencies
cd ..
npm install
```

### 4. Set Up the Database

Run the Prisma migration command to set up your local database tables.

```bash
cd backend
npx prisma migrate dev
```

### 5. Run the Application

You'll need two separate terminal windows.

* **Terminal 1 (Run the Backend):**

    ```bash
    cd backend
    npm run dev
    ```
    *Your backend will be running at `http://localhost:8080`.*

* **Terminal 2 (Run the Frontend):**

    ```bash
    # From the root project folder
    npm run dev
    ```
    *Your frontend will open in your browser, likely at `http://localhost:5173` or http://localhost:3000.*

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
