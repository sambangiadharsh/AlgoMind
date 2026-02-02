 <h1 align="center">AlgoMind - Spaced Repetition for DSA Mastery</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/Resham011/AlgoRecall/main/frontend/src/assets/Logo.png" alt="AlgoMind Logo" width="150"/>
</p>

<h3 align="center">Never forget a coding problem again. Master your Data Structures and Algorithms preparation for tech interviews.</h3>

<p align="center">
  <a href="http://13.127.77.21" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-Open_App-blue?style=for-the-badge&logo=vercel" alt="Live Demo"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

---

**AlgoMind** is a full-stack web application designed to help software engineers and students systematically prepare for technical interviews. By leveraging the power of a **spaced repetition algorithm**, the platform creates optimized, daily revision schedules to ensure you not only solve problems but truly remember the patterns and solutions.

## ✨ Key Features

AlgoMind is packed with features designed to streamline your interview preparation and maximize retention.

| Feature                      | Description                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
| **🧠 Smart Revision System** | Get a daily, personalized list of problems to revise. Our algorithm schedules problems based on your past performance and confidence levels to interrupt the "forgetting curve."                          
| **📊 Analytics Dashboard** | A comprehensive dashboard provides a visual overview of your progress, including problem distribution by difficulty, status breakdown (Mastered, Revisiting, Pending), and your daily revision streak.        
| **🗂️ Centralized Problem Hub** | Log problems from any platform (LeetCode, HackerRank, etc.) with details like difficulty, tags, and company-specific questions. Keep all your notes and solutions organized in one place.                   
| **⚙️ Customizable Sessions** | Tailor your revision sessions to your needs. Focus on specific **topics** (e.g., "Dynamic Programming"), **companies** (e.g., "Google"), or a combination of both to target your practice. 
| **🔐 Secure Authentication** | Full user authentication system with email verification, password reset, and secure session management using **JSON Web Tokens (JWT)** to keep your data private and personalized.                         

## 🚀 Live Demo

Experience AlgoMind for yourself:

**[http://13.127.77.21]**

You can use the following credentials to log in and test the application, or feel free to register your own account!
- **Email:** `sambangialex@gmail.com`
- **Password:** `Alex123`

## 🛠️ Tech Stack

AlgoMind is built with the MERN stack and other modern technologies to deliver a fast, secure, and responsive user experience.

| Category      | Technologies                                                                          |
| ------------- | ------------------------------------------------------------------------------------- |
| **Frontend** | React, Redux Toolkit, React Router, Tailwind CSS, Axios, Recharts                     |
| **Backend** | Node.js, Express.js                                                                   |
| **Database** | MongoDB                                                                               |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js                                                  |
| **Deployment**| Vercel (Frontend), Render (Backend)                                                   |

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v14 or later)
* npm
* MongoDB Atlas account (or a local MongoDB instance)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/sambangiadharsh/AlgoMind]
    cd AlgoMind
    ```

2.  **Install Backend Dependencies:**
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set Up Environment Variables:**
    Create a `.env` file in the `backend` directory and add the following variables.
    ```env
    MONGO_URI=<Your_MongoDB_Connection_String>
    JWT_SECRET=<Your_JWT_Secret_Key>
    NODE_ENV=development
    PORT=5000


5.  **Run the Application:**
    * **Start the Backend Server (from the `backend` directory):**
        ```sh
        npm start
        ```
    * **Start the Frontend Development Server (from the `frontend` directory):**
        ```sh
        npm run dev
