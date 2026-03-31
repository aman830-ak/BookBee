import express from 'express';
import cors from 'cors';
import 'dotenv/config';
//import connectDB from './config/db.js';
import Movie from './models/movieModel.js'; 
import moviesData from './data/movies.js'; 
import Booking from './models/bookingModel.js';
import Theater from './models/theaterModel.js';
import Promo from './models/promoModel.js';

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/seed', async (req, res) => {
  try {
    await Movie.deleteMany();  
    const createdMovies = await Movie.insertMany(moviesData); 
    res.status(201).json({ 
        message: "Movies Imported Successfully! 🍿", 
        totalMovies: createdMovies.length,
        data: createdMovies 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to import data", error: error.message });
  }
});

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find({}); 
    res.status(200).json(movies); 
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies", error: error.message });
  }
});


app.post('/api/bookings', async (req, res) => {
  try {
  
    const { movie, seats, totalPrice, userId } = req.body;

    const newBooking = await Booking.create({
      movie,
      seats,
      totalPrice,
      userId 
    });

    res.status(201).json({ message: "Booking successful! 🎉", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
}); 


app.get('/api/bookings', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {}; 
    
    const bookings = await Booking.find(query).populate('movie').sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const { title, overview, poster_path, backdrop_path, genre, duration, release_date, ticketPrice } = req.body;

    const newMovie = await Movie.create({
      title, overview, poster_path, backdrop_path, genre, duration, release_date, 
      ticketPrice: Number(ticketPrice) // Ensure it's a number
    });

    res.status(201).json({ message: "Movie added successfully! 🎬", movie: newMovie });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ message: "Failed to add movie", error: error.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id); 
    
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    
    res.status(200).json(movie); 
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movie", error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send("BookBee Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    
    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    
    res.status(200).json({ message: "Movie deleted from BookBee! 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete movie", error: error.message });
  }
});

// --- GET CURRENT LAYOUT ---
app.get('/api/theater-settings', async (req, res) => {
  try {
    let settings = await Theater.findOne();
    // If no settings exist yet, create default ones
    if (!settings) {
      settings = await Theater.create({ rowCount: 6, seatsPerRow: 8 });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- UPDATE LAYOUT ---
app.put('/api/theater-settings', async (req, res) => {
  try {
    const { rowCount, seatsPerRow } = req.body;
    const settings = await Theater.findOneAndUpdate(
      {}, 
      { rowCount, seatsPerRow }, 
      { new: true, upsert: true }
    );
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- GET ALL OCCUPIED SEATS FOR A SPECIFIC MOVIE ---
app.get('/api/bookings/occupied/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const bookings = await Booking.find({ movie: movieId });
    const occupiedSeats = bookings.reduce((acc, booking) => {
      return acc.concat(booking.seats);
    }, []);

    res.status(200).json(occupiedSeats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching occupied seats", error: error.message });
  }
});



// --- CANCEL A BOOKING (USER FEATURE) ---
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Ticket cancelled successfully! 💸" });
  } catch (error) {
    console.error("Cancellation error:", error);
    res.status(500).json({ message: "Failed to cancel ticket", error: error.message });
  }
});

// --- VALIDATE PROMO CODE ---
app.post('/api/promos/validate', async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await Promo.findOne({ code: code.toUpperCase(), isActive: true });

    if (!promo) {
      return res.status(404).json({ message: "Invalid or expired code ❌" });
    }

    res.status(200).json({ 
      message: "Promo applied! 🎉", 
      discountPercent: promo.discountPercent 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});