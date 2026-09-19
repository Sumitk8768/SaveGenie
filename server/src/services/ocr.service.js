import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const extractCouponFromImage = async (imageUrl) => {

  if (process.env.OCR_PROVIDER === "mock") {
  return {
    code: "MOCK20",
    merchantName: "Mock Store",
    discountType: "percentage",
    discountValue: 20,
    expiryDate: "2027-12-31",
    description: "Mock coupon for testing",
    category: "electronics",
  };
}

  const prompt = `
    You are a coupon extraction assistant.
    
    Analyze this screenshot and extract coupon/offer details.
    
    Return ONLY a valid JSON object with these exact fields:
    {
      "code": "coupon code if visible, else null",
      "merchantName": "name of the brand or merchant",
      "discountType": "percentage or flat",
      "discountValue": numeric value only,
      "expiryDate": "YYYY-MM-DD format if visible, else null",
      "description": "brief description of the offer",
      "category": "food or fashion or electronics or travel or entertainment or grocery or other"
    }
    
    Rules:
    - discountValue must be a number, never a string
    - discountType must be exactly "percentage" or "flat"
    - If no expiry date is visible, return null for expiryDate
    - If no coupon code is visible, return null for code
    - Never return anything outside the JSON object
    - Never add markdown formatting or backticks
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "high",
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content?.trim();

  if (!raw) {
    throw new Error("OpenAI returned an empty OCR response");
  }

  // Keep this fallback for responses returned by compatible providers/models
  // that still wrap JSON in Markdown code fences.
  const jsonText = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(jsonText);

  return parsed;
};
