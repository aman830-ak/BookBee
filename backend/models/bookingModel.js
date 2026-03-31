import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // NEW: Store the unique Clerk User ID
    userId: {
      type: String,
      required: true,
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    seats: [
      {
        type: String,
        required: true,
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
