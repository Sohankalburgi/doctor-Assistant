import { ChatGroq } from "@langchain/groq";
import { internetSearch } from "./websearch";
import { createAgent } from "langchain";

const llm = new ChatGroq({
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY,
    maxRetries: 1,
    maxTokens: 1024
})


export const cardioAgent = createAgent({
    model: llm,
    description: "Expertise in Heart Disease Diagnosis - CardioLogist",
    name: "cardiologist",
    systemPrompt: `Your are the Heart specialist, You will be provided with the symptoms you have to diagonise the patient about his condition, You are given with symptoms, Gender and the age of the patient.

    Follow This to give the response which must include:
    - Problem Statement received (The Symptoms which you recieved).
    - Diagonized Issue Name.
    - Important things to note of if it happens more severity.
    - Steps to avoid and cure the disease
    `,
})


export const skinAgent = createAgent({
    model: llm,
    name: "dermatologist",
    description: "Expertise in Skin Disease Diagnosis - Dermatologist",
    systemPrompt: `Your are the Dermatologist specialist, You will be provided with the symptoms you have to diagonise the patient about his condition, You are given with symptoms,Gender and the age of the patient.

    Follow This to give the response which must include:
    - Problem Statement received (The Symptoms which you recieved).
    - Diagonized Issue Name.
    - Important things to note of if it happens more severity.
    - Steps to avoid and cure the disease`,
})

