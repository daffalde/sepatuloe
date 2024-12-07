import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../../style/dashboard.css";
import { useEffect, useState } from "react";
import { account, storage } from "../../components/Client";
import { use } from "react";
import User from "./User";
import Produk from "./Produk";

export default function Dashboard() {
  const nav = useNavigate();
  // cek user

  useEffect(() => {
    try {
      if (
        JSON.parse(Cookies.get("user")).$id !== import.meta.env.VITE_ADMIN_ID
      ) {
        nav("/");
      }
    } catch (e) {
      nav("/");
    }
  }, []);
  const user = JSON.parse(Cookies.get("user"));
  const [select, setSelect] = useState("User");
  const [profile, setProfile] = useState(false);

  // logout
  async function handleLogout() {
    try {
      Cookies.remove("user");
      await account.deleteSessions();
    } catch (e) {
      console.error(e);
    } finally {
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
            style={{ backgroundColor: `${select == "User" ? "#363779" : ""}` }}
            className="d-n-button"
          >
            <img src="./d-user.svg" alt="user" width={"20px"} />
            <p>User</p>
          </button>
          <button
            onClick={() => setSelect("Produk")}
            style={{
              backgroundColor: `${select == "Produk" ? "#363779" : ""}`,
            }}
            className="d-n-button"
          >
            <img src="./d-product.svg" alt="user" width={"20px"} />
            <p>Produk</p>
          </button>
        </div>
        <div className="d-content">
          <div className="d-c-head">
            <h5>{select}</h5>
            <div onClick={() => setProfile(!profile)} className="d-c-h-profil">
              <img
                width={"50px"}
                src={`${
                  user.user_image !== null
                    ? storage.getFilePreview(
                        import.meta.env.VITE_APPWRITE_BUCKET,
                        user.user_image
                      )
                    : "./d-profil.svg"
                }`}
                alt="profil"
              />
              <p>{user.user_name}</p>
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
                      user.user_image !== null
                        ? storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            user.user_image
                          )
                        : "./d-profil.svg"
                    }`}
                    alt="profil"
                  />
                  <span>
                    <h6>{user.user_name}</h6>
                    <p>{user.user_email}</p>
                  </span>
                </div>
                <br />
                <div className="d-c-h-p-s-button">
                  <button>Profile</button>
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              </div>
            )}
          </div>
          {select == "User" ? <User /> : select == "Produk" ? <Produk /> : null}
        </div>
      </div>
    </>
  );
}
