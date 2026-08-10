import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    section: {
      type:     String,
      required: true,
      unique:   true,
      enum:     ["nav","hero","about","whyUs","mission","philosophy","problem","services","technology","serve","partners","clients","market","team","contact","footer"],
    },
    en:     { type: mongoose.Schema.Types.Mixed, required: true },
    ar:     { type: mongoose.Schema.Types.Mixed, required: true },
    images: [
      {
        url:      { type: String },
        publicId: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", ContentSchema);
export default Content;
