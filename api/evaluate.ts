import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel Serverless environment
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY environment variable is required. Please set it in your Vercel Project Settings." 
      });
    }

    const ai = new GoogleGenAI({ apiKey: key });

    const sysInstruction = `You are an expert AI evaluations assessor. Below, you will be given a user prompt. Your task is to:
1. Simulate a response from "LLM 1 (GPT-4o)", which represents OpenAI's flagship: highly responsive, direct, structured with clear bullets, and extremely skilled in mathematical, spatial, and technical coding queries.
2. Simulate a response from "LLM 2 (Claude 3.5 Sonnet)", which represents Anthropic's flagship: highly expressive, academically rigorous, possessing deep literary nuance, superior poetry flow, and structural comparison tables.
3. Act as a neutral, balanced "LLM 2 (Judge)" and grade BOTH generated responses from 0 to 10 on these exact 8 metrics:
   - accuracy (factual correctness)
   - relevance (matching prompt intent)
   - clarity (ease of understanding)
   - creativity (originality & storytelling)
   - reasoning (logic & depth)
   - hallucination (rate from 0 to 10 where 0 = impeccable factual grounding, 10 = complete fabrication. Smaller score is better!)
   - instructionFollowing (adherence to counting, formatting, etc.)
   - consistency (overall stability)
4. Provide a summarized visual critique explaining why the scores differ and which model won the round.

You MUST respond strictly in JSON matching the specified schema format.`;

    const modelResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Prompt: "${prompt}"`,
      config: {
        systemInstruction: sysInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            llm1Response: {
              type: Type.STRING,
              description: "Simulated response of GPT-4o (fast, concise, structured, highly precise)."
            },
            llm2Response: {
              type: Type.STRING,
              description: "Simulated response of Claude 3.5 Sonnet (academically descriptive, elegant prose, superior literary metaphors)."
            },
            scores: {
              type: Type.OBJECT,
              properties: {
                llm1: {
                  type: Type.OBJECT,
                  properties: {
                    accuracy: { type: Type.INTEGER },
                    relevance: { type: Type.INTEGER },
                    clarity: { type: Type.INTEGER },
                    creativity: { type: Type.INTEGER },
                    reasoning: { type: Type.INTEGER },
                    hallucination: { type: Type.INTEGER },
                    instructionFollowing: { type: Type.INTEGER },
                    consistency: { type: Type.INTEGER }
                  },
                  required: ["accuracy", "relevance", "clarity", "creativity", "reasoning", "hallucination", "instructionFollowing", "consistency"]
                },
                llm2: {
                  type: Type.OBJECT,
                  properties: {
                    accuracy: { type: Type.INTEGER },
                    relevance: { type: Type.INTEGER },
                    clarity: { type: Type.INTEGER },
                    creativity: { type: Type.INTEGER },
                    reasoning: { type: Type.INTEGER },
                    hallucination: { type: Type.INTEGER },
                    instructionFollowing: { type: Type.INTEGER },
                    consistency: { type: Type.INTEGER }
                  },
                  required: ["accuracy", "relevance", "clarity", "creativity", "reasoning", "hallucination", "instructionFollowing", "consistency"]
                }
              },
              required: ["llm1", "llm2"]
            },
            judgeCritique: {
              type: Type.STRING,
              description: "Professional markdown comparison detailing structural differences, explaining the scores, and concluding with an overall verdict."
            }
          },
          required: ["llm1Response", "llm2Response", "scores", "judgeCritique"]
        }
      }
    });

    const resultText = modelResponse.text;
    if (!resultText) {
      throw new Error("No response content from Gemini modeling API");
    }

    const evaluationResult = JSON.parse(resultText);
    return res.status(200).json(evaluationResult);

  } catch (error: any) {
    console.error("Vercel Serverless API Error:", error);
    return res.status(500).json({ error: error.message || "An error occurred during prompt evaluation" });
  }
}
