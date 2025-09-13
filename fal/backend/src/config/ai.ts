import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// OpenAI configuration
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Google Generative AI configuration
export const googleAI = new GoogleGenerativeAI(
  process.env.GOOGLE_AI_API_KEY || ''
);

// AI model configurations
export const AI_CONFIG = {
  openai: {
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
  },
  google: {
    model: 'gemini-pro',
    maxTokens: 1000,
    temperature: 0.7,
  },
};
