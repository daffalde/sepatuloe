import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Cookies from "js-cookie";

export default function Home() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookie = Cookies.get("reload");
    setLoading(true);
    if (cookie) {
      const timer = setTimeout(() => {
        if (cookie) {
          try {
            window.location.reload();
          } catch (e) {
            null;
          } finally {
            Cookies.remove("reload");
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }

    // Cleanup timer on component unmount
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading1">
          <img src="./loading.svg" alt="loading" />
        </div>
      ) : (
        <>
          <Navbar />
          <div className="navbar-in"></div>
          <div className="container">
            <h1>Home</h1>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
