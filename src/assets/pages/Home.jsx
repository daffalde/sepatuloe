import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="navbar-in"></div>
      <div className="container">
        <h1>Home</h1>
      </div>
      <Footer />
    </>
  );
}
