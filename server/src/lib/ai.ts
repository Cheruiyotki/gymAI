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
   const goalMap: Record<string, string> = {
    bulk: "build muscle and gain size",
    cut: "lose fat and maintain muscle",
    recomp: "simultaneously lose fat and build muscle",
    strength: "build maximum strength",
    endurance: "improve cardiovascular endurance and stamina",
  };

  const experienceMap: Record<string, string> = {
    beginner: "beginner (0-1 years of training experience)",
    intermediate: "intermediate (1-3 years of training experience)",
    advanced: "advanced (3+ years of training experience)",
  };

  const equipmentMap: Record<string, string> = {
    full_gym: "full gym access with all equipment",
    home: "home gym with limited equipment",
    dumbbells: "only dumbbells available",
  };

  const splitMap: Record<string, string> = {
    full_body: "full body workouts",
    upper_lower: "upper/lower split",
    ppl: "push/pull/legs split",
    custom: "best split for their goals",
  };
}