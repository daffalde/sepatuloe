import { useEffect, useState } from "react";
import { database, storage } from "../components/Client";
import Navbar from "../components/Navbar";
import "../style/store.css";
import { formatCurrency } from "../components/Currency";
import Footer from "../components/Footer";

export default function Store() {
  const [loading, setLoading] = useState(true);
  // get data product
  const [dataproduct, setDataproduct] = useState([]);
  const [cat, setCat] = useState([]);
  const [brand, setBrand] = useState([]);
  async function getProduct() {
    setLoading(true);
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_PRODUCT
      );
      setDataproduct(resp.documents);
      const resp2 = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CATEGORY
      );
      setCat(resp2.documents);
      const resp1 = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_BRAND
      );
      setBrand(resp1.documents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // filter
  const [selectcat, setSelectcat] = useState("");
  const [selectbrand, setSelectbrand] = useState("");
  const [selectsort, setSelectsort] = useState("");
  const [selectsearch, setSelectsearch] = useState("");

  useEffect(() => {
    getProduct();
    console.log(selectcat);
  }, []);

  // pagignation
  const [page, setPage] = useState(1);
  const maxItem = 20;

  const lastIndex = page * maxItem;
  const firstIndex = lastIndex - maxItem;
  const itemList = dataproduct.slice(firstIndex, lastIndex);

  return (
    <>
      <Navbar />
      <div className="navbar-in"></div>
      <div className="container">
        {loading ? (
          <div className="loading3">
            <img src="./loading.svg" alt="loading" />
          </div>
        ) : (
          <div className="store">
            <div className="s-head">
              <div className="s-h-filter">
                <select
                  value={selectcat}
                  onChange={(e) => setSelectcat(e.target.value)}
                >
                  <option value="">All Category</option>
                  {cat.map((e, i) => (
                    <option key={i} value={e.p_category_name}>
                      {e.p_category_name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectbrand}
                  onChange={(e) => setSelectbrand(e.target.value)}
                >
                  <option value="">All Brand</option>
                  {brand.map((e, i) => (
                    <option key={i} value={e.p_brand_name}>
                      {e.p_brand_name}
                    </option>
                  ))}
                </select>
                <span>
                  <p>Sort by: </p>
                  <select
                    value={selectsort}
                    onChange={(e) => setSelectsort(e.target.value)}
                  >
                    <option value="baru">Newest</option>
                    <option value="murah">Low to High</option>
                    <option value="mahal">High to Low</option>
                    <option value="best">Best Seller</option>
                  </select>
                </span>
              </div>
              <input
                value={selectsearch}
                onChange={(e) => setSelectsearch(e.target.value)}
                className="s-h-f-search"
                type="text"
                placeholder="Search for Shoes...."
              />
            </div>
            <div className="s-body">
              {itemList
                .sort((a, b) =>
                  selectsort == "baru"
                    ? new Date(b.$createdAt) - new Date(a.$createdAt)
                    : selectsort == "murah"
                    ? a.product_price - b.product_price
                    : selectsort == "mahal"
                    ? b.product_price - a.product_price
                    : selectsort == "best"
                    ? b.review.length - a.review.length
                    : null
                )
                .filter((e) =>
                  e.product_name.toLowerCase().includes(selectsearch)
                )
                .filter((e) =>
                  e.product_category[0].p_category_name
                    .toLowerCase()
                    .includes(selectcat.toLocaleLowerCase())
                )
                .filter((e) =>
                  e.product_brand.p_brand_name
                    .toLowerCase()
                    .includes(selectbrand.toLocaleLowerCase())
                )
                .map((e, i) => (
                  <div
                    onClick={() => window.open(`/store/${e.$id}`)}
                    key={i}
                    className="s-b-wrap"
                  >
                    <div className="s-b-item">
                      <div className="s-b-i-bg">
                        <div>View product</div>
                      </div>
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
                                src="./star.svg"
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
                  </div>
                ))}
            </div>
            <div className="pagignation">
              <button
                className="pagig-button "
                onClick={() => (page > 1 ? setPage(page - 1) : null)}
              >
                <img src="./left.svg" alt="left arrow" width={"20px"} />
              </button>
              {Array.from({
                length: Math.ceil(dataproduct.length / maxItem),
              }).map((e, i) => (
                <button
                  className={`pagig-button ${
                    i + 1 == page ? "pagig-button-on" : ""
                  }`}
                  onClick={() => setPage(i + 1)}
                  key={i}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="pagig-button "
                onClick={() =>
                  page < Math.ceil(dataproduct.length / maxItem)
                    ? setPage(page + 1)
                    : null
                }
              >
                <img src="./right.svg" alt="right arrow" width={"20px"} />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
