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
    <div>
      <h1>Borrow a Book</h1>
      <input
        type="text"
        placeholder="Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleBorrow}>Borrow Book</button>
    </div>
  );
};

export default BorrowBook;
