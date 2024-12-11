import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { account, database, storage } from "./Client";
import { Query } from "appwrite";
import { formatCurrency } from "./Currency";

export default function Navbar() {
  const nav = useNavigate();

  //   get user
  const [userdata, setUserdata] = useState(null);
  async function getUser() {
    try {
      const cookie = Cookies.get("id");
      const resp = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        cookie
      );
      setUserdata(resp ? resp : null);
    } catch (e) {
      console.error(e);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  // get cart
  const [cartData, setCartData] = useState([]);
  async function getCart() {
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CART
      );
      console.log(resp.documents);
      const filter = resp.documents.filter(
        (e) => e.user.$id == "6753209837b7b7bd4c19"
      );
      console.log("filter", filter);
      setCartData(resp.documents);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getCart();
  }, []);

  //   fungsi menu
  const [cart, setCart] = useState(false);
  const [profil, setProfil] = useState(false);

  //   logout
  async function handelLogout() {
    try {
      Cookies.remove("user");
      Cookies.remove("id");
      await account.deleteSessions();
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  }

  // cart function
  const [quantity, setQuantity] = useState(1);

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
                  getCart();
                }
              }}
            >
              <img src="../cart.svg" alt="cart" width={"30px"} />
            </button>
            {Cookies.get("id") ? (
              <button
                onClick={() => {
                  setProfil(!profil);
                  getUser();
                }}
              >
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
        <div className="n-c-body">
          {cartData
            ? cartData
                .filter((e) => e.user.$id == Cookies.get("id"))
                .map((e, i) => (
                  <div key={i} className="n-c-b-list">
                    <img
                      style={{ borderRadius: "5px" }}
                      src={storage.getFilePreview(
                        import.meta.env.VITE_APPWRITE_BUCKET,
                        e.product.product_detail[0].p_detail_image
                      )}
                      alt="img"
                      width={"100px"}
                    />

                    <div className="n-c-b-l-desc">
                      <h6>{e.product.product_name}</h6>
                      <p>{formatCurrency(e.product.product_price)}</p>
                      <br />
                      <p style={{ fontSize: "14px" }}>
                        {e.cart_size} | {e.cart_color}
                      </p>
                    </div>
                    <div className="n-c-b-l-action">
                      <button className="n-c-b-l-a-delete">Delete</button>
                      <br />
                      <br />
                      <div className="n-c-b-l-a-quantity">
                        <button>
                          <img src="../minus.svg" alt="minus" width={"20px"} />
                        </button>
                        <p>{e.cart_quanitity}</p>
                        <button>
                          <img src="../plus.svg" alt="plus" width={"20px"} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            : null}
        </div>
      </div>
      {/* ____________________________________________________________ */}
    </>
  );
}
