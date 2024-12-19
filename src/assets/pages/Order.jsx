import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/setting.css";
import "../style/order.css";
import { account, database, storage } from "../components/Client";
import { ID, Query } from "appwrite";
import { data, useNavigate } from "react-router-dom";
import { formatCurrency } from "../components/Currency";
import axios from "axios";

export default function Order() {
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  // cek user
  useEffect(() => {
    async function checking() {
      try {
        await account.get();
      } catch (e) {
        console.error(e);
        nav("/");
      }
    }
    checking();
  }, []);

  // get Order
  const [order, setOrder] = useState(null);

  async function getOrder() {
    try {
      const resp1 = await account.get();
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_ORDER,
        [Query.equal("user", resp1.$id)]
      );
      const orders = resp.documents.map((order) => {
        const date = new Date(order.$createdAt);
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "UTC",
        };
        order.formattedDate = date
          .toLocaleString("sv-SE", options)
          .replace("T", " ")
          .slice(0, 16);
        return order;
      });
      setOrder(orders);
      console.log(orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrder();
  }, []);

  // function signout
  async function handleOut() {
    try {
      Cookies.remove("user");
      Cookies.remove("id");
      await account.deleteSessions();
    } catch (e) {
      console.error(e);
    } finally {
      nav("/login");
    }
  }

  // pop up detail
  const [detailData, setDetailData] = useState();
  const [detail, setDetail] = useState(false);

  // get status
  async function getSelect(e, i, j) {
    try {
      if (order[i].order_resi !== null) {
        await database.updateDocument(
          import.meta.env.VITE_APPWRITE_DATABASE,
          import.meta.env.VITE_APPWRITE_ORDER,
          j,
          {
            order_status: "Deliver",
          }
        );
      } else {
        const cekstatus1 = await axios.get(`/api/v2/${e}/status`, {
          headers: {
            Authorization: `Basic ${btoa(import.meta.env.VITE_MIDTRANS)}`,
          },
        });
        console.log(cekstatus1);
        if (order[i].order_status == "Waiting for payment") {
          const cekstatus = await axios.get(`/api/v2/${e}/status`, {
            headers: {
              Authorization: `Basic ${btoa(import.meta.env.VITE_MIDTRANS)}`,
            },
          });
          console.log(cekstatus);
          if (cekstatus.data.status_code === "200") {
            await database.updateDocument(
              import.meta.env.VITE_APPWRITE_DATABASE,
              import.meta.env.VITE_APPWRITE_ORDER,
              j,
              {
                order_status: "Packaged",
              }
            );
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDetail(true);
    }
  }

  // handle done
  async function handleDone(e) {
    try {
      await database.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_ORDER,
        e,
        {
          order_status: "Completed",
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  }

  return (
    <>
      {/* detail_________________________ */}
      {detail && (
        <>
          <div className="detail-bg">
            <div className="detail">
              <div className="de-nav">
                <h5>Transaction Details</h5>
                <img
                  onClick={() => setDetail(false)}
                  draggable={false}
                  style={{ cursor: "pointer" }}
                  src="./close-dark.svg"
                  alt="close"
                  width={"50px"}
                />
              </div>
              <br />
              <div
                className={`o-l-h-status ${
                  detailData.order_status == "Deliver" ||
                  detailData.order_status == "Packaged"
                    ? "o-l-h-status1"
                    : detailData.order_status == "Completed"
                    ? "o-l-h-status2"
                    : detailData.order_status == "Canceled"
                    ? "o-l-h-status3"
                    : null
                }`}
              >
                <p>{detailData.order_status}</p>
              </div>
              <br />
              <div className="de-product">
                <h6>Product Detail</h6>
                <div className="de-p-wrap">
                  {detailData.product.map((e, i) => (
                    <div key={i} className="de-p-list">
                      <div className="de-p-l-wrap">
                        <img
                          src={storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            e.product_detail[0].p_detail_image
                          )}
                          alt="image"
                          width={"70px"}
                          style={{ border: "5px" }}
                        />
                        <span>
                          <p style={{ fontWeight: "700", fontSize: "18px" }}>
                            {e.product_name}
                          </p>
                          <p style={{ fontSize: "13px" }}>
                            {formatCurrency(e.product_price)}
                          </p>
                        </span>
                      </div>
                      <button onClick={() => window.open(`/store/${e.$id}`)}>
                        See Product
                      </button>
                    </div>
                  ))}
                </div>
                <br />
                <div className="de-p-ship">
                  <h6>Shipping Info</h6>
                  <div className="de-p-s-content">
                    <span>
                      <p style={{ fontSize: "13px" }}>Courier</p>
                      <p style={{ fontSize: "13px" }}>:</p>
                      <p>{detailData.order_ship}</p>
                    </span>
                    <span>
                      <p style={{ fontSize: "13px" }}>Resi</p>
                      <p style={{ fontSize: "13px" }}>:</p>
                      <p>{detailData.order_resi}</p>
                    </span>
                    <span>
                      <p style={{ fontSize: "13px" }}>Address</p>
                      <p style={{ fontSize: "13px" }}>:</p>
                      <div>
                        <p style={{ fontWeight: "700" }}>
                          {order[0].user.user_name}
                        </p>
                        <p>{order[0].user.user_phone}</p>
                        <p>{order[0].user.user_address}</p>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <br />
              <div className="de-pay">
                <h6>Payment Details</h6>
                <div className="de-p-s-content">
                  <span>
                    <p style={{ fontSize: "13px" }}>Item</p>
                    <p style={{ fontSize: "13px" }}>:</p>
                    <p>x{detailData.product.length}</p>
                  </span>
                  <span>
                    <p style={{ fontSize: "13px" }}>Shipment</p>
                    <p style={{ fontSize: "13px" }}>:</p>
                    <p>{formatCurrency(50000)}</p>
                  </span>
                  <span>
                    <p style={{ fontSize: "13px" }}>Total</p>
                    <p style={{ fontSize: "13px" }}>:</p>
                    <p>{formatCurrency(detailData.order_price)}</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Navbar />
      <div className="container">
        <div className="navbar-in"></div>
        {loading ? (
          <div className="loading1">
            <img src="./loading.svg" alt="loading" />
          </div>
        ) : (
          <div className="setting">
            <div className="s-nav-wrap">
              <div className="s-nav">
                <h6 style={{ width: "100%", marginBottom: "10px" }}>General</h6>
                <button
                  style={{ color: "#bdbdbd" }}
                  onClick={() => nav("/setting")}
                >
                  <img
                    height={"25px"}
                    width={"25px"}
                    src="./user-brown.svg"
                    style={{ filter: "grayscale(100%)" }}
                    alt="user"
                  />
                  Profile
                </button>
                <button
                  style={{
                    color: "#b17457",
                    cursor: "default",
                    borderRight: "5px solid #b17457",
                  }}
                >
                  <img
                    height={"25px"}
                    width={"25px"}
                    src="./order-brown.svg"
                    alt="user"
                  />
                  Order
                </button>
              </div>
              <button onClick={handleOut} className="s-n-out">
                <img width={"20px"} src="./signout-black.svg" alt="signout" />
                Sign Out
              </button>
            </div>
            <div className="s-content">
              <div className="order">
                <h4>Order History</h4>
                <br />
                {order
                  .sort((a, b) => b.$id.localeCompare(a.$id))
                  .map((e, i) => (
                    <div className="o-list" key={i}>
                      <div className="o-l-head">
                        <img src="./shop.svg" alt="shop" height={"30px"} />
                        <p>{e.formattedDate}</p>
                        <div
                          className={`o-l-h-status ${
                            e.order_status == "Deliver" ||
                            e.order_status == "Packaged"
                              ? "o-l-h-status1"
                              : e.order_status == "Completed"
                              ? "o-l-h-status2"
                              : e.order_status == "Canceled"
                              ? "o-l-h-status3"
                              : null
                          }`}
                        >
                          <p>{e.order_status}</p>
                        </div>
                      </div>
                      <div className="c-l-body">
                        <div className="c-l-b-left">
                          <img
                            width={"100px"}
                            src={storage.getFilePreview(
                              import.meta.env.VITE_APPWRITE_BUCKET,
                              e.product[0].product_detail[0].p_detail_image
                            )}
                            alt="image"
                          />
                          <span>
                            <h6>{e.product[0].product_name}</h6>
                            <p style={{ fontSize: "13px", color: "grey" }}>
                              {e.product.length}x Product
                            </p>
                          </span>
                        </div>
                        <div className="c-l-b-right">
                          <p>Total:</p>
                          <h6 style={{ fontSize: "18px" }}>
                            {formatCurrency(e.order_price)}
                          </h6>
                        </div>
                      </div>
                      <div className="c-l-foot">
                        <p
                          onClick={() => {
                            setDetailData(e);
                            getSelect(e.order_payid, i, e.$id);
                          }}
                        >
                          See Details
                        </p>
                        {e.order_status == "Waiting for payment" ? (
                          <button onClick={() => window.open(e.order_link)}>
                            Pay
                          </button>
                        ) : e.order_status == "Deliver" ? (
                          <>
                            <button
                              onClick={() => handleDone(e.$id)}
                              style={{ backgroundColor: "green" }}
                            >
                              Done
                            </button>
                          </>
                        ) : e.order_status == "Completed" ? null : null}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
