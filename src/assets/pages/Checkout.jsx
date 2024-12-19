import { useEffect, useState } from "react";
import { account, database, storage } from "../components/Client";
import Navbar from "../components/Navbar";
import "../style/checkout.css";
import { formatCurrency } from "../components/Currency";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";
import axios from "axios";

export default function Checkout() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  // cek alamat user
  const [user, setUser] = useState();
  async function cekUser() {
    setLoading(true);
    try {
      const resp = await account.get();
      const resp2 = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        resp.$id
      );
      setUser(resp2);
    } catch (e) {
      console.error(e);
      nav("/login");
    } finally {
      setLoading(false);
    }
  }

  //   get cart
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState();
  let [dataproduct, setDataproduct] = useState([]);
  async function getCart() {
    setLoading(true);
    try {
      const user = await account.get();
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CART
      );
      const filter = resp.documents.filter((e) => e.user.$id == user.$id);
      let atotal = 0;
      let aproduk = [];
      for (let i = 0; i < filter.length; i++) {
        atotal += filter[i].cart_quanitity * filter[i].product.product_price;
        aproduk.push(filter[i].product.$id);
      }
      setTotal(atotal);
      setCart(filter);
      setDataproduct(aproduk);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cekUser();
    getCart();
  }, []);

  //   listing method
  const method = [
    { id: 1, img: "./pos1.png", name: "jne" },
    { id: 2, img: "./pos2.png", name: "pos" },
    { id: 3, img: "./pos3.png", name: "gosend" },
    { id: 4, img: "./pos4.png", name: "cod" },
  ];

  const [ship, setShip] = useState();

  //   sending data
  async function sendBuy() {
    setLoading(true);
    const now = Date.now();
    try {
      // payment
      const resp = await axios.post(
        "/app/snap/v1/transactions",
        {
          transaction_details: {
            order_id: now,
            gross_amount: total + 50000,
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            name: "",
          },
        },
        {
          headers: {
            Authorization: `Basic ${btoa(import.meta.env.VITE_MIDTRANS)}`,
            "Content-Type": "application/json",
          },
        }
      );

      // order table
      await database.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_ORDER,
        ID.unique(),
        {
          order_ship: ship,
          order_price: total + 50000,
          order_status: "Waiting for payment",
          user: user.$id,
          product: dataproduct,
          order_link: resp.data.redirect_url,
          order_payid: now,
        }
      );

      for (let i = 0; i < cart.length; i++) {
        await database.deleteDocument(
          import.meta.env.VITE_APPWRITE_DATABASE,
          import.meta.env.VITE_APPWRITE_CART,
          cart[i].$id
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      nav("/order");
    }
  }
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="navbar-in"></div>
        {loading ? (
          <div className="loading1">
            <img src="./loading.svg" alt="loading" />
          </div>
        ) : (
          <div className="checkout">
            <div className="c-left">
              <h4>Shopping cart</h4>
              <br />
              <br />
              <div className="c-l-wrap">
                <div className="c-l-l-head">
                  <p>Product</p>
                  <p>Size | Color</p>
                  <p>Quantity</p>
                  <p>Total Price</p>
                </div>
                {cart.map((e, i) => (
                  <div className="c-l-list" key={i}>
                    <span className="c-l-l-span">
                      <img
                        src={storage.getFilePreview(
                          import.meta.env.VITE_APPWRITE_BUCKET,
                          e.product.product_detail[0].p_detail_image
                        )}
                        alt="list cart"
                      />
                      <span>
                        <h6>{e.product.product_name}</h6>
                      </span>
                    </span>
                    <p>
                      {e.cart_size} | {e.cart_color}
                    </p>
                    <p>x {e.cart_quanitity}</p>
                    <span>
                      <p>
                        {formatCurrency(
                          e.product.product_price * e.cart_quanitity
                        )}
                      </p>
                    </span>
                  </div>
                ))}
              </div>
              <div className="c-l-sub">
                <div className="c-l-s-up">
                  <span>
                    <h6>Subtotal : </h6>
                    <h6>{formatCurrency(total)}</h6>
                  </span>
                  <span>
                    <h6>Shipping :</h6>
                    <h6>{formatCurrency(50000)}</h6>
                  </span>
                </div>
                <div className="c-l-s-up">
                  <span>
                    <h6>Total :</h6>
                    <h6>{formatCurrency(total + 50000)}</h6>
                  </span>
                </div>
              </div>
              <button></button>
            </div>
            <div className="c-right">
              <h4>Payment Info</h4>
              <br />
              <p>Shipping Method :</p>
              <div className="c-r-method">
                {method.map((e, i) => (
                  <div
                    key={i}
                    onClick={() => setShip(e.name)}
                    className={`c-r-m-l-wrap   ${
                      ship === e.name ? "c-r-m-l-wrap-on" : ""
                    }`}
                  >
                    <img src={e.img} alt="image" width={"50px"} />
                  </div>
                ))}
              </div>
              <br />
              <br />
              <p>Address :</p>
              <div onClick={() => nav("/setting")} className="c-r-address">
                <p>{user.user_address}</p>
              </div>
              <p style={{ fontSize: "13px" }}>
                *Untuk saat ini, SepatuLoe hanya melayani pengiriman di area
                Yogyakarta.
              </p>
              <br />
              <br />

              {user.user_address == null ? (
                <p style={{ color: "#ff9494" }}>
                  Blank address, fill in the address details before you buy
                </p>
              ) : (
                <button onClick={sendBuy} className="c-r-buy">
                  Buy
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
