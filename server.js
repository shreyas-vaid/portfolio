const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/moviesDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ======================
   Movie Schema & Model
====================== */
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    genre: {
        type: String
    }
});

const Movie = mongoose.model("Movie", movieSchema);

/* ======================
   Routes
====================== */

// ➕ Add a Movie
app.post("/add", async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.json({ message: "Movie added", movie });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📄 Get All Movies
app.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✏️ Update Rating
app.put("/update/:id", async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { rating: req.body.rating },
            { new: true }
        );

        res.json({ message: "Rating updated", movie });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ======================
   Server
====================== */
app.listen(3000, () => {
    console.log("Server running on port 3000");
});