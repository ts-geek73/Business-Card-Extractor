import { ExtractedData } from "@/types/Image";
import { Schema, model, models } from "mongoose";

const CardSchema = new Schema<ExtractedData>(
  {
    companyName: { type: String, required: true },
    logo: { type: String, required: true },
    url: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    designation: { type: String, required: true },
    confidence: { type: Number, required: true },
    rawText: { type: String }, // Optional field
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Cards = models.ExtractedData || model("Cards", CardSchema);

export default Cards;
