import { useState } from "react";
import { returnBook } from "@/components/bookService";
import Link from "next/link";

const ReturnBook = () => {
  const [bookId, setBookId] = useState("");

  const handleReturn = async () => {
    const result = await returnBook(bookId);
    alert(result);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Return a Book</h1>
        
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
          <button
            className="w-full py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition-colors"
          >
            Go to Borrow Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReturnBook;
