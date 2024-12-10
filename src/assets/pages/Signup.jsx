import { Link, useNavigate } from "react-router-dom";
import "../style/auth.css";
import { useEffect, useRef, useState } from "react";
import { account } from "../components/Client";
import { ID, OAuthProvider } from "appwrite";
import Cookies from "js-cookie";

export default function Signup() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cek, setCek] = useState(false);
  const name = useRef("");
  const email = useRef("");
  const pass = useRef("");

  useEffect(() => {
    Cookies.get("user") ? nav("/") : null;
  }, []);

  //   handle error
  const [error, setError] = useState(false);
  const [pesanerror, setPesanerror] = useState("");

  //   sign up
  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await account.create(
        ID.unique(),
        email.current.value,
        pass.current.value,
        name.current.value
      );
      Cookies.set("otpid", resp.$id);
      await account.createEmailToken(ID.unique(), email.current.value);
      setMessage(true);
    } catch (e) {
      setError(true);
      setPesanerror(e.message);
    } finally {
      setLoading(false);
    }
  }

  //   signup oauth
  async function handleoauth() {
    try {
      await account.createOAuth2Session(
        OAuthProvider.Google,
        import.meta.env.VITE_DOMAIN,
        import.meta.env.VITE_DOMAIN
      );
    } catch (e) {
      console.error(e);
    }
  }
  //   message
  const [message, setMessage] = useState(false);
  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(false);
        nav("/otp");
      }, 5000);
    }
  }, [message]);

  return (
    <>
      {loading && (
        <div className="loading1">
          <img src="./loading.svg" alt="loading" />
        </div>
      )}
      <div className={`message ${message ? "message-on" : ""}`}>
        <p>Kode OTP terkirim</p>
        <p>Periksa email anda</p>
      </div>
      <div className="auth-container">
        <img
          className="logo"
          src="./logo.svg"
          alt="logo"
          draggable={false}
          onClick={() => nav("/")}
        />
        <div className="a-c-content">
          <h3>Hai!</h3>
          <p>Sign up untuk mendaftar</p>
          <br />
          <br />
          <form onSubmit={handleSignup}>
            <span className="a-c-c-input">
              <p>Name</p>
              <input
                style={{ border: `${error ? "2px solid #ff2323" : ""}` }}
                ref={name}
                type="text"
                placeholder="john doe"
              />
            </span>
            <br />
            <span className="a-c-c-input">
              <p>Email</p>
              <input
                style={{ border: `${error ? "2px solid #ff2323" : ""}` }}
                ref={email}
                type="email"
                placeholder="example@mail.com"
              />
            </span>
            <br />
            <span className="a-c-c-input">
              <p>Password</p>
              <input
                style={{ border: `${error ? "2px solid #ff2323" : ""}` }}
                ref={pass}
                type={`${cek ? "text" : "password"}`}
                placeholder="8+ karakter"
              />
            </span>
            <span className="a-c-c-check">
              <input
                className={`cek ${cek ? "cek-on" : ""}`}
                id="check"
                type="checkbox"
                onChange={() => setCek(!cek)}
              />
              <label htmlFor="check">
                <p>Lihat Password</p>
              </label>
            </span>
            {error && <p style={{ color: "#ff2323" }}>{pesanerror}</p>}
            <br />
            <button className="a-c-c-button">Sign up</button>
            <br />
          </form>
          <br />
          <p style={{ textAlign: "center" }}>Atau</p>
          <br />
          <button onClick={handleoauth} className="a-c-c-oauth">
            <img src="./google.svg" alt="google" />
            <p>Sign up dengan Google</p>
          </button>
          <br />
          <p style={{ textAlign: "center" }}>
            Sudah punya akun?<Link to={"/login"}>Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
