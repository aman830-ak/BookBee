import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Movie title is required'], 
    trim: true 
  },
  overview: { 
    type: String, 
    required: [true, 'Overview is required'],
    trim: true
  },
  release_date: { 
    type: String 
  },
  // Standardized to 'duration' to match your form, or you can keep 'runtime'
  duration: { 
    type: Number,
    min: [0, 'Duration cannot be negative']
  },
  poster_path: { 
    type: String,
    required: [true, 'Poster image URL is required']
  },
  backdrop_path: { 
    type: String 
  },
  vote_average: { 
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  // Standardized to match the 'genre' field in your Admin form
  genre: { 
    type: String,
    required: [true, 'At least one genre is required']
  },
  // DYNAMIC PRICING: Now part of the schema!
  ticketPrice: { 
    type: Number, 
    required: [true, 'You must set a ticket price'], 
    default: 350,
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
});

// Check if the model exists before creating a new one (prevents errors during hot-reloads)
const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie;