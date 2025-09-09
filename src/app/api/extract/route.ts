import { Cards, connectDB } from "@/lib";
import { ExtractedData } from "@/types/Image";
import mindee from "mindee";
import { NextRequest, NextResponse } from "next/server";

const modelId = process.env.MINDEE_MODEL_ID || "";
export const mindeeClient = new mindee.ClientV2({
  apiKey: process.env.MINDEE_API_KEY,
});

const inferenceParams = {
  modelId: modelId,
  rag: false,
};

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

      const inputSource = new mindee.BufferInput({
        buffer,
        filename: image.name,
      });

      const res = await mindeeClient.enqueueAndGetInference(
        inputSource,
        inferenceParams
      );

      const cardData = res.getRawHttp();

      const fields = cardData.inference.result.fields;

      const structuredData = {
        id: "",
        companyName: fields.company?.value || "not",
        url: fields.website?.value || "not",
        email: fields.email_address?.value || "not",
        phone: fields.phone_number?.value || "not",
        address: fields.address?.value || "not",
        contactPerson: fields.name?.value || "not",
        designation: fields.job_title?.value || "not",
        rawText: JSON.stringify(cardData),
      };
      console.log("🚀 ~ POST ~ structuredData:", structuredData);

      await connectDB();
      const result = await Cards.insertOne(structuredData);
      console.log("🚀 ~ POST ~ result:", result);

      structuredData.id = result._id.toString();
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
