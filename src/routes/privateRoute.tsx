
import PrivateLayout from "@/layouts/privateLayout";
import { userType } from "@/types/user.types";
import { apiURL } from "@/utils/baseurl";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        const response = await axios.get<userType>(apiURL+"api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return user && token ? <PrivateLayout user={user} /> : <Navigate to="/login" />;
};

export default PrivateRoute;

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ user }) => {
//   const token = localStorage.getItem("token");

//   return user && token ? (
//     <PrivateLayout user={user} />
//   ) : (
//     <Navigate to="/login" />
//   );
// };

// export default PrivateRoute;