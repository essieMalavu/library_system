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
    <div>
      <h1>Return a Book</h1>
      <input
        type="text"
        placeholder="Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <button onClick={handleReturn}>Return Book</button>
      <div>
          <Link href="/borrow" passHref>
            <button style={{ marginTop: "10px" }}>Go to Borrow Page</button>
          </Link>
      </div>
      
    </div>
  );
};

export default ReturnBook;
