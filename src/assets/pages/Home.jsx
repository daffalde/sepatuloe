import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Cookies from "js-cookie";

export default function Home() {
  return (
    <>
      <>
        <Navbar />
        <div className="navbar-in"></div>
        <div className="container">
          <h1>Home</h1>
        </div>
        <Footer />
      </>
    </>
  );
}
