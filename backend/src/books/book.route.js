const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook, searchBooks } = require('./book.controller');
const {verifyAdminToken, verifyToken} = require('../middleware/verifyAdminToken');
const router =  express.Router();
const upload = require('../config/multer'); // Adjust path as needed


// frontend => backend server => controller => book schema  => database => send to server => back to the frontend
//post = when submit something fronted to db
// get =  when get something back from db
// put/patch = when edit or update something
// delete = when delete something

//search a book
router.get("/search", searchBooks);

// Admin route: Post a book with admin verification
router.post("/create-book", verifyAdminToken, upload.single('bookImage'), postABook);

// User route: Post a book without admin verification
router.post('/add', verifyToken, upload.single('bookImage'), postABook);

// get all books
router.get("/", getAllBooks);

// single book endpoint
router.get("/:id", getSingleBook);

// update a book endpoint
router.put("/edit/:id", verifyAdminToken, UpdateBook);

router.delete("/:id", verifyAdminToken, deleteABook)


module.exports = router;
