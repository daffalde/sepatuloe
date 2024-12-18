import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../style/home.css";
import { database, storage } from "../components/Client";
import { formatCurrency } from "../components/Currency";

export default function Home() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingdata, setLoadingdata] = useState(false);

  // data
  const [sell, setSell] = useState([]);
  async function getSell() {
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_PRODUCT
      );
      setSell(resp.documents);
      console.log(resp.documents);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingdata(true);
    }
  }

  useEffect(() => {
    getSell();
  }, []);

  // benefit
  const benefit = [
    {
      id: 1,
      img: "1",
      title: "Kualitas Terjamin",
      desc: "Sepatu lokal kami dibuat dengan bahan berkualitas tinggi untuk daya tahan maksimal",
    },
    {
      id: 2,
      img: "2",
      title: "Desain Eksklusif",
      desc: "Temukan berbagai desain unik yang tidak akan Anda temukan di tempat lain",
    },
    {
      id: 3,
      img: "3",
      title: "Nyaman Dipakai",
      desc: "Setiap sepatu dirancang untuk kenyamanan optimal sepanjang hari",
    },
    {
      id: 4,
      img: "4",
      title: "Pengiriman Cepat dan Aman",
      desc: "Kami memastikan sepatu Anda sampai dengan cepat dan dalam kondisi sempurna",
    },
  ];

  const brand = [
    {
      id: 1,
      img: "1",
    },
    {
      id: 2,
      img: "2",
    },
    {
      id: 3,
      img: "3",
    },
    {
      id: 4,
      img: "4",
    },
    {
      id: 5,
      img: "5",
    },
  ];
  return (
    <>
      <>
        <Navbar />
        <div className="navbar-in"></div>
        <div className="container">
          <div className="h-hero">
            <h1 style={{ width: "80%" }}>
              Jelajahi Sepatu Lokal Indonesia Gaya, Nyaman, dan Berkualitas!
            </h1>
            <br />
            <button className="h-button1" onClick={() => nav("/store")}>
              Shop Now
            </button>
          </div>
          <div className="h-selling">
            <h4>Best Selling</h4>
            <div className="h-s-content">
              <div className="h-s-c-in">
                {loadingdata &&
                  sell.slice(0, 4).map((e, i) => (
                    <div
                      onClick={() => window.open(`/store/${e.$id}`)}
                      className="h-s-c-i-list"
                      key={i}
                    >
                      <img
                        src={storage.getFilePreview(
                          import.meta.env.VITE_APPWRITE_BUCKET,
                          e.product_detail[0].p_detail_image
                        )}
                        alt="img list"
                      />
                      <br />
                      <br />
                      <h6>{e.product_name}</h6>
                      <p>{formatCurrency(e.product_price)}</p>
                      <br />
                    </div>
                  ))}
              </div>
              <div className="h-s-c-in2">
                <h3 style={{ width: "80%" }}>
                  Sepatu Lokal Terlaris di Indonesia yang Wajib Dimiliki!
                </h3>
                <br />
                <button className="h-button1" onClick={() => nav("/store")}>
                  Shop Now
                </button>
              </div>
            </div>
          </div>
          <div className="h-benefit">
            <h4>Benefit</h4>
            <br />
            <div className="h-b-content">
              {benefit.map((e, i) => (
                <div className="h-b-c-list" key={i}>
                  <img src={`./benefit${e.img}.svg`} alt="benefit img" />
                  <h6>{e.title}</h6>
                  <p>{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-about">
            <div className="h-a-menu1"></div>
            <div className="h-a-menu2">
              <h3>About</h3>
              <br />
              <p>
                Selamat datang di Sepatu Loe, destinasi utama untuk sepatu lokal
                terbaik di Indonesia. Kami bangga menyajikan pilihan sepatu yang
                tidak hanya memikat dengan desainnya, tetapi juga menjunjung
                tinggi kualitas dan kenyamanan. Setiap pasang sepatu yang kami
                tawarkan adalah hasil karya para pengrajin lokal yang memiliki
                dedikasi tinggi terhadap detail dan seni pembuatan sepatu. Di
                sini, Anda akan menemukan berbagai model sepatu yang sesuai
                untuk segala kesempatan, mulai dari sehari-hari hingga acara
                spesial.
                <br />
                <br />
                kami percaya bahwa sepatu bukan sekadar pelindung kaki, tetapi
                juga cerminan gaya dan kepribadian Anda. Oleh karena itu, kami
                selalu berupaya menghadirkan koleksi terbaru yang mengikuti tren
                fashion terkini sambil tetap menjaga sentuhan khas Indonesia.
              </p>
              <br />
              <button onClick={() => nav("/about")} className="h-button2">
                Learn More
              </button>
            </div>
          </div>
          <div className="h-brand">
            <h4>Brands</h4>
            <br />
            <div className="h-b-content">
              {brand.map((e, i) => (
                <img key={i} src={`./brand${e.img}.png`} alt="brands image" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    </>
  );
}
