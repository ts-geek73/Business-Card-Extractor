import { ExtractedData } from "@/types/Image";
import { Schema, model, models } from "mongoose";

const CardSchema = new Schema<ExtractedData>(
  {
    companyName: { type: String },
    url: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    contactPerson: { type: String },
    designation: { type: String },
    rawText: { type: String },
  },
  {
    timestamps: true,
  }
);

const Cards = models.Cards || model("Cards", CardSchema);

export default Cards;
