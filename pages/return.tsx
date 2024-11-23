import { useState } from "react";
import { returnBook } from "@/components/bookService";

const ReturnBook = () => {
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReturn = async () => {
    if (!bookId.trim()) {
      setMessage("Please enter a valid Book ID.");
      return;
    }

    try {
      setLoading(true);
      const result = await returnBook(bookId);
      setMessage(result); // Display success or failure message
      setBookId(""); // Clear the input field after returning the book
    } catch (error) {
      setMessage("Failed to return the book. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          Return a Book
        </h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Book ID
          </label>
          <input
            type="text"
            placeholder="Enter Book ID"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          onClick={handleReturn}
          disabled={loading}
          className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Return Book"}
        </button>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("Failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReturnBook;
