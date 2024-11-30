import { useState } from "react";
import { useRouter } from "next/router";
import { db, auth } from "@/firebase/firebaseConfig"; // Ensure Firebase is configured
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), { name, email, phone });

      setSuccessMessage("Registration successful!");
      setErrorMessage("");
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error(error);
      setErrorMessage("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-teal-400 glow mb-6">
          Register Now
        </h1>
        {successMessage && (
          <div className="bg-green-800 p-4 mb-4 rounded text-green-200">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-800 p-4 mb-4 rounded text-red-200">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-teal-500 rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 shadow-lg transition-all"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-teal-400 hover:underline hover:text-teal-500"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
