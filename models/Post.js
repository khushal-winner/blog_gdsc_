import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, default: "" },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Post || mongoose.model("Post", PostSchema)
