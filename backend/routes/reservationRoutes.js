const express = require("express");
const router = express.Router();

const {
  bookTable,
  getReservations,
} = require("../controllers/reservationController");

// 🍽️ Book table
router.post("/book-table", bookTable);

// 🧑‍💼 Get reservations for admin
router.get("/:restaurantId", getReservations);

module.exports = router;