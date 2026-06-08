export interface Student {
  name: string;
  rollNumber: string;
  phoneNumber: string;
  deployedLink: string;
}

export interface MetricDefinition {
  name: string;
  description: string;
  fullTitle: string;
}

export interface ModelDetail {
  id: string;
  name: string;
  provider: string;
  role: string;
}

export interface EvaluationPrompt {
  id: number;
  category: string;
  prompt: string;
  purpose: string[];
  llm1Output: string;
  llm2Output: string;
  scores: {
    accuracy: number;
    relevance: number;
    clarity: number;
    creativity: number;
    reasoning: number;
    hallucination: number; // lower is better!
    instructionFollowing: number;
    consistency: number;
  };
}

export interface CustomPlaygroundRun {
  id: string;
  timestamp: string;
  prompt: string;
  llm1Response: string;
  llm2Response: string;
  scores: {
    llm1: ModelRunScores;
    llm2: ModelRunScores;
  };
  critique: string;
}

export interface ModelRunScores {
  accuracy: number;
  relevance: number;
  clarity: number;
  creativity: number;
  reasoning: number;
  hallucination: number; // lower is better
  instructionFollowing: number;
  consistency: number;
}
