# MockHick (मौखिक) - AI Interview Coach

[![MockHick Hero Image](/public/mockhick.jpg)](https://mockhick.is-a.software)

**[Live Demo](https://mockhick.is-a.software) &nbsp;&middot;&nbsp; [Report a Bug](https://github.com/HakkanShah/mockhick/issues) &nbsp;&middot;&nbsp; [Request a Feature](https://github.com/HakkanShah/mockhick/issues)**

---

**MockHick** is an innovative, AI-powered web application designed to help users prepare for job interviews. Inspired by the Hindi word "Maukhik" (मौखिक), which means oral or spoken, the app simulates a realistic interview experience. It leverages Google's Gemini AI to dynamically generate questions, provide real-time transcription, and deliver detailed, personalized feedback to help users build confidence and land their dream job.

## ✨ Core Features

-   **Secure User Authentication**: Safe and reliable sign-up and login functionality using Firebase Authentication.
-   **Custom Interview Configuration**: Users can tailor mock interviews by specifying the job role, experience level, and keywords from a job description.
-   **Dynamic Question Generation**: Utilizes Google Gemini to generate a unique set of relevant interview questions based on the user's configuration.
-   **Voice-Based Practice (Web Speech API)**: Users can answer questions using their voice via the browser's native Web Speech API, simulating a real-world interview environment.
-   **Real-Time Transcription**: Live, on-screen transcription of the user's spoken answers.
-   **AI-Powered Feedback**: After the interview, Gemini provides a comprehensive performance analysis, including an overall score, identified strengths, and areas for improvement.
-   **Interview History**: All completed interviews, along with their transcripts and feedback, are saved to a secure Firestore database for users to review and track their progress over time.
-   **PWA Enabled**: Installable as a Progressive Web App for a native-like experience on any device.

## 🚀 Tech Stack

This project is built with a modern, robust, and scalable tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Generative AI**: [Google Gemini](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
-   **UI Components**: [React](https://reactjs.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **Voice Transcription**: [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
-   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
-   **Deployment**: [Vercel](https://vercel.com/) or [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🛠️ Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   `npm` or `yarn`

### 1. Clone the Repository

```bash
git clone https://github.com/HakkanShah/mockhick.git
cd mockhick
```

### 2. Install Dependencies

Install the required packages using your preferred package manager:

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

This project requires credentials for Firebase and Google Gemini.

1.  **Create a `.env.local` file** in the root directory of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
2.  **Add your Firebase project configuration**. You can get these values from the Firebase console:
    *   Go to Project Settings > General.
    *   Under "Your apps", select your web app.
    *   Click "Config" to see your SDK snippet and copy the values.
3.  **Add your Google Gemini API Key**. You can generate a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

Your `.env.local` file should look like this:

```plaintext
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-ABCDEFGHIJ"

# Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"

# Resend API Key (for contact form, optional)
RESEND_API_KEY="re_..."
```

### 4. Set Up Firestore Security Rules & Index

For the application to function correctly, you need to configure Firestore:

1.  **Security Rules**: Copy the contents of the `firestore.rules` file in this project and paste them into your Firestore security rules in the Firebase console.
2.  **Composite Index**: Run the `gcloud` command found in the comments of the `firestore.rules` file in your terminal. This creates the necessary database index for querying user interviews.

### 5. Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## 📜 Available Scripts

-   `npm run dev`: Starts the Next.js development server with Turbopack.
-   `npm run build`: Creates a production build of the application.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Runs ESLint to check for code quality issues.
-   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## ✍️ Author

This project was designed and developed by **[Hakkan](https://hakkan.is-a.dev)**.
