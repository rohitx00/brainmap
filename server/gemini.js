import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuestions = async (topic, difficulty) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate 5 multiple-choice questions about "${topic}" at "${difficulty}" level.
    Format the output strictly as a JSON array of objects.
    Each object must have:
    - "id": (number)
    - "question": (string)
    - "options": (array of 4 strings)
    - "answer": (string, must be one of the options)
    - "explanation": (string, provide a concise explanation.)

    Example format:
    [
        {
            "id": 1,
            "question": "What is 2+2?",
            "options": ["3", "4", "5", "6"],
            "answer": "4",
            "explanation": "2 plus 2 equals 4."
        }
    ]
    Do not include markdown formatting like \`\`\`json. Just return the raw JSON array.`;

    try {
        console.log("Calling Gemini API...");
        const result = await model.generateContent(prompt);
        console.log("Gemini API call successful");
        const response = await result.response;
        console.log("Got response object");
        const text = response.text();

        // Clean up potential markdown formatting if Gemini adds it despite instructions
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("Gemini API Error Details:");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        if (error.response) {
            console.error("Error response:", error.response);
        }
        if (error.status) {
            console.error("Error status:", error.status);
        }
        throw new Error("Failed to generate questions: " + error.message);
    }
};

/**
 * Generate general AI content (for tutor chat)
 */
export const generateContent = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        const enhancedPrompt = `${prompt}\n\nKeep the response concise and do not use any markdown formatting.`;
        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        let text = response.text();

        // Remove markdown characters
        text = text.replace(/[*#_`]/g, '');

        return text;
    } catch (error) {
        console.error("Gemini content generation error:", error.message);
        throw new Error("Failed to generate content: " + error.message);
    }
};
