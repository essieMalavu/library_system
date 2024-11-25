import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface Book {
  id: string;
  title: string;
  author: string;
  borrowed: boolean;
}

const BorrowBook = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookId, setBookId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const booksCollectionRef = collection(db, "books"); // Reference the "books" collection
        const querySnapshot = await getDocs(booksCollectionRef); // Get the query snapshot
  
        const booksList = querySnapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            ...data,
            id: doc.id, // Add the document ID explicitly
          };
        });
  
        setBooks(booksList);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setErrorMessage("Unable to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, []);

  const validateUser = async (id: string): Promise<boolean> => {
    try {
      const userDoc = await getDoc(doc(db, "users", id));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name); // Set the user's name
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error validating user:", error);
      return false;
    }
  };

  const handleBorrow = async () => {
    if (!bookId || !userId) {
      setErrorMessage("Please select a book and enter a valid user ID.");
      return;
    }

    const selectedBook = books.find((book) => book.id === bookId);
    if (!selectedBook) {
      setErrorMessage("Invalid book selected. Please try again.");
      return;
    }

    if (selectedBook.borrowed) {
      setErrorMessage("This book is already borrowed.");
      return;
    }

    const isValidUser = await validateUser(userId);
    if (!isValidUser) {
      setErrorMessage("Invalid User ID. Please check and try again.");
      return;
    }

    setLoading(true);
    try {
      // Add borrow entry
      const borrowData = {
        bookId,
        userId,
        userName,
        borrowDate: new Date(),
        expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks later
      };
      await addDoc(collection(db, "borrow"), borrowData);

      // Update book status
      await updateDoc(doc(db, "books", bookId), { borrowed: true });

      setSuccessMessage(`Successfully borrowed "${selectedBook.title}".`);
      setBookId("");
      setUserId("");
      setUserName(""); // Clear the user name
    } catch (error) {
      console.error("Error borrowing book:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Borrow a Book
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 text-red-600 bg-red-100 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 text-green-600 bg-green-100 rounded-md text-center">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {/* Book Selection */}
            <div className="bg-white shadow-md rounded-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select a Book
              </h2>
              <select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id} disabled={book.borrowed}>
                    {book.title} - {book.author} {book.borrowed ? "(Unavailable)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* User Input */}
            <div className="bg-white shadow-md rounded-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Enter User ID
              </h2>
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 text-black mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {userName && (
                <p className="text-green-600 mt-2">
                  User Name: <strong>{userName}</strong>
                </p>
              )}
            </div>

            {/* Borrow Button */}
            <div className="text-center">
              <button
                onClick={handleBorrow}
                className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading ? "Processing..." : "Borrow Book"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BorrowBook;
