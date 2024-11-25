import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  const insights = [
    {
      title: "Manage Books",
      description:
        "Easily add, update, and organize your book collection for seamless management.",
      image: "/images/manage-books.jpg",
    },
    {
      title: "Borrow a Book",
      description:
        "Enable users to borrow books effortlessly with real-time tracking and history.",
      image: "/images/borrow-books.jpg",
    },
    {
      title: "Return a Book",
      description:
        "Simplify the return process with automated updates and notifications.",
      image: "/images/return-books.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/books.jpg')" }}
      >
        <h1 className="text-4xl font-bold text-white mb-8 bg-opacity-50 p-4 rounded">
          Welcome to Bura Library System
        </h1>
        <div className="grid grid-cols-1 opacity-70 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="relative group w-80 h-60 bg-gray-100 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:opacity-90 transition-opacity"
                style={{ backgroundImage: `url('${insight.image}')` }}
              ></div>
              <div className="absolute inset-0 group-hover:bg-opacity-70 transition-all duration-300"></div>
              <div className="relative flex flex-col items-center justify-center h-full p-4 text-black text-center">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-2xl transition-all">
                  {insight.title}
                </h3>
                <p className="group-hover:opacity-100 transition-opacity text-sm">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Bura Library System. All rights reserved.</p>
          <ul className="flex space-x-4 mt-2 md:mt-0">
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
