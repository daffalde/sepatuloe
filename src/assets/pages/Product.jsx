import { useParams } from "react-router-dom";
import { account, database, storage } from "../components/Client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../style/product.css";
import { formatCurrency } from "../components/Currency";
import { ID, Query } from "appwrite";
import Cookies from "js-cookie";

export default function Product() {
  const param = useParams();
  const paramId = param.id;

  const [loading, setLoading] = useState(true);

  //   get Product
  const [product, setProduct] = useState([]);
  async function getProduct() {
    setLoading(true);
    try {
      const resp = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_PRODUCT,
        paramId
      );
      setProduct(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  //   get all product
  const [allProduct, setAllProduct] = useState([]);
  async function getAllproduct() {
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_PRODUCT
      );
      setAllProduct(resp.documents);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getProduct();
    getAllproduct();
  }, []);

  //   select image
  const [indexImage, setIndexImage] = useState(0);

  //   info input
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [inputError, setInputError] = useState();

  //   input cart
  async function handleCart() {
    if (!color || !size) {
      setInputError("*You must input the color & size");
    } else {
      console.log(color);
      console.log(size);
      console.log(quantity);
      setLoading(true);
      try {
        const userr = await account.get();
        const cekCart = await database.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE,
          import.meta.env.VITE_APPWRITE_CART
        );
        const filter = cekCart.documents.filter(
          (e) => e.user.$id === Cookies.get("id")
        );
        const existingCart = filter.find(
          (e) => e.cart_color === color && e.cart_size === size
        );
        if (existingCart) {
          await database.updateDocument(
            import.meta.env.VITE_APPWRITE_DATABASE,
            import.meta.env.VITE_APPWRITE_CART,
            existingCart.$id,
            { cart_quanitity: existingCart.cart_quanitity + quantity }
          );
        } else {
          await database.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE,
            import.meta.env.VITE_APPWRITE_CART,
            ID.unique(),
            {
              cart_color: color,
              cart_size: size,
              cart_quanitity: quantity,
              product: paramId,
              user: Cookies.get("id"),
            }
          );
        }
      } catch (e) {
        console.error(e);
        alert("You must login!");
      } finally {
        setLoading(false);
        window.location.reload();
      }
    }
  }
  return (
    <>
      <Navbar />
      <div className="navbar-in"></div>
      <div className="container">
        {loading ? (
          <div className="loading3">
            <img src="../loading.svg" alt="loading" />
          </div>
        ) : (
          <div className="select-product">
            <div className="sp-product">
              <div className="sp-p-image">
                <img
                  src={storage.getFilePreview(
                    import.meta.env.VITE_APPWRITE_BUCKET,
                    product.product_detail[indexImage].p_detail_image
                  )}
                  alt="image product"
                />
                <div className="sp-p-i-parent">
                  {product.product_detail.map((e, i) => (
                    <img
                      className={`${i == indexImage ? "sp-p-i-p-list" : ""}`}
                      key={i}
                      onClick={() => setIndexImage(i)}
                      src={storage.getFilePreview(
                        import.meta.env.VITE_APPWRITE_BUCKET,
                        e.p_detail_image
                      )}
                      alt="image product"
                    />
                  ))}
                </div>
              </div>
              <div className="sp-p-desc">
                <h3>{product.product_name}</h3>
                {product.review.length !== 0 ? (
                  <div className="s-b-i-star">
                    {Array.from({
                      length:
                        product.review.reduce(
                          (a, b) => a + b.p_review_star,
                          0
                        ) / product.review.length,
                    }).map((e, i) => (
                      <img
                        width={"20px"}
                        key={i}
                        src="../star.svg"
                        alt="star"
                      />
                    ))}
                    <p>
                      {(
                        product.review.reduce(
                          (a, b) => a + b.p_review_star,
                          0
                        ) / product.review.length
                      ).toFixed(1)}
                    </p>
                    <p>({product.review.length})</p>
                  </div>
                ) : (
                  <div className="s-b-i-s-new">New!</div>
                )}
                <h5>{formatCurrency(product.product_price)}</h5>
                <br />
                <p>{product.product_desc}</p>
                <br />
                <h6>Color :</h6>
                <div className="sp-p-d-colorwrap">
                  {product.product_detail.map((e, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setColor(e.p_detail_color);
                        setIndexImage(i);
                      }}
                      className={`sp-p-d-colorlist ${
                        color == e.p_detail_color ? "sp-p-d-colorlist-on" : ""
                      }`}
                    >
                      <p>{e.p_detail_color}</p>
                    </div>
                  ))}
                </div>
                <h6>Size :</h6>
                <div className="sp-p-d-colorwrap">
                  {product.product_size.map((e, i) => (
                    <div
                      key={i}
                      onClick={() => setSize(e)}
                      className={`sp-p-d-colorlist ${
                        size == e ? "sp-p-d-colorlist-on" : ""
                      }`}
                    >
                      <p>{e}</p>
                    </div>
                  ))}
                </div>
                <h6>Quantity :</h6>
                <div className="sp-p-d-quantity">
                  <button>
                    <img
                      onClick={() =>
                        quantity > 1 ? setQuantity(quantity - 1) : null
                      }
                      src="../minus.svg"
                      alt="minus"
                      width={"20px"}
                    />
                  </button>
                  <p>{quantity}</p>
                  <button>
                    <img
                      onClick={() => setQuantity(quantity + 1)}
                      src="../plus.svg"
                      alt="plus"
                      width={"20px"}
                    />
                  </button>
                </div>
                <br />
                <button onClick={handleCart} className="sp-p-d-cart">
                  Add to cart
                </button>
                <p className="error-font">{inputError}</p>
              </div>
            </div>
            <div className="sp-review">
              <h5>Reviews</h5>
              <br />
              <div className="sp-r-wrap">
                {product.review[0] ? (
                  product.review.map((e, i) => (
                    <div key={i} className="sp-r-w-list">
                      <img
                        style={{
                          width: "40px",
                          aspectRatio: "1/1",
                          objectFit: "cover",
                          objectPosition: "center",
                          borderRadius: "50%",
                        }}
                        src={
                          e.user.user_image
                            ? storage.getFilePreview(
                                import.meta.env.VITE_APPWRITE_BUCKET,
                                e.user.user_image
                              )
                            : "../user.svg"
                        }
                        alt="user profil"
                      />
                      <span>
                        <p style={{ fontWeight: "700" }}>{e.user.user_name}</p>
                        {Array.from({ length: e.p_review_star }).map((e, i) => (
                          <img
                            key={i}
                            width={"20px"}
                            src="../star.svg"
                            alt="star"
                          />
                        ))}
                        <p>{e.p_review_comment}</p>
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "grey" }}>Belum ada Review</p>
                )}
              </div>
            </div>
            <div className="sp-related">
              <h5>Related Product</h5>
              <br />
              <div className="sp-re-wrap">
                {allProduct
                  .filter(
                    (e) =>
                      e.product_category[0].p_category_name ==
                      product.product_category[0].p_category_name
                  )
                  .filter((e) => e.$id !== product.$id)
                  .slice(0, 8)
                  .map((e, i) => (
                    <div
                      onClick={() =>
                        window.open(
                          `${import.meta.env.VITE_DOMAIN}store/${e.$id}`
                        )
                      }
                      key={i}
                      className="sp-re-w-list"
                    >
                      <img
                        style={{
                          borderRadius: "10px 10px 0 0",
                          aspectRatio: "1/1",
                        }}
                        width={"350px"}
                        src={storage.getFilePreview(
                          import.meta.env.VITE_APPWRITE_BUCKET,
                          e.product_detail[0].p_detail_image
                        )}
                        alt="image list"
                      />
                      <div className="s-b-i-wrap">
                        <h6>{e.product_name}</h6>
                        {/* star________________________ */}
                        {e.review.length !== 0 ? (
                          <div className="s-b-i-star">
                            {Array.from({
                              length:
                                e.review.reduce(
                                  (a, b) => a + b.p_review_star,
                                  0
                                ) / e.review.length,
                            }).map((e, i) => (
                              <img
                                width={"20px"}
                                key={i}
                                src="../star.svg"
                                alt="star"
                              />
                            ))}
                            <p>
                              {(
                                e.review.reduce(
                                  (a, b) => a + b.p_review_star,
                                  0
                                ) / e.review.length
                              ).toFixed(1)}
                            </p>
                          </div>
                        ) : (
                          <div className="s-b-i-s-new">New!</div>
                        )}
                        {/* ____________________________ */}
                        <p>{formatCurrency(e.product_price)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
