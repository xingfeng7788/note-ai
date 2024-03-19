import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { getRandomElement } from "@/lib/utils";
import { Account_Plans } from "../../../../lib/consts";

const api_key = process.env.OPENAI_API_KEY || "";
const api_keys = process.env.OPENAI_API_KEYs || "";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_PROXY || "https://api.openai.com",
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  try {
    // Check if the OPENAI_API_KEY is set, if not return 400
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
      return new Response(
        "Missing OPENAI_API_KEY – make sure to add it to your .env file.",
        {
          status: 400,
        },
      );
    }

    const { prompt, plan } = await req.json();

    const planN = Number(plan || "5");

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const ip = req.headers.get("x-forwarded-for");
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(
          Account_Plans[planN].ai_generate_day,
          "1 d",
        ),
      });

      // console.log("plan", planN, Account_Plans[planN], ip);

      const { success, limit, reset, remaining } = await ratelimit.limit(
        `novel_ratelimit_${ip}`,
      );

      if (!success) {
        return new Response(
          "You have reached your request limit for the day.",
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          },
        );
      }
    }

    openai.apiKey = getRandomElement(api_keys.split(",")) || api_key;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "system",
          content: `I hope you can take on roles such as spell proofreading and rhetorical improvement, 
           or other roles related to text editing, optimization, and abbreviation. I will 
           communicate with you in any language, and you will recognize the language. Please only answer the corrected and improved parts, and 
           do not write explanations.
           Limit your response to no more than ${Account_Plans[planN].ai_generate_chars} characters, 
           but make sure to construct complete sentences.`,
          // "Use Markdown formatting when appropriate.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    return new Response("Server error", {
      status: 500,
    });
  }
}
