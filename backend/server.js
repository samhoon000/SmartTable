const express = require('express')
const Razorpay = require('razorpay')
const cors = require('cors')
const mongoose = require("mongoose")
require("dotenv").config()

const Reservation = require("./models/Reservation")
const TableStatus = require("./models/TableStatus")

const app = express()
app.use(cors())
app.use(express.json())

// 🔗 Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    console.log("Connected to DB:", mongoose.connection.name);
  })
  .catch(err => console.log(err));

// Razorpay setup
const razorpay = new Razorpay({
  key_id: "rzp_test_YOUR_KEY_ID",
  key_secret: "YOUR_SECRET",
})

// 💳 PAYMENT ROUTE
app.post('/create-order', async (req, res) => {
  const { amount } = req.body

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    })

    res.json(order)
  } catch (err) {
    console.log(err)
    res.status(500).send("Error creating order")
  }
})

// 🍽️ BOOK TABLE
app.post("/api/reservations/book-table", async (req, res) => {
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
    } = req.body

    const existing = await Reservation.findOne({
      tableId,
      date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    })

    if (existing) {
      return res.status(400).json({ message: "Table already booked" })
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
    })

    await reservation.save()

    console.log("Saved to DB:", reservation);

    res.status(201).json({ message: "Booking successful", reservation })

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message })
  }
})

// 🧑‍💼 GET BOOKINGS
app.get("/api/reservations/:restaurantId", async (req, res) => {
  try {
    const reservations = await Reservation.find({
      restaurantId: req.params.restaurantId,
    })
    res.json(reservations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 🗑️ DELETE BOOKING
app.delete("/api/reservations/:id", async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 🔧 GET TABLE STATUS
app.get("/api/table-status/:restaurantId", async (req, res) => {
  try {
    const statuses = await TableStatus.find({
      restaurantId: req.params.restaurantId,
    })
    res.json(statuses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 🔧 SET TABLE STATUS
app.post("/api/table-status", async (req, res) => {
  try {
    const { restaurantId, tableId, isManualReserved, displayName } = req.body
    
    const updatePayload = {}
    if (isManualReserved !== undefined) updatePayload.isManualReserved = isManualReserved
    if (displayName !== undefined) updatePayload.displayName = displayName

    await TableStatus.findOneAndUpdate(
      { restaurantId, tableId },
      { $set: updatePayload },
      { upsert: true, new: true }
    )
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// 🚀 Start server
app.listen(5000, () => console.log("Server running on port 5000"))