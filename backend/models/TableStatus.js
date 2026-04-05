const mongoose = require("mongoose");

const tableStatusSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      required: true,
    },
    tableId: {
      type: String,
      required: true,
    },
    isManualReserved: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TableStatus", tableStatusSchema);
