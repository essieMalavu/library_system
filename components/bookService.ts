// lib/bookService.ts
import { db } from "@/firebase/firebaseConfig";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface Book {
  id: string;
  title: string;
  author: string;
  borrowed: boolean;
  borrowedBy?: string;
  borrowDate?: string;
}

// Add a book
export async function addBook(book: Book) {
  const bookRef = doc(collection(db, "books"));
  await setDoc(bookRef, { ...book, borrowed: false });
}

// Borrow a book
export async function borrowBook(bookId: string, userId: string) {
  const bookRef = doc(db, "books", bookId);
  const bookSnapshot = await getDoc(bookRef);

  if (bookSnapshot.exists()) {
    const bookData = bookSnapshot.data() as Book;
    if (!bookData.borrowed) {
      await updateDoc(bookRef, {
        borrowed: true,
        borrowedBy: userId,
        borrowDate: new Date().toISOString(),
      });
      return "Book borrowed successfully.";
    } else {
      return "This book is already borrowed.";
    }
  } else {
    return "Book not found.";
  }
}

// Return a book
export async function returnBook(bookId: string) {
  const bookRef = doc(db, "books", bookId);
  const bookSnapshot = await getDoc(bookRef);

  if (bookSnapshot.exists()) {
    const bookData = bookSnapshot.data() as Book;
    if (bookData.borrowed) {
      await updateDoc(bookRef, {
        borrowed: false,
        borrowedBy: null,
        borrowDate: null,
      });
      return "Book returned successfully.";
    } else {
      return "This book is not currently borrowed.";
    }
  } else {
    return "Book not found.";
  }
}
