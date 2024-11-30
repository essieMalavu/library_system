import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar"; // Adjust the path based on your file structure

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="">
      {/* Render the Navbar on every page */}
      <Navbar />
      {/* Main content */}
      <div className="pt-16 m-0">
        {/* Add padding to avoid overlapping with the fixed Navbar */}
        <Component {...pageProps} />
      </div>
    </div>
      
  );
}
