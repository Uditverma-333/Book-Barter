const Book = require("./book.model");
const upload = require('../config/multer');

// Search for books
const searchBooks = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send({ message: "Search query is required" });
    }

    try {
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        });
        res.status(200).send(books);
    } catch (error) {
        console.error("Error searching for books", error);
        res.status(500).send({ message: "Failed to search for books" });
    }
};

// Post a new book
const postABook = async (req, res) => {
    try {
        // Handle file upload
        upload.single('coverImage')(req, res, async (err) => {
            if (err) {
                return res.status(500).send({ message: 'File upload failed', error: err });
            }

            // The Cloudinary image URL will be available in req.file.path after successful upload
            const coverImageUrl = req.file ? req.file.path : '';

            // Ensure the necessary fields are in req.body and add the coverImageUrl
            const { title, description, category, trending, oldPrice, newPrice } = req.body;

            // Create a new book with the provided data and image URL
            const newBook = new Book({
                title,
                description,
                category,
                trending,
                oldPrice,
                newPrice,
                coverImage: coverImageUrl, // Use the image URL from Cloudinary
            });

            // Save the new book to the database
            await newBook.save();

            // Send a success response
            res.status(200).send({ message: 'Book posted successfully', book: newBook });
        });
    } catch (error) {
        console.error('Error creating book', error);
        res.status(500).send({ message: 'Failed to create book', error });
    }
};

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).send(books);
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({ message: "Failed to fetch books" });
    }
};

// Get a single book
const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({ message: "Book not found!" });
        }
        res.status(200).send(book);
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({ message: "Failed to fetch book" });
    }
};

// Update book data
const UpdateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).send({ message: "Book not found!" });
        }
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook
        });
    } catch (error) {
        console.error("Error updating book", error);
        res.status(500).send({ message: "Failed to update book" });
    }
};

// Delete a book
const deleteABook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send({ message: "Book not found!" });
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        });
    } catch (error) {
        console.error("Error deleting book", error);
        res.status(500).send({ message: "Failed to delete book" });
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook,
    searchBooks
};
