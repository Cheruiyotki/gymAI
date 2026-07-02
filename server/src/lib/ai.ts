import OpenAI from "openai";
import dotenv from "dotenv"
import { TrainingPlan, UserProfile } from "../../types";
import { build } from "vite";

dotenv.config();

export async function generateTrainingPlan(profile:  UserProfile | Record<string, any>,):Promise<TrainingPlan>  {
  

    // Normalize profile data
    const normalizedProfile: UserProfile ={
         goal: profile.goal || "bulk",
    experience: profile.experience || "intermediate",
    days_per_week: profile.days_per_week || 4,
    session_length: profile.session_length || 60,
    equipment: profile.equipment || "full_gym",
    injuries: profile.injuries || null,
    preferred_split: profile.preferred_split || "upper_lower",
    };

    const apiKey = process.env.OPEN_ROUTER_KEY;

    if (!apiKey) {
        throw new Error("OPEN_ROUTER_KEY is not set in environment variables");
    }

    const openai = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.BASE_URL || "http://localhost:3001",
            "X-Title": "GymAI Plan Generator",
        },
    });

    //  Build the prompt for the AI model
    const prompt = buildPrompt(normalizedProfile);
}

function buildPrompt(profile: UserProfile): string {
    
}