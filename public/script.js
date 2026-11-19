
const bookList = document.getElementById('bookList');
const bookForm = document.getElementById('bookForm');
const message = document.getElementById('message');

const API_URL = '/books';

// Display response message
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;

    setTimeout(() => {
        message.textContent = '';
        message.className = '';
    }, 3000);
}

// GET - Fetch and display all books
async function fetchBooks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok)
            throw new Error("Failed to fetch books");

        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Display books dynamically
function displayBooks(books) {
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p>No books available.</p>';
        return;
    }

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>Book ID: ${book.id}</p>
            <p>Author: ${book.author}</p>
            <p>Price: ₹${book.price}</p>
            <button class="edit-btn" onclick="editBook(${book.id})">Edit</button>
            <button class="delete-btn" onclick="deleteBook(${book.id})">Delete</button>
        `;

        bookList.appendChild(card);
    });
}

// POST - Add or PUT - Update book
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('bookId').value;

    const book = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        price: Number(document.getElementById('price').value)
    };

    try {
        const response = await fetch(
            id ? `${API_URL}/${id}` : API_URL,
            {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            }
        );

        const data = await response.json();

        if (!response.ok)
            throw new Error(data.message || 'Operation failed');

        showMessage(data.message, 'success');
        resetForm();
        fetchBooks();
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

// GET - Fetch a particular book by ID for editing
async function editBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const book = await response.json();

        if (!response.ok)
            throw new Error(book.message || "Book not found");

        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('price').value = book.price;

        document.getElementById('submitBtn').textContent = 'Update Book';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// DELETE - Delete book
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?'))
        return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok)
            throw new Error(data.message || 'Delete failed');

        showMessage(data.message, 'success');
        fetchBooks();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Reset form
function resetForm() {
    bookForm.reset();
    document.getElementById('bookId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Book';
}

// Load books when webpage opens
fetchBooks();
