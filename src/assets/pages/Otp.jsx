import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../components/Client";
import Cookies from "js-cookie";
import "../style/auth.css";

export default function Otp() {
  const nav = useNavigate();
  const otp = useRef("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setId(Cookies.get("otpid"));
  }, []);

  //   handle error
  const [error, setError] = useState(false);
  const [pesanerror, setPesanerror] = useState("");
  async function handleOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await account.createSession(id, otp.current.value);
      nav("/");
    } catch (e) {
      setError(true);
      setPesanerror(e.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {loading && (
        <div className="loading1">
          <img src="./loading.svg" alt="loading" />
        </div>
      )}
      <div className="auth-container">
        <img
          className="logo"
          src="./logo.svg"
          alt="logo"
          draggable={false}
          onClick={() => nav("/")}
        />
        <div className="a-c-content">
          <h3>OTP</h3>
          <br />
          <form onSubmit={handleOtp}>
            <span className="a-c-c-input">
              <p>Kode Otp</p>
              <input
                className={`cek ${error ? "cek-on" : ""}`}
                ref={otp}
                type="text"
                placeholder="6 kode"
              />
            </span>
            {error && <p style={{ color: "#ff2323" }}>{pesanerror}</p>}
            <br />
            <button className="a-c-c-button">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}
