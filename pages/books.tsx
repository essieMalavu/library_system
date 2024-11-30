import { useState, useEffect } from "react";
import { addBook } from "@/components/bookService";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { FiPlusCircle, FiBook, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface Book {
  id: string;
  title: string;
  author: string;
  borrowed: boolean;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });

  // Fetch books in real time
  useEffect(() => {
    const booksCollectionRef = collection(db, "books");
    const booksQuery = query(booksCollectionRef);

    const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
      const booksList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Book, "id">),
      }));
      setBooks(booksList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddBook = async () => {
    if (newBook.title && newBook.author) {
      await addBook({
        ...newBook,
        borrowed: false,
        id: "",
      });
      setNewBook({ title: "", author: "" });
      alert("Book added successfully.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          📚 Library Books
        </h1>

        {/* Add Book Form */}
        <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-8 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
            <FiPlusCircle className="text-gray-600" />
            Add a New Book
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Book Title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
              className="w-full px-4 py-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
            />
            <input
              type="text"
              placeholder="Author Name"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
              className="w-full px-4 py-3 text-gray-800 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-sm"
            />
          </div>
          <button
            onClick={handleAddBook}
            className="mt-6 w-full sm:w-auto bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-700 hover:scale-105 transform transition-transform"
          >
            Add Book
          </button>
        </div>

        {/* Book List */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiBook className="text-gray-600" />
            Available Books
          </h2>
          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="relative bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg hover:scale-105 transform transition-all"
                >
                  {/* Book Title */}
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {book.title}
                  </h3>

                  {/* Author */}
                  <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Author:</span> {book.author}
                  </p>

                  {/* Status */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {book.borrowed ? (
                      <FiXCircle className="text-red-500" size={20} />
                    ) : (
                      <FiCheckCircle className="text-green-500" size={20} />
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        book.borrowed
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {book.borrowed ? "Borrowed" : "Available"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center text-lg mt-6">
              No books available in the library. 📖
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Books;
