import { useEffect, useRef, useState } from "react";
import { account } from "../components/Client";
import { useNavigate } from "react-router-dom";

export default function Recovery() {
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [cek, setCek] = useState(false);

  //   get param query
  const queryparam = new URLSearchParams(window.location.search);
  const userid = queryparam.get("userId");
  const secret = queryparam.get("secret");

  //   handle error
  const [error, setError] = useState(false);
  const [pesanerror, setPesanerror] = useState("");

  //   handle update password
  const pass = useRef();
  async function handleRecovery(e) {
    e.preventDefault();
    try {
      await account.updateRecovery(userid, secret, pass.current.value);
      nav("/login");
    } catch (e) {
      console.error(e);
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
          <h3>Recovery Account</h3>
          <br />
          <form onSubmit={handleRecovery}>
            <span className="a-c-c-input">
              <p>Masukan Password baru</p>
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
            <button className="a-c-c-button">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}
