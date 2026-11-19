
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let books = [
  { id: 1, title: "Java Programming", author: "James Gosling", price: 450 },
  { id: 2, title: "Web Development", author: "Jon Duckett", price: 550 },
  { id: 3, title: "Python Basics", author: "Mark Lutz", price: 400 }
];

let nextId = 4;

// GET - Retrieve all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET - Retrieve a book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));

  if (!book)
    return res.status(404).json({ message: "Book not found" });

  res.json(book);
});

// POST - Add a new book
app.post('/books', (req, res) => {
  const { title, author, price } = req.body;

  if (!title || !author || price === undefined || price <= 0) {
    return res.status(400).json({ message: "Invalid book details" });
  }

  const newBook = {
    id: nextId++,
    title,
    author,
    price: Number(price)
  };

  books.push(newBook);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook
  });
});

// PUT - Update book details
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);

  if (!book)
    return res.status(404).json({ message: "Book not found" });

  const { title, author, price } = req.body;

  if (!title || !author || price === undefined || price <= 0) {
    return res.status(400).json({ message: "Invalid book details" });
  }

  book.title = title;
  book.author = author;
  book.price = Number(price);

  res.json({ message: "Book updated successfully", book });
});

// DELETE - Delete a book
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);

  if (index === -1)
    return res.status(404).json({ message: "Book not found" });

  books.splice(index, 1);

  res.json({ message: "Book deleted successfully" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
