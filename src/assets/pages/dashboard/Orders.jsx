import { useEffect, useState } from "react";
import { database, storage } from "../../components/Client";
import { formatCurrency } from "../../components/Currency";

export default function Orders() {
  const [loading, setLoading] = useState(true);

  //   get order
  const [order, setOrder] = useState();
  async function getOrder() {
    setLoading(true);
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_ORDER
      );
      console.log(resp.documents);
      setOrder(resp.documents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrder();
  }, []);

  const [select, setSelect] = useState();

  const [resi, setResi] = useState("");
  async function handleResi(e, id) {
    e.preventDefault();
    try {
      await database.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_ORDER,
        id,
        {
          order_status: "Retrieved",
          order_resi: resi,
        }
      );
    } catch (e) {
      console.error();
    } finally {
      getOrder();
    }
  }
  return (
    <>
      {loading ? (
        <div className="loading2">
          <img src="./loading.svg" alt="loading" />
        </div>
      ) : (
        <div className="orders">
          {order.map((e, i) => (
            <div
              onClick={() => setSelect(e.$id)}
              className={`or-list ${select == e.$id ? "or-list-on" : ""}`}
              key={i}
            >
              <div className="or-l-head">
                <p>{e.user.user_email}</p>
                <p>{e.product.length}x Items</p>
                <p>{formatCurrency(e.order_price)}</p>
                <div
                  style={{ width: "fit-content" }}
                  className={`o-l-h-status ${
                    e.order_status == "Retrieved" ||
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
                <p></p>
              </div>
              <div className="or-l-body">
                {/* user */}
                <div className="or-l-b-content">
                  <div className="or-l-b-c-user">
                    <h6>Customer :</h6>
                    <br />
                    <span>
                      <p>Name</p>
                      <p>:</p>
                      <p>{e.user.user_name}</p>
                    </span>
                    <span>
                      <p>Phone</p>
                      <p>:</p>
                      <p>{e.user.user_phone}</p>
                    </span>
                    <span>
                      <p>Email</p>
                      <p>:</p>
                      <p>{e.user.user_email}</p>
                    </span>
                    <span>
                      <p>Address</p>
                      <p>:</p>
                      <p>{e.user.user_address}</p>
                    </span>
                  </div>
                  <br />
                  <div className="or-l-b-c-product">
                    <h6>Product :</h6>
                    <br />
                    {e.product.map((e, i) => (
                      <div className="or-l-b-c-p-list" key={i}>
                        <img
                          src={storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            e.product_detail[0].p_detail_image
                          )}
                          alt="image"
                          width={"50px"}
                        />
                        <span>
                          <p style={{ fontWeight: "700" }}>{e.product_name}</p>
                          <p>{formatCurrency(e.product_price)}</p>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="or-l-b-content">
                  <div className="or-l-b-c-user">
                    <h6>Shipping :</h6>
                    <br />
                    <span>
                      <p>Courier</p>
                      <p>:</p>
                      <p>{e.order_ship}</p>
                    </span>
                    <span>
                      <p>Total</p>
                      <p>:</p>
                      <p>{formatCurrency(e.order_price)}</p>
                    </span>
                    <span>
                      <p>Resi</p>
                      <p>:</p>
                      <input
                        value={resi}
                        onChange={(e) => setResi(e.target.value)}
                        type="text"
                        placeholder={e.order_resi ? e.order_resi : "Resi..."}
                      />
                    </span>
                    <button onClick={(event) => handleResi(event, e.$id)}>
                      Save Resi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
