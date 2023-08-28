const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/movie-recommendation', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const Movie = mongoose.model('Movie', {
  title: String,
  genre: String,
  year: Number,
  backdrop_path: String,
  genre_ids: [Number],
  original_language: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
});


// API Endpoints
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
  } catch (error) {
    res.status(404).json({ error: 'Movie not found.' });
  }
});




app.get('/api/search', async (req, res) => {
  try {
      const searchTerm = req.query.query; // Get the search query from query parameters
      console.log("searchTerm:  ",searchTerm)
      const movies = await Movie.find({ title: { $regex: searchTerm, $options: 'i' } });
      res.status(200).json(movies);
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while searching for movies.' });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const movieData = req.body;
    const movie = new Movie(movieData);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data.' });
  }
});

app.put('/api/movies/:id', async (req, res) => {

  try {
    const updatedMovieData = req.body;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      updatedMovieData,
      { new: true }
    );
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found.' });
    }
  } catch (error) {
    res.status(404).json({ error: 'Movie not found.' });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    await Movie.findByIdAndRemove(req.params.id);
    res.json({ message: 'Movie deleted.' });
  } catch (error) {
    res.status(404).json({ error: 'Movie not found.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
