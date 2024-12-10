import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { account, storage } from "./Client";

export default function Navbar() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  //   get user
  const [userdata, setUserdata] = useState(null);
  useEffect(() => {
    try {
      const cookie = Cookies.get("user");
      setUserdata(JSON.parse(cookie));
    } catch (e) {
      console.log(e);
    }
  }, []);

  //   fungsi menu
  const [cart, setCart] = useState(false);
  const [profil, setProfil] = useState(false);

  //   logout
  async function handelLogout() {
    try {
      await account.deleteSessions();
      Cookies.remove("user");
      Cookies.remove("reload");
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  }
  return (
    <>
      <div className="navbar-container">
        <div className="navbar">
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/store"}>Store</Link>
            </li>
            <li>
              <Link to={"/about"}>About</Link>
            </li>
          </ul>
          <img
            style={{ cursor: "pointer" }}
            src="../logo.svg"
            alt="logo"
            draggable={false}
            onClick={() => nav("/")}
          />
          <div className="n-menu">
            <button
              onClick={() => {
                if (!userdata) {
                  nav("/login");
                } else {
                  setCart(true);
                }
              }}
            >
              <img src="../cart.svg" alt="cart" width={"30px"} />
            </button>
            {userdata ? (
              userdata && userdata.user_image ? (
                <button onClick={() => setProfil(!profil)}>
                  <img
                    src={`${storage.getFilePreview(
                      import.meta.env.VITE_APPWRITE_BUCKET,
                      userdata.user_image
                    )}`}
                    alt="user"
                    width={"30px"}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      aspectRatio: "1/1",
                      borderRadius: "3px",
                    }}
                  />
                </button>
              ) : Cookies.get("reload") ? (
                <button onClick={() => setProfil(!profil)}>
                  <img
                    src={`${
                      userdata && userdata.user_image
                        ? storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            userdata.user_image
                          )
                        : "../user.svg"
                    }`}
                    alt="user"
                    width={"30px"}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      aspectRatio: "1/1",
                      borderRadius: "3px",
                    }}
                  />
                </button>
              ) : (
                <button onClick={() => setProfil(!profil)}>
                  <img
                    src={`${
                      userdata && userdata.user_image
                        ? storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            userdata.user_image
                          )
                        : "../user.svg"
                    }`}
                    alt="user"
                    width={"30px"}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      aspectRatio: "1/1",
                      borderRadius: "3px",
                    }}
                  />
                </button>
              )
            ) : Cookies.get("reload") ? (
              <button onClick={() => nav("/login")}>
                <img
                  src={`${
                    userdata && userdata.user_image
                      ? storage.getFilePreview(
                          import.meta.env.VITE_APPWRITE_BUCKET,
                          userdata.user_image
                        )
                      : "../user.svg"
                  }`}
                  alt="user"
                  width={"30px"}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    aspectRatio: "1/1",
                    borderRadius: "3px",
                  }}
                />
              </button>
            ) : (
              <Link to={"/login"}>Sign in</Link>
            )}
            {/* __________________________________ */}
            {profil && (
              <div className="navbar-profile">
                <button onClick={() => setProfil(false)} className="n-p-close">
                  X
                </button>
                <div className="n-p-head">
                  <img
                    src={`${
                      userdata && userdata.user_image
                        ? storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            userdata.user_image
                          )
                        : "../user.svg"
                    }`}
                    alt="profil"
                  />
                  <span>
                    <h6>{userdata ? userdata.user_name : "User"}</h6>
                    <p>{userdata ? userdata.user_email : "Email"}</p>
                  </span>
                </div>
                <div className="n-p-bottom">
                  <button>
                    <img src="../setting.svg" alt="setting" width={"20px"} />
                    Setting
                  </button>
                  <button onClick={handelLogout}>
                    <img src="../signout.svg" alt="signout" width={"20px"} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ____________________________________________________________ */}
      <div
        onClick={() => setCart(false)}
        className={`navbar-bg ${cart ? "navbar-bg-on" : ""}`}
      ></div>
      {/* ____________________________________________________________ */}
      <div className={`navbar-cart ${cart ? "navbar-cart-on" : ""}`}>
        <div className="n-c-head">
          <img
            onClick={() => setCart(false)}
            style={{ cursor: "pointer" }}
            src="../close.svg"
            alt="close"
            width={"50px"}
          />
          <h5>Cart</h5>
          <div style={{ width: "50px" }} className="random"></div>
        </div>
      </div>
      {/* ____________________________________________________________ */}
    </>
  );
}
