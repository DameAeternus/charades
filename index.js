// index.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5050;

// Connect to MongoDB
mongoose.connect('mongodb+srv://dame:dame@cluster0.tf3j4ag.mongodb.net/charadesApp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create a schema for categories
const categorySchema = new mongoose.Schema({
    name: String,
    items: [String],
});

const Category = mongoose.model('Category', categorySchema);

app.use(express.json());
app.use(cors({origin: "*"}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/categories', async (req, res) => {
    const { name, items } = req.body;

    try {
        const newCategory = await Category.create({ name, items });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/categories/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to edit a specific category by ID
app.patch('/categories/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;
    const { name, items } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name, items }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to delete a specific category by ID
app.delete('/categories/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(5050, () => {
    console.log(`Server is running on http://localhost:${5050}`);
});
