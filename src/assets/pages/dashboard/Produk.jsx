import { useEffect, useRef, useState } from "react";
import { database, storage } from "../../components/Client";
import { ID, Query } from "appwrite";

export default function Produk() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  //   format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  async function getData() {
    setLoading(true);
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_PRODUCT
      );
      setData(resp.documents);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  //   select brand______________________________________
  const [brand, setBrand] = useState(false);
  const [databrand, setDatabrand] = useState([]);
  const brandInput = useRef("");

  async function getBrand() {
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_BRAND
      );
      setDatabrand(resp.documents);
    } catch (e) {
      console.error(e);
    }
  }

  async function inputBrand(e) {
    e.preventDefault();
    try {
      await database.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_BRAND,
        ID.unique(),
        {
          p_brand_name: brandInput.current.value,
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      getBrand();
    }
  }

  async function deleteBrand(e) {
    try {
      await database.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_BRAND,
        e
      );
    } catch (e) {
      console.error(e);
    } finally {
      getBrand();
    }
  }

  //   select category______________________________________
  const [cat, setCat] = useState(false);
  const [datacat, setDatacat] = useState([]);
  const catInput = useRef("");

  async function getCat() {
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CATEGORY
      );
      setDatacat(resp.documents);
    } catch (e) {
      console.error(e);
    }
  }

  async function inputCat(e) {
    e.preventDefault();
    try {
      await database.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CATEGORY,
        ID.unique(),
        {
          p_category_name: catInput.current.value,
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      getCat();
    }
  }

  async function deleteCat(e) {
    try {
      await database.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CATEGORY,
        e
      );
    } catch (e) {
      console.error(e);
    } finally {
      getCat();
    }
  }

  //   input product_______________________________________
  const [produk, setProduk] = useState(false);

  //   image color
  const [detailproduk, setDetailproduk] = useState([]);

  function handleChange(index, value) {
    setDetailproduk((prevDetailproduk) =>
      prevDetailproduk.map((e, i) => (i === index ? { ...e, color: value } : e))
    );
  }

  const handleDeleteProduct = (index) => {
    setDetailproduk((prevDetailproduk) =>
      prevDetailproduk.filter((_, i) => i !== index)
    );
  };

  const handleFileChange = (index, file) => {
    const preview = URL.createObjectURL(file);
    setDetailproduk((prevDetailproduk) =>
      prevDetailproduk.map((e, i) =>
        i === index ? { ...e, file, preview } : e
      )
    );
    return () => URL.revokeObjectURL(preview);
  };

  const [pname, setPname] = useState("");
  const [pprice, setPprice] = useState();
  const [psize, setPsize] = useState("");
  const [pbrand, setPbrand] = useState("");
  const [pcat, setPcat] = useState("");
  const [pdesc, setPdesc] = useState("");

  async function handleadddata(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // cari brand+kategori
      const brand = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_BRAND,
        [Query.contains("p_brand_name", pbrand)]
      );
      const cat = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CATEGORY,
        [Query.contains("p_category_name", pcat)]
      );

      //   input data
      const updata = await database.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_PRODUCT,
        ID.unique(),
        {
          product_name: pname,
          product_price: parseInt(pprice),
          product_desc: pdesc,
          product_size: psize.split(","),
          product_category: [cat.documents[0].$id],
          product_brand: brand.documents[0].$id,
        }
      );
      const setid = updata.$id;
      console.log(setid);
      for (let i = 0; i < detailproduk.length; i++) {
        const upfile = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET,
          ID.unique(),
          detailproduk[i].file
        );
        console.log(upfile.$id);
        await database.createDocument(
          import.meta.env.VITE_APPWRITE_DATABASE,
          import.meta.env.VITE_APPWRITE_DETAIL,
          ID.unique(),
          {
            p_detail_image: upfile.$id,
            p_detail_color: detailproduk[i].color,
            product: setid,
          }
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  }
  // ____________________________________________________________________

  //   handle delete
  async function handleDelete(e) {
    setLoading(true);
    try {
      const data = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_PRODUCT,
        e
      );
      for (let i = 0; i < data.product_detail.length; i++) {
        await storage.deleteFile(
          import.meta.env.VITE_APPWRITE_BUCKET,
          data.product_detail[i].p_detail_image
        );
      }
      await database.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_PRODUCT,
        e
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      getData();
    }
  }

  useEffect(() => {
    getData();
    getBrand();
    getCat();
  }, []);

  const [search, setSearch] = useState("");
  return (
    <>
      <div className="d-search">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search Product...."
        />
      </div>
      <div className="d-in2">
        <div className="d-i-head">
          <div onClick={() => setProduk(true)} className="d-i-h-content">
            <img src="./d-plus.svg" alt="plus" width={"25px"} />
            <h6>Product</h6>
          </div>
          <div onClick={() => setBrand(true)} className="d-i-h-content">
            <img src="./d-plus.svg" alt="plus" width={"25px"} />
            <h6>Brand</h6>
          </div>
          <div onClick={() => setCat(true)} className="d-i-h-content">
            <img src="./d-plus.svg" alt="plus" width={"25px"} />
            <h6>Category</h6>
          </div>
        </div>
        <br />
        <div className="d-i-content">
          {loading ? (
            <div className="loading2">
              <img src="./loading.svg" alt="loading" />
            </div>
          ) : (
            <table className="d-i-c-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((e) =>
                    e.product_name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((e, i) => (
                    <tr key={i}>
                      <td>{e.$id}</td>
                      <td>
                        <span className="d-i-c-t1">
                          <img
                            width={"100px"}
                            src={storage.getFilePreview(
                              import.meta.env.VITE_APPWRITE_BUCKET,
                              e.product_detail[0].p_detail_image
                            )}
                            alt="img product"
                          />
                          <p>{e.product_name}</p>
                        </span>
                      </td>
                      <td>{formatCurrency(e.product_price)}</td>
                      <td>{e.product_brand.p_brand_name}</td>
                      <td>
                        <div className="d-i-c-t2">
                          {e.product_category.map((e, i) => (
                            <p key={i}>{e.p_category_name}</p>
                          ))}
                        </div>
                      </td>
                      <td>{e.product_size.join(",")}</td>
                      <td>
                        {e.product_detail.map((detail, i) => (
                          <span key={i}>
                            {" "}
                            {detail.p_detail_color}
                            {i < e.product_detail.length - 1 ? ", " : ""}{" "}
                          </span>
                        ))}
                      </td>
                      <td>
                        <div className="d-i-c-t3">{e.product_desc}</div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(e.$id)}
                          className="table-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Input data */}

      {/* select bg */}
      {(brand || cat || produk) && (
        <div
          onClick={() => {
            setBrand(false);
            setCat(false);
            setProduk(false);
          }}
          className="d-i-addbg"
        ></div>
      )}
      {/* brand */}
      {brand && (
        <div className="d-i-bc">
          <h5>Input Brand</h5>
          <br />
          <form onSubmit={inputBrand}>
            <input ref={brandInput} type="text" placeholder="Brand...." />
            <button>Input</button>
          </form>
          <br />
          <h5>Brand List:</h5>
          <div className="d-i-bc-content">
            {databrand
              .sort((a, b) => a.p_brand_name.localeCompare(b.p_brand_name))
              .map((e, i) => (
                <div key={i} className="d-i-bc-c-list">
                  <p>{e.p_brand_name}</p>
                  <button
                    onClick={() => deleteBrand(e.$id)}
                    className="d-i-bc-c-l-button"
                  >
                    <img width={"20px"} src="./d-trash.svg" alt="trash" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
      {/* category */}
      {cat && (
        <div className="d-i-bc">
          <h5>Input Category</h5>
          <br />
          <form onSubmit={inputCat}>
            <input ref={catInput} type="text" placeholder="Brand...." />
            <button>Input</button>
          </form>
          <br />
          <h5>Category List:</h5>
          <div className="d-i-bc-content">
            {datacat
              .sort((a, b) =>
                a.p_category_name.localeCompare(b.p_category_name)
              )
              .map((e, i) => (
                <div key={i} className="d-i-bc-c-list">
                  <p>{e.p_category_name}</p>
                  <button
                    onClick={() => deleteCat(e.$id)}
                    className="d-i-bc-c-l-button"
                  >
                    <img width={"20px"} src="./d-trash.svg" alt="trash" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
      {/* product */}
      {produk && (
        <div className="d-i-produk">
          <div className="d-i-p-content">
            <h5>Input Image & Color</h5>
            <br />
            <div className="d-i-p-c-body">
              {/* ____________________________________________________________ */}
              {detailproduk
                ? detailproduk.map((e, i) => (
                    <div key={i} className="d-i-p-c-b-list">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(i, e.target.files[0])}
                      />

                      <img
                        className="d-i-p-c-b-l-img"
                        src={e.preview ? e.preview : "./d-pic.svg"}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />

                      <input
                        value={e.color}
                        onChange={(e) => handleChange(i, e.target.value)}
                        type="text"
                        placeholder="Color...."
                      />
                      <button
                        onClick={() => handleDeleteProduct(i)}
                        className="d-i-bc-c-l-button"
                      >
                        <img width={"20px"} src="./d-trash.svg" alt="trash" />
                      </button>
                    </div>
                  ))
                : null}
              <div
                onClick={() => {
                  setDetailproduk([
                    ...detailproduk,
                    { img: null, color: null },
                  ]);
                  console.log(detailproduk);
                }}
                className="d-i-p-c-b-add"
              >
                <img height={"25px"} src="./d-plusinput.svg" alt="plus" />
              </div>
            </div>
          </div>

          {/* ____________________________________________________________ */}

          <div className="d-i-p-content">
            <h5>Input Detail Product</h5>
            <br />
            <div className="d-i-p-c-input">
              <p>Name :</p>
              <input
                value={pname}
                onChange={(e) => setPname(e.target.value)}
                type="text"
                placeholder="Shoes...."
              />
            </div>
            <br />
            <div className="d-i-p-c-input">
              <p>Price :</p>
              <input
                value={pprice}
                onChange={(e) => setPprice(e.target.value)}
                type="number"
                placeholder="500000...."
              />
            </div>
            <br />
            <div className="d-i-p-c-input">
              <p>Size :</p>
              <input
                value={psize}
                onChange={(e) => setPsize(e.target.value)}
                type="text"
                placeholder="40,41,42...."
              />
            </div>
            <br />
            <div className="d-i-p-c-input">
              <p>Brand :</p>
              <select
                value={pbrand}
                onChange={(e) => setPbrand(e.target.value)}
              >
                <option value="#">Select Brand</option>
                {databrand.map((e, i) => (
                  <option key={i} value={e.p_brand_name}>
                    {e.p_brand_name}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div className="d-i-p-c-input">
              <p>Category :</p>
              <select value={pcat} onChange={(e) => setPcat(e.target.value)}>
                <option value="#">Select Category</option>

                {datacat.map((e, i) => (
                  <option key={i} value={e.p_category_name}>
                    {e.p_category_name}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div className="d-i-p-c-input">
              <p>Description :</p>
              <textarea
                value={pdesc}
                onChange={(e) => setPdesc(e.target.value)}
                placeholder="Desc of product...."
              ></textarea>
            </div>
            <br />
            <div className="d-i-p-c-button">
              <button onClick={() => setProduk(false)}>Cancel</button>
              <button onClick={handleadddata}>Send</button>
            </div>
            <p>*Penting!</p>
            <p>1. Ukuran tiap foto harus dibawah 50kb</p>
            <p>2. Aspect ratio foto harus 1:1</p>
            <p>3. Penulisan size/ukuran sepatu harus dipisah dengan koma(,)</p>
            <p>
              4. Penulisan price/harga tidak perlu titik atau currency,hanya
              angka saja
            </p>
          </div>
        </div>
      )}
    </>
  );
}
