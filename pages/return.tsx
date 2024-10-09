import { useState } from "react";
import { returnBook } from "@/components/bookService";

const ReturnBook = () => {
  const [bookId, setBookId] = useState("");

  const handleReturn = async () => {
    const result = await returnBook(bookId);
    alert(result);
  };

  return (
    <div>
      <h1>Return a Book</h1>
      <input
        type="text"
        placeholder="Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <button onClick={handleReturn}>Return Book</button>
    </div>
  );
};

export default ReturnBook;
