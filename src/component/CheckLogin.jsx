import React, { useEffect, useState } from "react";

const CheckLogin = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/auth/check-login", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div>
      {user ? (
        <p>
          ✅ Welcome, <strong>{user.name}</strong> ({user.email})
        </p>
      ) : (
        <p>❌ User not logged in</p>
      )}
    </div>
  );
};

export default CheckLogin;
