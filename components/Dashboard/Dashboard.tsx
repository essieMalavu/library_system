// pages/dashboard.tsx
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Bura Library Dashboard</h1>
    </div>
  );
};

export default Dashboard;
