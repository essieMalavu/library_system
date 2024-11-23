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

  // Insights data
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
      image: "/images/return.jpg",
    },
    // {
    //   title: "User Profiles",
    //   description:
    //     "Manage user accounts with detailed borrowing history and account settings.",
    //   image: "/images/user-profiles.jpg",
    // },
  ];

  return (
    <div
      className="flex flex-col items-center opacity-40 justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/books.jpg')" }}
    >
      <h1 className="text-4xl font-bold text-white mb-8 bg-opacity-50 p-4 rounded">
        Welcome to Library System
      </h1>
      <div className="grid grid-cols-1 opacity-70 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="relative group w-80 h-60 bg-gray-100 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
          >
            {/* Insight Background */}
            <div
              className="absolute inset-0 bg-cover bg-center  group-hover:opacity-90 transition-opacity"
              style={{ backgroundImage: `url('${insight.image}')` }}
            ></div>

            {/* Insight Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-all duration-300"></div>

            {/* Insight Content */}
            <div className="relative flex flex-col items-center justify-center h-full p-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-2xl transition-all">
                {insight.title}
              </h3>
              <p className="opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
