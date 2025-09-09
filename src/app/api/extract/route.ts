import { Cards, connectDB } from "@/lib";
import { ExtractedData } from "@/types/Image";
// import { createGateway } from "@ai-sdk/gateway";
import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

// export const gateway = createGateway({
//   apiKey: process.env.AI_GATEWAY_API_KEY,
// });

export const xai = createXai({
  apiKey: process.env.GROK_API_KEY,
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

  try {
    for (const image of images) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { text } = await generateText({
        model: xai("grok-3"),
        messages: [
          {
            role: "user",
            content: [{ type: "image", image: buffer, mediaType: image.type }],
          },
        ],
      });

      let structuredData;
      try {
        structuredData = {
          companyName: "",
          logo: "",
          url: "",
          email: "",
          phone: "",
          address: "",
          contactPerson: "",
          designation: "",
          confidence: 0,
          rawText: text,
          ...JSON.parse(text),
        };
      } catch (error) {
        console.log("🚀 ~ POST ~ error:", error);

        structuredData = {
          companyName: "",
          logo: "",
          url: "",
          email: "",
          phone: "",
          address: "",
          contactPerson: "",
          designation: "",
          confidence: 0,
          rawText: text,
        };
      }

      extractedData.push(structuredData);
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      processedCount: extractedData.length,
      message: "Extraction successful",
    });
  } catch (error) {
    const err = error as Error;
    console.log("🚀 ~ POST ~ err:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "An unknown error occurred",
        // body: err.response?.data,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  const data = await Cards.find();

  return NextResponse.json({ success: true, cards: data });
}
