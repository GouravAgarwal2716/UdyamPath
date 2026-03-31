import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || '';

let genAI = null;
let model = null;

function getModel() {
  if (!model && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return model;
}

const LANG_NAMES = { en: 'English', hi: 'Hindi', te: 'Telugu', ta: 'Tamil' };

function parseJSONOrThrow(text) {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse AI JSON:", text);
    throw new Error("AI returned invalid JSON format.");
  }
}

export async function validateIdea({ idea, language, location, budget, sector, stage }) {
  const m = getModel();
  const langName = LANG_NAMES[language] || 'English';

  const prompt = `You are an expert Indian Startup Validator. Validate this social entrepreneurship idea.
Idea: "${idea}"
Context: Location: ${location}, Budget: ${budget}, Sector: ${sector}, Stage: ${stage}
Language for output: ${langName}

Output ONLY valid JSON matching this structure exactly without any code formatting blocks or markdown texts:
{
  "overallScore": 85,
  "problemValidity": { "score": 80, "title": "string", "description": "string" },
  "uniquenessScore": 90,
  "uniquenessReason": "string",
  "targetAudience": { "primary": "string", "secondary": "string", "size": "string" },
  "marketSize": { "tam": "string", "sam": "string", "som": "string", "description": "string" },
  "existingSolutions": [{ "name": "string", "gap": "string" }],
  "strengths": ["string", "string"],
  "challenges": ["string", "string"],
  "firstSteps": ["string", "string", "string"],
  "emotionalImpact": { "message": "string", "peopleCount": 10, "comparison": "string" }
}`;

  const result = await m.generateContent(prompt);
  return parseJSONOrThrow(result.response.text());
}

export async function generateScenario({ startup, module, language, newsContext }) {
  const m = getModel();
  const langName = LANG_NAMES[language] || 'English';

  const prompt = `You are the Game Master for an Indian Social Startup Simulation Sandbox.
Startup Idea: "${startup.idea}"
City/Context: ${startup.city || 'India'}
Current Module / Challenge: ${module.name} (${module.category})
Difficulty: ${module.difficulty || 'Intermediate'}
Language for output: ${langName}

Real World News Context (Tie this into the scenario!):
"${newsContext || 'General market conditions'}"

Generate a highly interactive trial-and-error scenario. The user must make a critical decision.
Provide 4 options. Exactly ONE option must be the "Optimal Path" (the real-world success strategy used by successful Indian founders). The other 3 should be plausible but flawed mistakes (e.g. burning cash, ignoring local trust, bad unit economics).
For each option, provide the immediate consequence insight (budget change, trust change, impact score) and the hard lesson.

Output ONLY valid JSON matching this exact structure (no markdown fences):
{
  "scenario": {
    "context": "string (the dramatic situation occurring tying in the news, 2-3 sentences)",
    "question": "string (asking what specific strategy to execute)"
  },
  "options": [
    { "id": "A", "text": "string (Option A strategy)" },
    { "id": "B", "text": "string (Option B strategy)" },
    { "id": "C", "text": "string (Option C strategy)" },
    { "id": "D", "text": "string (Option D strategy)" }
  ],
  "consequences": {
    "A": { "budget": -5000, "trust": -10, "isOptimal": false, "insight": "string (Why this failed in the Indian context)" },
    "B": { "budget": 1000, "trust": 20, "isOptimal": true, "insight": "string (Why this is the golden real-world strategy used by successful founders. Name drop a real strategy/company if possible.)" },
    "C": { "budget": 0, "trust": -5, "isOptimal": false, "insight": "string (Why this failed)" },
    "D": { "budget": -10000, "trust": -20, "isOptimal": false, "insight": "string (Why this failed)" }
  }
}`;

  const result = await m.generateContent(prompt);
  return parseJSONOrThrow(result.response.text());
}

export async function evaluateDecision() {
  return null;
}

export async function getGrowthInsights({ startup, gameHistory, founderDNA, language }) {
  const m = getModel();
  const langName = LANG_NAMES[language] || 'English';

  const prompt = `You are the AI Growth Coach for an Indian Social Entrepreneur.
Startup: "${startup.idea}"
Their DNA Skills: Impact(${Math.round(founderDNA?.socialImpact || 50)}/100), Finance(${Math.round(founderDNA?.financialSustainability || 50)}/100), Team(${Math.round(founderDNA?.teamHealth || 50)}/100), Trust(${Math.round(founderDNA?.communityTrust || 50)}/100).
Recent Game History: ${JSON.stringify(gameHistory?.slice(-5) || [])}
Language: ${langName}

Based on where their skills are lowest and their recent decisions, generate a personalized growth dashboard.
Output ONLY valid JSON without markdown fences:
{
  "weaknessAreas": [
    { "area": "string", "score": 40, "description": "string" }
  ],
  "strengthAreas": [
    { "area": "string", "score": 80, "description": "string" }
  ],
  "mentorMessage": "string (Encouraging, personalized message based on their exact idea)",
  "nextMilestone": "string",
  "weeklyActionPlan": [
    { "day": "Day 1-2", "action": "string" },
    { "day": "Day 3-4", "action": "string" },
    { "day": "Day 5-7", "action": "string" }
  ],
  "recommendedModules": [
    { "title": "string", "reason": "string (Why they need to learn this)", "estimatedTime": "15 mins" }
  ]
}`;

  const result = await m.generateContent(prompt);
  return parseJSONOrThrow(result.response.text());
}

