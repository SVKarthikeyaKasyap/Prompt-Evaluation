import { Student, MetricDefinition, ModelDetail, EvaluationPrompt } from "./types";

export const STUDENT_DETAILS: Student = {
  name: "Karthikeya SV",
  rollNumber: "23EG107D59",
  phoneNumber: "+91 62815 62800",
  deployedLink: "https://promptevaluation-sobcduxfddhduhgvyxtvfz.streamlit.app/", // updated placeholder link
};

export const ABSTRACT = 
  "This assessment focuses on designing a structured framework to evaluate the performance of Large Language Models (LLMs) " +
  "using standardized prompts and scoring methodologies. By testing 20 distinct prompts across a variety of use cases, " +
  "this report analyzes differences in reasoning, creativity, hallucination rate, instruction following, and response quality between two state-of-the-art models.";

export const OBJECTIVES: string[] = [
  "Design a reusable prompt evaluation framework",
  "Compare outputs from two different LLMs",
  "Evaluate reasoning, creativity, and factual accuracy",
  "Analyze hallucination and consistency levels",
  "Understand strengths and weaknesses of AI models"
];

export const MODELS_USED: ModelDetail[] = [
  {
    id: "LLM 1",
    name: "GPT-4o",
    provider: "OpenAI",
    role: "Answerer"
  },
  {
    id: "LLM 2",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    role: "Answerer / Competitor"
  }
];

export const EVALUATION_CRITERIA: MetricDefinition[] = [
  {
    name: "Accuracy",
    fullTitle: "Factual Accuracy",
    description: "Correctness of response; freedom from error",
  },
  {
    name: "Relevance",
    fullTitle: "Prompt Relevance",
    description: "Matches general user prompt intent and stays on topic",
  },
  {
    name: "Clarity",
    fullTitle: "Structural Clarity",
    description: "Easy to read, well-structured, and clear explanatory level",
  },
  {
    name: "Creativity",
    fullTitle: "Originality & Style",
    description: "Originality, imagination, and uniqueness of generated narrative",
  },
  {
    name: "Reasoning",
    fullTitle: "Logical Reasoning",
    description: "Analytical depth and quality of logical explanation/inference",
  },
  {
    name: "Hallucination",
    fullTitle: "Hallucination Rate",
    description: "Fabrication of facts or incorrect data (Lower is Better: 0 = perfect, 10 = complete fake)",
  },
  {
    name: "Instruction Following",
    fullTitle: "Constraint Compliance",
    description: "Adherence to negative constraints, length limits, and strict counts",
  },
  {
    name: "Consistency",
    fullTitle: "Performance Stability",
    description: "Stable execution quality and preservation of definitions across queries",
  }
];

export const COMPARATIVE_ANALYSIS = {
  accuracy: "Both models showcased near-flawless execution in mathematical reasoning, coding, and spatial tasks. They both evaluated syllogistic fallacies accurately without making false jumps in logic.",
  creativity: "LLM 2 (Claude 3.5 Sonnet) consistently nudged ahead in literary depth and prose elegance. Its sci-fi narrative and constrained sonnet exhibited more layered nuances than LLM 1 (GPT-4o).",
  reasoning: "Both models performed reasonably on logical reasoning, but LLM 2 showed stronger inference ability and correctly identified logical fallacies in the syllogism prompt.",
  hallucination: "Both systems displayed robust guardrails against misinformation. Neither model succumbed to the trick traps (Waterloo and Phlogistron), demonstrating strong factual grounding and defensive refutation capabilities.",
  instructionFollowing: "Both models struggled heavily with character-level negative constraints (Prompt 17: omitting the letter 'e') due to the structural limits of tokenization sub-words. However, for formatting constraints (JSON generation, structural counts, markdown arrays), both systems achieved a 100% compliance rate.",
  consistency: "Both models demonstrated highly consistent and reliable performance across the test suite."
};

export const OBSERVATIONS: string[] = [
  "GPT-4o (LLM 1) Strengths: Extremely punchy, precise, and structurally well-suited for quantitative tasks, data parsing, and direct code generation.",
  "Claude 3.5 Sonnet (LLM 2) Strengths: Superior at understanding abstract contextual metaphors, creative constraints, and generating human-like literary depth."
];

export const CONCLUSION = 
  "The evaluation framework implemented successfully highlights that while both frontier models perform almost identically on baseline factual accuracy and logic, they diverge on qualitative tasks. GPT-4o serves as an ideal production engine for raw logical output and structural code, whereas Claude 3.5 Sonnet acts as a superior tool for nuanced creative composition, conceptual synthesis, and human-centric messaging.";

export const FUTURE_IMPROVEMENTS: string[] = [
  "Add automated evaluation tools (e.g., using an LLM-as-a-judge system via Prometheus or GPT-4o-mini) to scale up grading.",
  "Include multimodal prompts that blend image processing and document reading capabilities.",
  "Evaluate operational metrics like generation latency (time-to-first-token) and real-world token pricing."
];
