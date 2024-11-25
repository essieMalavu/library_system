import { useState, useEffect } from "react";
import { db } from "@/firebase/firebaseConfig"; // Adjust the path as per your project structure
import { doc, getDoc } from "firebase/firestore";

const ProfileDisplay = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    profilePicture?: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as {
            name: string;
            email: string;
            phone: string;
            profilePicture?: string;
          });
        } else {
          setErrorMessage("Profile not found.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrorMessage("Failed to fetch profile. Please try again.");
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Profile Details
        </h1>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-4 text-red-600 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        {/* Profile Information */}
        {profile ? (
          <div>
            {/* Profile Picture */}
            {profile.profilePicture ? (
              <div className="flex justify-center mb-4">
                <img
                  src={profile.profilePicture}
                  alt={`${profile.name}'s profile`}
                  className="w-24 h-24 rounded-full object-cover shadow-md"
                />
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Name */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium">Name:</p>
              <p className="text-gray-900 font-semibold text-lg">
                {profile.name}
              </p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium">Email:</p>
              <p className="text-gray-900 font-semibold text-lg">
                {profile.email}
              </p>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium">Phone:</p>
              <p className="text-gray-900 font-semibold text-lg">
                {profile.phone}
              </p>
            </div>

            {/* Edit Button */}
            <div className="text-center mt-6">
              <button
                className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
                onClick={() => alert("Edit Profile functionality pending.")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          !errorMessage && (
            <div className="text-center text-gray-600">Loading profile...</div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfileDisplay;