export async function chatWithCoach({ messages, startup, language }) {
  const m = getModel();
  if (!m) return "I'm here to help! Please add your Gemini API key to get personalized AI coaching.";

  const langName = LANG_NAMES[language] || 'English';
  const systemContext = `You are the UdyamPath AI Mentor. You are guiding an Indian social entrepreneur building: "${startup?.idea || 'a new project'}".
Use language: ${langName}. Be direct, empathetic, and focus on practical Indian context (jugaad, rural dynamics, unit economics). Do not be overly verbose. Use markdown for readability.`;

  const chatHistory = messages.slice(-8).map(msg => {
    const parts = [];
    if (msg.content) {
      parts.push({ text: msg.content });
    }
    if (msg.image) {
      parts.push({
        inlineData: {
          data: msg.image.data,
          mimeType: msg.image.mimeType
        }
      });
    }
    // Fallback if empty
    if (parts.length === 0) {
      parts.push({ text: "Empty message" });
    }

    return {
      role: msg.role === 'user' ? 'user' : 'model',
      parts,
    };
  });

  try {
    const chat = m.startChat({
      history: chatHistory.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.8,
      },
      systemInstruction: systemContext,
    });

    const lastMsg = chatHistory[chatHistory.length - 1];
    
    // Pass the parts array to sendMessage for multidisplay
    const result = await chat.sendMessage(lastMsg.parts);
    return result.response.text();
  } catch (err) {
    console.error('Coach chat error:', err);
    return "Network error, please try again.";
  }
}

export async function evaluateLevelFailure({ startup, levelDetails, scores, history, language }) {
  const m = getModel();
  const langName = LANG_NAMES[language] || 'English';

  const prompt = `You are the AI Growth Coach for an Indian Social Entrepreneur.
They just FAILED Level: "${levelDetails?.title}" (${levelDetails?.description}).
Their Scores: Impact(${scores?.socialImpact}/${levelDetails?.thresholds?.impact||0}), Finance(${scores?.financialSustainability}/${levelDetails?.thresholds?.finance||0})
Required to Pass: ${JSON.stringify(levelDetails?.thresholds || {})}
Game History: ${JSON.stringify(history)}
Language: ${langName}

Analyze their gameplay decisions and generate a specific harsh-but-fair feedback message, AND assign exactly 2 personalized learning modules they must study before retaking the level.

Output ONLY valid JSON without any markdown code block:
{
  "failureReason": "string (Why they failed based on their choices)",
  "mentorMessage": "string (Encouraging but firm advice on what to rethink)",
  "assignedHomework": [
    { "title": "string", "reason": "string", "estimatedTime": "15 mins" },
    { "title": "string", "reason": "string", "estimatedTime": "20 mins" }
  ]
}`;

  const result = await m.generateContent(prompt);
  return parseJSONOrThrow(result.response.text());
}

export async function generateDynamicResources({ startup, language }) {
  const m = getModel();
  const langName = LANG_NAMES[language] || 'English';

  const prompt = `Generate a list of highly specific, real-world educational resources (books, frameworks, exact youtube search terms) tailored perfectly to this Indian social enterprise idea:
Idea: "${startup.idea}"
Sector: "${startup.sector}"
Language: ${langName}

Output ONLY valid JSON without markdown fences:
{
  "videos": [
    { "title": "string (Specific Video Title)", "channel": "string", "duration": "10 min", "thumbnailColor": "indigo" },
    { "title": "string (Specific Video Title)", "channel": "string", "duration": "15 min", "thumbnailColor": "rose" },
    { "title": "string (Specific Video Title)", "channel": "string", "duration": "8 min", "thumbnailColor": "emerald" }
  ],
  "books": [
    { "title": "string", "author": "string", "keyTakeaway": "string" },
    { "title": "string", "author": "string", "keyTakeaway": "string" }
  ]
}`;
  
  const result = await m.generateContent(prompt);
  return parseJSONOrThrow(result.response.text());
}
