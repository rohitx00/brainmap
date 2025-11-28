import { generateContent } from '../gemini.js';

/**
 * AI Tutor Service
 * Handles prompt engineering and AI interactions for the tutor chat
 */

/**
 * Format chat history for context
 */
const formatChatHistory = (messages) => {
    if (!messages || messages.length === 0) return 'No previous conversation.';

    return messages
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.message}`)
        .join('\n');
};

/**
 * Build prompt for general study help
 */
const buildGeneralPrompt = (userMessage, chatHistory) => {
    return `You are a friendly and knowledgeable AI tutor helping students learn any topic.

Conversation history:
${formatChatHistory(chatHistory)}

Student's question: ${userMessage}

Provide a clear, encouraging, and educational response:
- Explain concepts in simple, understandable terms
- Use examples and analogies when helpful
- Ask follow-up questions to check understanding
- Suggest related topics they might find interesting
- Be supportive and motivating
- Keep responses under 150 words unless the topic's complexity requires more

Remember: You're here to help them learn, not just give answers.`;
};

/**
 * Build prompt for quiz hints (doesn't reveal answer)
 */
const buildQuizHintPrompt = (userMessage, context, chatHistory) => {
    const { question, options, topic, difficulty } = context;

    return `You are a helpful tutor assisting a student during a ${difficulty} difficulty quiz on "${topic}".

Current question: ${question}
Available options: ${options ? options.join(', ') : 'Multiple choice'}

Previous hints in this conversation:
${formatChatHistory(chatHistory)}

Student's question/concern: ${userMessage}

Provide a HELPFUL HINT (DO NOT reveal the correct answer):
- Ask a guiding question that helps them think
- Point them toward a relevant concept or principle
- Help them eliminate obviously wrong options if stuck
- Encourage their reasoning process
- Be supportive and patient

Keep your hint brief (2-4 sentences). Never directly state which option is correct.`;
};

/**
 * Build prompt for explaining quiz answers
 */
const buildExplanationPrompt = (context) => {
    const { question, userAnswer, correctAnswer, options, topic } = context;

    return `You are an expert tutor explaining a quiz question to a student.

Topic: ${topic}
Question: ${question}
Available options: ${options ? options.join(', ') : 'N/A'}
Student's answer: ${userAnswer}
Correct answer: ${correctAnswer}

Provide a comprehensive explanation:

1. **Why the correct answer is right**: Explain the reasoning and key concepts
2. **Why the student's answer was incorrect**: Address the misconception gently
3. **Key concept to remember**: Highlight the main takeaway
4. **Related topic**: Suggest one related area they might want to study

Be clear, encouraging, and educational. Use examples if they help clarify the concept.`;
};

/**
 * Main function to get AI response based on context
 */
export const getTutorResponse = async (userMessage, sessionType, context = {}, chatHistory = []) => {
    try {
        let prompt;

        if (sessionType === 'quiz' && context.isExplanation) {
            // Explaining a quiz answer
            prompt = buildExplanationPrompt(context);
        } else if (sessionType === 'quiz') {
            // Providing hints during quiz
            prompt = buildQuizHintPrompt(userMessage, context, chatHistory);
        } else {
            // General study help
            prompt = buildGeneralPrompt(userMessage, chatHistory);
        }

        // Get response from Gemini
        const response = await generateContent(prompt);

        return {
            success: true,
            message: response
        };

    } catch (error) {
        console.error('Tutor service error:', error);
        return {
            success: false,
            message: 'I apologize, but I encountered an error. Please try again in a moment.'
        };
    }
};

/**
 * Generate a welcome message for new sessions
 */
export const getWelcomeMessage = (sessionType, context = {}) => {
    if (sessionType === 'quiz') {
        return `Hi! I'm your AI tutor. I can help you with hints for this ${context.topic || 'quiz'}. Ask me anything, but I won't give away the answers directly - I'm here to help you learn! 📚`;
    }

    return `Hello! I'm your AI tutor. Ask me anything you'd like to learn about - whether it's explaining concepts, solving problems, or exploring new topics. How can I help you today? 🎓`;
};
