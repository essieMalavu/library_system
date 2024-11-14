import { useState } from "react";
import { borrowBook } from "@/components/bookService";

const BorrowBook = () => {
  const [bookId, setBookId] = useState("");
  const [userId, setUserId] = useState("");

  const handleBorrow = async () => {
    const result = await borrowBook(bookId, userId);
    alert(result);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Borrow a Book</h1>
        
        <input
          type="text"
          placeholder="Enter Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          className="w-full px-4 py-2 text-black mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-4 text-black py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          onClick={handleBorrow}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
        >
          Borrow Book
        </button>
      </div>
    </div>
  );
};

export default BorrowBook;
