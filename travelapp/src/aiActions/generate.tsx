import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_AI_KEY || "");

export async function runActivities(location: string) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt =
    "I want to go to '" +
    location +
    "'. What activities should i do there? Dispalay the result as JSON like this structure: {activity_name: string; activity_location: string; activity_lat: number; activity_long: number; price: string;}[]";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}

export async function runTransport(location: string) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt =
    "I want to go to '" +
    location +
    "'. What transport methods are available there? Dispalay the result as JSON like this structure: {transport_method: string; transport_description: string; price: string;}[]";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}

export async function runHotels(location: string) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt =
    "I want to go to '" +
    location +
    "'. At what hotel should i stay? Display the output as JSON like this: {hotel_name: string; price: string; location: string; long: number; lat: number}[].";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}
