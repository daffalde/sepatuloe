import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../../style/dashboard.css";
import { useEffect, useState } from "react";
import { account, database, storage } from "../../components/Client";
import User from "./User";
import Produk from "./Produk";
import Orders from "./Orders";

export default function Dashboard() {
  const nav = useNavigate();
  // cek user
  const [user, setUser] = useState({});
  useEffect(() => {
    async function gett() {
      try {
        const us = await account.get();
        console.log(us);
        setUser(us);
        if (us.email !== import.meta.env.VITE_ADMIN) {
          nav("/");
        }
      } catch (e) {
        null;
      }
    }
    gett();
  }, []);
  const [select, setSelect] = useState("User");
  const [profile, setProfile] = useState(false);

  // logout
  async function handleLogout() {
    try {
      Cookies.remove("user");
      Cookies.remove("id");
      await account.deleteSessions();
    } catch (e) {
      console.error(e);
    } finally {
      nav("/");
      window.location.reload();
    }
  }
  return (
    <>
      <div className="dashboard">
        <div className="d-nav">
          <div className="d-n-head">
            <h4>Admin.</h4>
          </div>
          <br />
          <button
            onClick={() => setSelect("User")}
            style={{ backgroundColor: `${select === "User" ? "#363779" : ""}` }}
            className="d-n-button"
          >
            <img src="./d-user.svg" alt="user" width={"20px"} />
            <p>User</p>
          </button>
          <button
            onClick={() => setSelect("Produk")}
            style={{
              backgroundColor: `${select === "Produk" ? "#363779" : ""}`,
            }}
            className="d-n-button"
          >
            <img src="./d-product.svg" alt="user" width={"20px"} />
            <p>Produk</p>
          </button>
          <button
            onClick={() => setSelect("Orders")}
            style={{
              backgroundColor: `${select === "Orders" ? "#363779" : ""}`,
            }}
            className="d-n-button"
          >
            <img src="./order-white.svg" alt="user" width={"20px"} />
            <p>Order</p>
          </button>
        </div>
        <div className="d-content">
          <div className="d-c-head">
            <h5>{select}</h5>
            <div onClick={() => setProfile(!profile)} className="d-c-h-profil">
              <img
                width={"50px"}
                style={{
                  aspectRatio: "1/1",
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={`${
                  user.user_image
                    ? storage.getFilePreview(
                        import.meta.env.VITE_APPWRITE_BUCKET,
                        user.user_image
                      )
                    : "./d-profil.svg"
                }`}
                alt="profil"
              />
              <p>{user.name || "Guest"}</p>
              <img width={"25px"} src="./d-arrowdown.svg" alt="arrow" />
            </div>
            {profile && (
              <div className="d-c-h-profil-show">
                <div className="d-c-h-p-s-head">
                  <img
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    width={"70px"}
                    src={`${
                      user.user_image
                        ? storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            user.user_image
                          )
                        : "./d-profil.svg"
                    }`}
                    alt="profil"
                  />
                  <span>
                    <h6>{user.name || "Guest"}</h6>
                    <p>{user.email || "No Email"}</p>
                  </span>
                </div>
                <br />
                <div className="d-c-h-p-s-button">
                  <button onClick={() => nav("/setting")}>Profile</button>
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              </div>
            )}
          </div>
          {select === "User" ? (
            <User />
          ) : select === "Produk" ? (
            <Produk />
          ) : select === "Orders" ? (
            <Orders />
          ) : null}
        </div>
      </div>
    </>
  );
}
