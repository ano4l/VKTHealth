import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

router.post("/scan-meal", async (req, res) => {
  const { image } = req.body as { image?: string };

  if (!image || typeof image !== "string") {
    res.status(400).json({ error: "image (base64 data URL) is required" });
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 1024,
      messages: [
        {
          role: "system",
          content:
            "You are a nutrition analysis assistant. When given a food photo, identify all visible food items and estimate their nutritional content. Respond ONLY with valid JSON — no markdown, no prose.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: image },
            },
            {
              type: "text",
              text: `Identify the food items visible in this photo and estimate their nutritional content.
Return a JSON object in this exact format:
{
  "items": [
    {
      "name": "Food name",
      "serving": "estimated portion (e.g. 1 cup, 200g)",
      "calories": 250,
      "protein": 12.5,
      "carbs": 30.0,
      "fat": 8.0
    }
  ],
  "totalCalories": 250,
  "confidence": "high|medium|low",
  "notes": "any brief notes about the analysis"
}
All numeric values must be numbers (not strings). If you cannot identify any food, return items: [].`,
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "scan-meal error");
    res.status(500).json({ error: "Failed to analyse image. Please try again." });
  }
});

export default router;
