const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: String,
      required: true,
    },
    tableId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      default: "booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);