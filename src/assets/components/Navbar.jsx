import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { account, database, storage } from "./Client";
import { Query } from "appwrite";
import { formatCurrency } from "./Currency";

export default function Navbar() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  //   get user
  const [userdata, setUserdata] = useState(null);
  const [userid, setUserid] = useState();
  async function getUser() {
    try {
      const user = await account.get();
      setUserid(user.$id);
      const resp = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        user.$id
      );
      setUserdata(resp ? resp : null);
    } catch (e) {
      console.error(e);
    }
  }

  // get cart
  const [cartData, setCartData] = useState([]);
  const [cdTotal, setCdTotal] = useState();
  const [cdJumlah, setCdJumlah] = useState();
  async function getCart() {
    setLoading(true);
    try {
      const user = await account.get();
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CART
      );
      const filter = resp.documents.filter((e) => e.user.$id == user.$id);
      let totalRaw = 0;
      let jumlahraw = 0;
      for (let i = 0; i < filter.length; i++) {
        totalRaw =
          totalRaw + filter[i].product.product_price * filter[i].cart_quanitity;
        jumlahraw = jumlahraw + filter[i].cart_quanitity;
      }
      setCdTotal(totalRaw);
      setCdJumlah(jumlahraw);
      setCartData(resp.documents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
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

  // cart function________________________________
  // delete
  async function handleCartDelete(e) {
    try {
      await database.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CART,
        e
      );
      getCart();
    } catch (e) {
      console.log(e);
    }
  }

  // update quantity
  async function plusQuantity(e) {
    try {
      const resp = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CART,
        e
      );
      await database.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CART,
        e,
        {
          cart_quanitity: resp.cart_quanitity + 1,
        }
      );
      getCart();
    } catch (e) {
      console.log(e);
    }
  }

  async function minusQuantity(e) {
    try {
      const resp = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CART,
        e
      );
      if (resp.cart_quanitity > 1) {
        await database.updateDocument(
          import.meta.env.VITE_APPWRITE_DATABASE,
          import.meta.env.VITE_APPWRITE_CART,
          e,
          {
            cart_quanitity: resp.cart_quanitity - 1,
          }
        );
      }

      getCart();
    } catch (e) {
      console.log(e);
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
                  getCart();
                }
              }}
            >
              {userid && cdJumlah !== 0 ? (
                <div className="cart-dot">{cdJumlah}</div>
              ) : null}
              <img src="../cart.svg" alt="cart" width={"30px"} />
            </button>

            {userid ? (
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
        {loading && (
          <div className="loading1">
            <img src="../loading.svg" alt="loading" />
          </div>
        )}
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
                .filter((e) => e.user.$id == userid)
                .map((e, i) => (
                  <div key={i} className="n-c-b-list">
                    <img
                      style={{ borderRadius: "5px" }}
                      src={storage.getFilePreview(
                        import.meta.env.VITE_APPWRITE_BUCKET,
                        e.product.product_detail.find(
                          (a) => a.p_detail_color == e.cart_color
                        )?.p_detail_image
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
                      <button
                        onClick={() => handleCartDelete(e.$id)}
                        className="n-c-b-l-a-delete"
                      >
                        Delete
                      </button>
                      <br />
                      <br />
                      <div className="n-c-b-l-a-quantity">
                        <button
                          className={`${e.cart_quanitity == 1 ? "hel" : ""}`}
                          onClick={() => minusQuantity(e.$id)}
                        >
                          <img src="../minus.svg" alt="minus" width={"20px"} />
                        </button>
                        <p>{e.cart_quanitity}</p>
                        <button onClick={() => plusQuantity(e.$id)}>
                          <img src="../plus.svg" alt="plus" width={"20px"} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            : null}
        </div>
        {cdJumlah !== 0 ? (
          <div className="n-c-footer">
            <span>
              <h5>Total : </h5>
              <h5>{formatCurrency(cdTotal)}</h5>
            </span>
            <span>
              <p>Jumlah</p>
              <p>{cdJumlah}</p>
            </span>
            <br />
            <button>Buy</button>
          </div>
        ) : null}
      </div>
      {/* ____________________________________________________________ */}
    </>
  );
}
