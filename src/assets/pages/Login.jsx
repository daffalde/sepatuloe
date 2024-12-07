import { Link, useNavigate } from "react-router-dom";
import "../style/auth.css";
import { useEffect, useRef, useState } from "react";
import { account } from "../components/Client";
import { OAuthProvider } from "appwrite";

export default function Login() {
  const nav = useNavigate();
  const [cek, setCek] = useState(false);
  const email = useRef("");
  const pass = useRef("");
  const [loading, setLoading] = useState(false);

  //   handle error
  const [error, setError] = useState(false);
  const [pesanerror, setPesanerror] = useState("");

  //   handle login
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await account.createEmailPasswordSession(
        email.current.value,
        pass.current.value
      );
      open("/");
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

  //   lupa password
  async function handleRecovery() {
    setMessage(true);
    setLoading(true);
    try {
      await account.createRecovery(
        email.current.value,
        "http://localhost:5173/login"
      );
    } catch (e) {
      console.error(e);
      setError(true);
      setPesanerror(e.message);
    } finally {
      setLoading(false);
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
        <p>Recovery terkirim</p>
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
          <h3>Welcome!</h3>
          <p>Sign in untuk masuk ke akun anda</p>
          <br />
          <br />
          <form onSubmit={handleLogin}>
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
            <button className="a-c-c-button">Sign in</button>
          </form>
          <br />
          <p style={{ textAlign: "center" }}>Atau</p>
          <br />
          <button onClick={handleoauth} className="a-c-c-oauth">
            <img src="./google.svg" alt="google" />
            <p>Sign in dengan Google</p>
          </button>
          <br />
          <p style={{ textAlign: "center" }}>
            Belum punya akun?<Link to={"/signup"}>Sign up</Link>
          </p>
          <br />
          <p
            onClick={handleRecovery}
            className="lupa-password"
            style={{ textAlign: "center" }}
          >
            Lupa password?
          </p>
        </div>
      </div>
    </>
  );
}
