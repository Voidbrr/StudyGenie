
// Use standard GoogleGenAI import and Type for schema definitions
import { GoogleGenAI, Type } from "@google/genai";
import { CourseData, GenerationRequest, Subject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define schema using standard Type enum
const courseSchema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The topic provided by the user" },
    grade: { type: Type.STRING, description: "The grade level" },
    subject: { type: Type.STRING, description: "The subject" },
    summary: { 
      type: Type.STRING, 
      description: "A comprehensive yet simple summary of the topic suitable for the grade level." 
    },
    flashcards: {
      type: Type.ARRAY,
      description: "A list of 5-10 flashcards for study.",
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING, description: "Question or term on the front" },
          back: { type: Type.STRING, description: "Answer or definition on the back" },
          explanation: { type: Type.STRING, description: "Additional context, mnemonic, or simple explanation to help memorize the answer." }
        },
        required: ["front", "back", "explanation"]
      }
    },
    fillInTheBlanks: {
      type: Type.ARRAY,
      description: "5 fill-in-the-blank exercises.",
      items: {
        type: Type.OBJECT,
        properties: {
          sentence: { type: Type.STRING, description: "The sentence with '_____' representing the missing word." },
          answer: { type: Type.STRING, description: "The missing word." }
        },
        required: ["sentence", "answer"]
      }
    },
    trueFalse: {
      type: Type.ARRAY,
      description: "5 true or false questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          statement: { type: Type.STRING, description: "The statement to evaluate." },
          isTrue: { type: Type.BOOLEAN, description: "Whether the statement is true." },
          explanation: { type: Type.STRING, description: "Brief explanation of why." }
        },
        required: ["statement", "isTrue", "explanation"]
      }
    },
    scenarios: {
      type: Type.ARRAY,
      description: "3 scenario-based multiple choice questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          scenario: { type: Type.STRING, description: "A short real-world scenario related to the topic." },
          question: { type: Type.STRING, description: "The question based on the scenario." },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 possible answers." },
          correctAnswerIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct answer." },
          explanation: { type: Type.STRING, description: "Why the answer is correct." }
        },
        required: ["scenario", "question", "options", "correctAnswerIndex", "explanation"]
      }
    }
  },
  required: ["topic", "grade", "subject", "summary", "flashcards", "fillInTheBlanks", "trueFalse", "scenarios"]
};

export const generateCourseContent = async (request: GenerationRequest, systemInstruction?: string): Promise<CourseData> => {
  const modelId = 'gemini-3-pro-preview'; 

  let languageInstruction = `Ensure the tone and complexity are perfect for Grade ${request.grade}.`;
  
  if (request.subject === Subject.URDU) {
    languageInstruction += `
      CRITICAL INSTRUCTION: Since the subject is Urdu, the ENTIRE OUTPUT MUST BE GENERATED IN THE URDU LANGUAGE (Urdu Script). 
    `;
  }

  const prompt = `
    You are an expert curriculum developer for ${request.publisher} publications.
    Create a study course for a Grade ${request.grade} student in the subject of ${request.subject}.
    The specific topic is: "${request.topic}".
    
    ${languageInstruction}
    
    ${systemInstruction ? `Additional user instructions: ${systemInstruction}` : ''}

    Generate the following:
    1. A Simple Summary.
    2. Flashcards with explanations.
    3. Fill in the blanks.
    4. True/False Questions.
    5. Scenario Based Questions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response received from Gemini.");
    
    const parsedData = JSON.parse(text) as CourseData;
    parsedData.id = crypto.randomUUID();
    parsedData.createdAt = Date.now();
    return parsedData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const solveDetailedQuestion = async (
  subject: string, 
  grade: string, 
  question: string, 
  imageBase64?: string,
  systemInstruction?: string
): Promise<string> => {
  const modelId = 'gemini-3-pro-preview';
  
  let languagePrompt = "";
  if (subject === Subject.URDU) {
    languagePrompt = "IMPORTANT: Answer extensively in Urdu script. Use clear, educational Urdu.";
  }

  const prompt = `
    You are a highly detailed and helpful tutor. 
    Explain the following question or problem in great detail for a Grade ${grade} student.
    Subject: ${subject}
    Topic/Question: ${question}
    
    ${languagePrompt}
    
    ${systemInstruction ? `Additional user instructions: ${systemInstruction}` : ''}

    Your answer should include:
    1. A detailed explanation of the concept.
    2. Step-by-step reasoning if it's a problem.
    3. Real-world examples or analogies.
    4. A summary of key points to remember.
    
    Make the response long, thorough, and easy to read.
  `;

  const parts: any[] = [{ text: prompt }];
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
    });
    return response.text || "I couldn't generate a detailed answer. Please try again.";
  } catch (error) {
    console.error("Detailed Solve Error:", error);
    throw error;
  }
};
