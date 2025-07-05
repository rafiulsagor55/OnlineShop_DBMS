import React from "react";

const Logout = () => {
  const handleLogout = () => {
    fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      alert("Logged out");
      window.location.reload(); // Refresh to update state
    });
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
