import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { FaBook, FaClipboardCheck, FaExchangeAlt } from "react-icons/fa";
import { AiOutlineAlipay } from "react-icons/ai";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const insights = [
    {
      icon: <FaBook size={24} className="text-purple-400" />,
      title: "Manage Books",
      description:
        "Easily add, update, and organize your book collection for seamless management.",
    },
    {
      icon: <FaClipboardCheck size={24} className="text-blue-400" />,
      title: "Borrow a Book",
      description:
        "Enable users to borrow books effortlessly with real-time tracking and history.",
    },
    {
      icon: <FaExchangeAlt size={24} className="text-pink-400" />,
      title: "Return a Book",
      description:
        "Simplify the return process with automated updates and notifications.",
    },
  ];

  const libraryContent = [
    {
      icon: <AiOutlineAlipay size={32} className="text-green-400" />,
      title: "Welcome to Our Library",
      description:
        "Explore a vast collection of books and resources curated just for you.",
    },
    {
      icon: <FaBook size={28} className="text-yellow-400" />,
      title: "Curated Recommendations",
      description:
        "Discover top picks based on your preferences and reading history.",
    },
    {
      icon: <FaClipboardCheck size={28} className="text-blue-400" />,
      title: "Track Borrowed Books",
      description:
        "Keep track of all the books you’ve borrowed with an intuitive dashboard.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="py-6 bg-opacity-70 backdrop-blur-md">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
          Bura Library System
        </h1>
      </header>
      <div className="flex flex-grow">
        {/* Left Sidebar */}
        <aside className="w-1/4 bg-gradient-to-b from-gray-800 to-black p-6 space-y-8 border-r border-gray-700 hidden md:block">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Library Content
          </h2>
          <ul className="space-y-6">
            {libraryContent.map((content, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 bg-gray-700 p-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-transform"
              >
                <div className="flex-shrink-0">{content.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    {content.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{content.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center py-12 px-6">
          <div className="max-w-4xl text-center mb-12">
            <p className="text-lg text-gray-400">
              A modern, seamless platform for managing your library needs.
            </p>
          </div>
          <div className="space-y-8 w-full max-w-lg">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 rounded-xl shadow-lg bg-opacity-80 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 backdrop-blur-md hover:scale-105 transition-transform duration-300"
              >
                <div className="flex-shrink-0">{insight.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    {insight.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <footer className="bg-opacity-70 backdrop-blur-md py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Bura Library System. All rights
            reserved.
          </p>
          <ul className="flex space-x-4 mt-2 md:mt-0 text-gray-400">
            <li>
              <a href="/about" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white transition">
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
