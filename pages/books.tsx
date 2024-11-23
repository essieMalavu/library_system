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
        id: doc.id, // Use the `doc.id` as the `id` field.
        ...(doc.data() as Omit<Book, "id">), // Spread only the other properties.
      }));
      setBooks(booksList);
    };

    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    if (newBook.title && newBook.author) {
      await addBook({
        ...newBook, borrowed: false,
        id: ""
      });
      setNewBook({ title: "", author: "" });
      alert("Book added successfully.");

      // Refetch the updated list of books
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Book, "id">),
      }));
      setBooks(booksList);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Library Books
        </h1>

        {/* Add Book Form */}
        <div className="bg-white shadow-md rounded-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add a New Book
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title of the Book"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Author of the Book"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddBook}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Book
          </button>
        </div>

        {/* Book List */}
        <div className="bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Books in the Library
          </h2>
          {books.length > 0 ? (
            <ul className="space-y-4">
              {books.map((book) => (
                <li
                  key={book.id}
                  className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md shadow-sm"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {book.title}
                    </p>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      book.borrowed
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {book.borrowed ? "Borrowed" : "Available"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No books available in the library.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
