import { useState, useEffect } from "react";
import { addBook } from "@/components/bookService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface Book {
  id: string;
  title: string;
  author: string;
  borrowed: boolean;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksList = querySnapshot.docs.map((doc) => ({
        Id: doc.id,
        ...(doc.data() as Book),
      }));
      setBooks(booksList);
    };

    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    if (newBook.title && newBook.author) {
      await addBook({ id: "", ...newBook, borrowed: false });
      setNewBook({ title: "", author: "" });
      alert("Book added successfully.");
    }
  };

  return (
    <div>
      <h1>Library Books</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}{" "}
            {book.borrowed ? "(Borrowed)" : "(Available)"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
