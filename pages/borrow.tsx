import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { FiBookOpen, FiUser, FiEdit3, FiCalendar } from "react-icons/fi";

interface Book {
  id: string;
  title: string;
  author: string;
  borrowed: boolean;
}

interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

const BorrowBook = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookId, setBookId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [borrowReason, setBorrowReason] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const booksCollectionRef = collection(db, "books");
        const querySnapshot = await getDocs(booksCollectionRef);
        console.log("Fetched Books:", querySnapshot.docs.map(doc => doc.data())); // Log the raw data
    
        const booksList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Book[];
    
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

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);

        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];

        setUsers(usersList);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setErrorMessage("Unable to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelection = (id: string) => {
    const selectedUser = users.find((user) => user.id === id);
    if (selectedUser) {
      setUserName(selectedUser.name);
      setUserPhone(selectedUser.phone || "");
      setUserEmail(selectedUser.email || "");
    } else {
      setUserName("");
      setUserPhone("");
      setUserEmail("");
    }
    setUserId(id);
  };

  const handleBorrow = async () => {
    if (!bookId || !userId || !borrowReason || !returnDate) {
      setErrorMessage("Please fill out all required fields.");
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

    setLoading(true);
    try {
      const borrowData = {
        bookId,
        bookTitle: selectedBook.title, // Add book title here
        userId,
        userName,
        userPhone,
        userEmail,
        borrowReason,
        borrowDate: new Date(),
        expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      // Add the borrow record to Firestore
      await addDoc(collection(db, "borrow"), borrowData);

      // Update the book's "borrowed" status
      await updateDoc(doc(db, "books", bookId), { borrowed: true });

      setSuccessMessage(`Successfully borrowed "${selectedBook.title}".`);
      setBookId("");
      setUserId("");
      setBorrowReason("");
      setReturnDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      );
    } catch (error) {
      console.error("Error borrowing book:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-transparent bg-clip-text mb-8">
          Borrow a Book
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-md text-center animate-bounce">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 text-green-600 bg-green-100 rounded-md text-center animate-pulse">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white text-lg animate-spin">
            Loading...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Book Selection */}
            <div className="bg-gray-800 rounded-md p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                <FiBookOpen className="text-green-400" />
                Select a Book
              </h2>
              <select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option
                    key={book.id}
                    value={book.id}
                    disabled={book.borrowed}
                  >
                    {book.title} - {book.author}{" "}
                    {book.borrowed ? "(Unavailable)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Borrower Details */}
            <div className="bg-gray-800 rounded-md p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                <FiUser className="text-blue-400" />
                Borrower Details
              </h2>
              <select
                value={userId}
                onChange={(e) => handleUserSelection(e.target.value)}
                className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value="">Select a User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.id})
                  </option>
                ))}
              </select>
              {userName && (
                <div className="text-green-300 space-y-2">
                  <p><strong>Name:</strong> {userName}</p>
                  <p><strong>Phone:</strong> {userPhone}</p>
                  <p><strong>Email:</strong> {userEmail}</p>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="bg-gray-800 rounded-md p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                <FiEdit3 className="text-purple-400" />
                Additional Details
              </h2>
              <textarea
                placeholder="Reason for borrowing the book"
                value={borrowReason}
                onChange={(e) => setBorrowReason(e.target.value)}
                className="w-full px-4 py-2 text-black rounded-md mb-4 focus:ring-2 focus:ring-purple-500"
              ></textarea>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-yellow-400" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-2 text-black rounded-md focus:ring-2 focus:ring-yellow-500"
                  readOnly
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleBorrow}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-md shadow-lg hover:opacity-80 transition-opacity"
              >
                Borrow Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowBook;
