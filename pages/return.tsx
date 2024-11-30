import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { FiLoader, FiBookOpen, FiUser, FiCalendar, FiXCircle } from "react-icons/fi";

interface BorrowedBook {
  id: string; // Firestore document ID
  bookId: string; // Book's unique ID
  userId: string; // User's unique ID
  userName: string; // Name of the borrower
  bookTitle: string; // Title of the borrowed book
  borrowDate: string | Date; // Date of borrowing
  expectedReturnDate: string | Date; // Expected return date
}

const ManageBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch borrowed books
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      setLoading(true);
      try {
        const borrowCollectionRef = collection(db, "borrow");
        const querySnapshot = await getDocs(borrowCollectionRef);

        const borrowedBooksList: BorrowedBook[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            bookId: data.bookId ?? "",
            userId: data.userId ?? "",
            userName: data.userName ?? "Unknown User",
            bookTitle: data.bookTitle ?? "Unknown Title",
            borrowDate: data.borrowDate?.toDate?.() ?? new Date(data.borrowDate),
            expectedReturnDate:
              data.expectedReturnDate?.toDate?.() ?? new Date(data.expectedReturnDate),
          };
        });

        setBorrowedBooks(borrowedBooksList);
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to fetch borrowed books:", error);
        setErrorMessage("Unable to load borrowed books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleReturnBook = async (borrowId: string, bookId: string) => {
    setLoading(true);
    try {
      // Remove the borrow entry
      await deleteDoc(doc(db, "borrow", borrowId));

      // Update book availability
      await updateDoc(doc(db, "books", bookId), { borrowed: false });

      // Update the borrowed books list in UI
      setBorrowedBooks((prev) =>
        prev.filter((borrowedBook) => borrowedBook.id !== borrowId)
      );

      setErrorMessage("");
    } catch (error) {
      console.error("Error returning book:", error);
      setErrorMessage("Failed to return the book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-gray-900 to-black text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-12">
          Manage Borrowed Books
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 text-red-500 bg-opacity-20 bg-red-800 rounded-md text-center">
            <FiXCircle className="inline-block mr-2" /> {errorMessage}
          </div>
        )}

        {loading && (
          <div className="text-center mb-6">
            <FiLoader className="inline-block text-4xl animate-spin text-purple-500" />
            <p className="mt-2 text-gray-400">Loading borrowed books...</p>
          </div>
        )}

        {!loading && borrowedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowedBooks.map((borrowedBook) => (
              <div
                key={borrowedBook.id}
                className="backdrop-blur-sm bg-opacity-20 bg-white p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
              >
                <h2 className="text-2xl font-semibold text-purple-400 mb-2">
                  {borrowedBook.bookTitle}
                </h2>
                <p className="text-gray-300 mb-2 flex items-center gap-2">
                  <FiUser /> Borrower: {borrowedBook.userName}
                </p>
                <p className="text-gray-300 mb-2 flex items-center gap-2">
                  <FiCalendar /> Borrow Date:{" "}
                  {new Date(borrowedBook.borrowDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-300 mb-2 flex items-center gap-2">
                  <FiCalendar /> Expected Return Date:{" "}
                  {new Date(borrowedBook.expectedReturnDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <button
                  onClick={() =>
                    handleReturnBook(borrowedBook.id, borrowedBook.bookId)
                  }
                  className="w-full px-4 py-2 text-white font-medium rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                  disabled={loading}
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-400">
              No borrowed books found. Great job keeping the shelves tidy!
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default ManageBooks;
