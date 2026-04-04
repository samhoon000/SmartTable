const Reservation = require("../models/Reservation");

// ✅ Create booking
exports.bookTable = async (req, res) => {
  try {
    const {
      restaurantId,
      tableId,
      userName,
      userEmail,
      date,
      startTime,
      endTime,
      guests,
      totalPrice,
    } = req.body;

    // 🔒 Check overlap
    const existing = await Reservation.findOne({
      tableId,
      date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Table already booked" });
    }

    const reservation = new Reservation({
      restaurantId,
      tableId,
      userName,
      userEmail,
      date,
      startTime,
      endTime,
      guests,
      totalPrice,
    });

    await reservation.save();

    res.status(201).json({
      message: "Booking successful",
      reservation,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all bookings for a restaurant (admin)
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      restaurantId: req.params.restaurantId,
    });

    res.json(reservations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};