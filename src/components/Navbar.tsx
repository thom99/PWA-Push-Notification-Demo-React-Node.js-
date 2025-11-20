import React from "react";
import { Link } from "react-router";

function Navbar(): React.ReactNode {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "30px 150px",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/create-user">Create User</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
