import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API for dynamic prompt evaluation
app.post("/api/evaluate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    // We make a single call to Gemini with a highly-structured prompt instructing it to act as:
    // 1. LLM 1 (GPT-4o - representing OpenAI’s flagship: fast, precise, structured, great at code/math/data extraction)
    // 2. LLM 2 (Claude 3.5 Sonnet - representing Anthropic’s flagship: detailed, academic, superior storytelling/poetry, deep qualitative nuances)
    // 3. LLM 2 (Judge) scoring both responses across our 8 criteria metrics (0-10 scale). 
    // This allows a complete comparative evaluation in a single neat roundtrip!
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
                    hallucination: { type: Type.INTEGER, description: "Lower is better! 0 is zero hallucination, 10 is complete fake." },
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
                    hallucination: { type: Type.INTEGER, description: "Lower is better! 0 is zero hallucination, 10 is complete fake." },
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
    res.json(evaluationResult);

  } catch (error: any) {
    console.error("Evaluation API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during prompt evaluation" });
  }
});

// App health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Vite Integration
async function launchServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with HMR disabled...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

launchServer();
