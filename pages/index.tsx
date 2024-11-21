import { useState, useEffect } from "react";
import { returnBook } from "@/components/bookService";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

const ReturnBook = () => {
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(true); // For loading state
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if not logged in
        router.push("/login");
      } else {
        setLoading(false); // Set loading to false if user is logged in
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, [router]);

  const handleReturn = async () => {
    try {
      const result = await returnBook(bookId);
      alert(result);
    } catch (error) {
      console.error("Failed to return book:", error);
      alert("Error returning the book. Please try again.");
    }
  };

  if (loading) {
    // Display a loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Return a Book
        </h1>

        <input
          type="text"
          placeholder="Enter Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="w-full px-4 text-black py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleReturn}
          className="w-full py-2 mb-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
        >
          Return Book
        </button>

        <Link href="/borrow" passHref>
          <button className="w-full py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition-colors">
            Go to Borrow Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReturnBook;
