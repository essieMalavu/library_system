import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect to dashboard on success
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Overlay */}
      <div className="absolute inset-0">
        <div className="absolute bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl h-96 w-96 rounded-full animate-pulse top-20 left-20"></div>
        <div className="absolute bg-gradient-to-br from-green-400 to-blue-600 opacity-20 blur-3xl h-96 w-96 rounded-full animate-pulse bottom-20 right-20"></div>
      </div>

      {/* Glassmorphism Login Container */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/20">
        <h1 className="text-3xl font-extrabold text-center text-white mb-6">
          Welcome to <span className="text-indigo-400">Bura Library</span>
        </h1>
        {error && (
          <p className="text-sm text-red-400 mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full mt-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full mt-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-lg text-lg transition-transform ${
              loading
                ? "bg-indigo-500 opacity-50 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-300 mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-300 hover:text-pink-400 underline transition"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
