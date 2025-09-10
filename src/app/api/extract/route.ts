import { Cards, connectDB } from "@/lib";
import { ExtractedData } from "@/types/Image";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const prompt = `Extract structured company data from the text and return a JSON object with the following fields:
- companyName
- url
- email
- phone
- address
- contactPerson
- designation
- rawText (include any other relevant information)

Rules:
1. All values must be strings.
2. If any field contains multiple values (e.g., phone numbers, emails) return them as a single string, joined with commas.
3. Do not include arrays or nested objects.
4. If a field is missing, use an empty string ("").
5. Return valid JSON only, with no additional text, explanation, or markdown formatting.
`;

export const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const images = formData.getAll("images") as File[];

  if (images.length === 0) {
    return NextResponse.json(
      { success: false, message: "No images provided in the request" },
      { status: 400 }
    );
  }

  const extractedData: ExtractedData[] = [];
  let allCard: ExtractedData[] = [];

  try {
    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image",
                image: buffer,
                mediaType: image.type,
              },
            ],
          },
        ],
      });
      let structuredData;
      try {
        const cleanedText = text
          .replace(/```json\s*([\s\S]*?)```/, "$1")
          .trim();

        structuredData = JSON.parse(cleanedText);

        for (const key in structuredData) {
          if (Array.isArray(structuredData[key])) {
            structuredData[key] = structuredData[key].join(", ");
          }
        }

        await connectDB();
        const result = await Cards.insertOne(structuredData);
        allCard = await Cards.find().sort({ createdAt: -1 });

        structuredData.id = result._id.toString();
      } catch (parseError) {
        structuredData = {
          companyName: "Parsing failed",
          id: "null",
          url: "Parsing failed",
          email: "Parsing failed",
          phone: "Parsing failed",
          address: "Parsing failed",
          contactPerson: "Parsing failed",
          designation: "Parsing failed",
          rawText: text,
        };

        return NextResponse.json({
          success: false,
          data: structuredData,
          processedCount: extractedData.length,
          message: "Parsing failed",
        });
      }
      extractedData.push(structuredData);
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      allCard,
      processedCount: extractedData.length,
      message: "Extraction successful",
    });
  } catch (error) {
    const err = error as Error;

    return NextResponse.json(
      {
        success: false,
        message: err.message || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  const data = await Cards.find().sort({ createdAt: -1 });

  return NextResponse.json({ success: true, cards: data });
}
