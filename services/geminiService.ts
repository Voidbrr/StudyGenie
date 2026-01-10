import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CourseData, GenerationRequest, Subject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const courseSchema: Schema = {
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

export const generateCourseContent = async (request: GenerationRequest): Promise<CourseData> => {
  const modelId = 'gemini-3-flash-preview'; 

  let languageInstruction = `Ensure the tone and complexity are perfect for Grade ${request.grade}.`;
  
  // Specific logic for Urdu language enforcement
  if (request.subject === Subject.URDU) {
    languageInstruction += `
      CRITICAL INSTRUCTION: Since the subject is Urdu, the ENTIRE OUTPUT (Summary, Flashcards, Questions, Explanations, Scenarios) MUST BE GENERATED IN THE URDU LANGUAGE (Urdu Script). 
      Do NOT generate English text unless it is a specific English term being taught in the Urdu context.
    `;
  } else if (request.subject === Subject.ISLAMIAT) {
    languageInstruction += `
      For Islamiat, you may use a mix of English and relevant Arabic/Urdu terms where appropriate for the curriculum, but the primary interface language should be English unless the topic specifically requests otherwise.
    `;
  }

  const prompt = `
    You are an expert curriculum developer for ${request.publisher} publications.
    Create a study course for a Grade ${request.grade} student in the subject of ${request.subject}.
    The specific topic is: "${request.topic}".
    
    ${languageInstruction}
    
    Generate the following:
    1. A Simple Summary: Easy to understand, key concepts.
    2. Flashcards: Key terms and definitions. Include a helpful explanation or mnemonic for each.
    3. Fill in the blanks: Sentences with missing keywords.
    4. True/False Questions: Common misconceptions vs facts.
    5. Scenario Based Questions: Applied knowledge.
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
    if (!text) {
      throw new Error("No response received from Gemini.");
    }
    
    const parsedData = JSON.parse(text) as CourseData;
    
    // Add client-side metadata
    parsedData.id = crypto.randomUUID();
    parsedData.createdAt = Date.now();
    
    return parsedData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};