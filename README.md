# BrainMap - AI-Powered Learning Platform

BrainMap is an intelligent learning platform that uses AI to generate quizzes, provide detailed explanations, and track your learning progress. Built with the MERN stack and powered by Google's Gemini AI.

## Features

-   **AI-Generated Quizzes**: Instantly generate quizzes on any topic with varying difficulty levels.
-   **Intelligent Feedback**: Get detailed explanations for every answer to understand the 'why' behind the 'what'.
-   **Progress Tracking**: Visualize your learning journey with detailed analytics and history.
-   **Spaced Repetition**: Smart study queue to help you review topics at the right time.
-   **Light/Dark Mode**: Beautiful, responsive UI with theme support.
-   **Secure Authentication**: User accounts with secure login and signup.

## Tech Stack

-   **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB Atlas
-   **AI**: Google Gemini AI
-   **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

-   Node.js installed
-   MongoDB Atlas account (or local MongoDB)
-   Google Gemini API Key

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/brainmap.git
    cd brainmap
    ```

2.  **Server Setup**

    Navigate to the server directory and install dependencies:

    ```bash
    cd server
    npm install
    ```

    Create a `.env` file in the `server` directory with the following variables:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key
    ```

    Start the server:

    ```bash
    npm start
    ```

3.  **Client Setup**

    Navigate to the client directory and install dependencies:

    ```bash
    cd ../client
    npm install
    ```

    Start the development server:

    ```bash
    npm run dev
    ```

4.  **Access the Application**

    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## License

This project is licensed under the MIT License.
