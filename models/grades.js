const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    grade: {
      type: String,
      required: true,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Grade || mongoose.model("Grade", gradeSchema);
