# Doctor Assistant - Multi-Agent AI Healthcare Platform

An advanced healthcare assistant powered by a **Multi-Agent AI System**. This application orchestrates a team of specialized medical agents to provide accurate, domain-specific preliminary diagnoses and health recommendations based on patient symptoms.

## 🌟 Key Features

### 🤖 Multi-Agent Architecture
Unlike standard chatbots, this system uses a **Supervisor-Specialist** pattern to ensure expert-level responses:
*   **Supervisor Agent**: Acts as the "General Practitioner". It analyzes patient input, determines the medical domain, and routes the case to the most appropriate specialist.
*   **Specialized Agents**: A team of 10+ dedicated agents, each prompted with deep domain knowledge:
    *   🫀 **Cardiologist**
    *   🧴 **Dermatologist**
    *   🧠 **Neurologist**
    *   👁️ **Ophthalmologist**
    *   🦴 **Orthopedist**
    *   🤰 **Gynecologist**
    *   👂 **ENT Specialist**
    *   🧠 **Psychiatrist**
    *   👶 **Pediatrician**
    *   ⚧️ **Sexologist**

### 💊 Medicine Alternatives
*   **Smart Search**: Instantly find medicines and their details.
*   **AI Recommendations**: Get suggestions for generic or cheaper alternatives with simplified dosage and side-effect information.
*   **Visual Data**: Results presented in clean, readable tables.

### ⚡ Powered by Groq & LangChain
*   **Ultra-Fast Inference**: Utilizes Groq's LPU inference engine for near-instant AI responses.
*   **Models Used**:
    *   **Supervisor**: `qwen/qwen3-32b` for complex reasoning and routing.
    *   **Specialists**: `llama-3.1-8b-instant` for rapid, domain-specific advice.

## 🛠️ Technology Stack

*   **Frontend**: Next.js 16, React 19, Tailwind CSS v4
*   **AI Orchestration**: LangChain.js, DeepAgents
*   **LLM Provider**: Groq API
*   **Database**: PostgreSQL, Prisma ORM
*   **UI Components**: Radix UI, Lucide React

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```
3.  **Set up Environment Variables**:
    Create a `.env` file with your keys:
    ```env
    GROQ_API_KEY=your_groq_api_key
    DATABASE_URL=your_postgres_url
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🏗️ How it Works

1.  **User Input**: Patient submits symptoms (e.g., "fast heartbeat and chest pain").
2.  **Supervisor Analysis**: The Supervisor Agent analyzes the text and identifies a "Cardiology" intent.
3.  **Delegation**: The task is handed off to the **CardioAgent** tool.
4.  **Specialist Diagnosis**: The CardioAgent reviews age, gender, and symptoms to generate a specific assessment, including:
    *   Potential Issue Identification
    *   Severity Warnings
    *   Preventive Steps & Care
5.  **Response**: The aggregated expert advice is presented back to the user.

> **Disclaimer**: This AI assistant is for informational purposes only and does not replace professional medical advice. Always consult a certified doctor for diagnosis and treatment.
