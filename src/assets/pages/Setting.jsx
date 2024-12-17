import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/setting.css";
import { account, database, storage } from "../components/Client";
import { ID } from "appwrite";
import { data, useNavigate } from "react-router-dom";

export default function Setting() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
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

  async function getUser() {
    try {
      const resp1 = await account.get();
      const resp = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        resp1.$id
      );
      setUser(resp);
    } catch (e) {
      null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  async function changePic(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user.user_image) {
        const ambilidfoto = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET,
          ID.unique(),
          file
        );
        await database.updateDocument(
          import.meta.env.VITE_APPWRITE_DATABASE,
          import.meta.env.VITE_APPWRITE_USER,
          user.$id,
          {
            user_image: ambilidfoto.$id,
          }
        );
      } else {
        await storage.deleteFile(
          import.meta.env.VITE_APPWRITE_BUCKET,
          user.user_image
        );
        const ambilidfoto = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET,
          ID.unique(),
          file
        );
        await database.updateDocument(
          import.meta.env.VITE_APPWRITE_DATABASE,
          import.meta.env.VITE_APPWRITE_USER,
          user.$id,
          {
            user_image: ambilidfoto.$id,
          }
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      getUser();
    }
  }

  //   update data user info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  async function handleInfo(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await database.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        user.$id,
        {
          user_name: name == "" ? user.user_name : name,
          user_phone: phone == "" ? user.user_phone : phone,
          user_birthday: birth == "" ? user.user_birthday : birth,
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      getUser();
    }
  }

  //   address
  const [add, setAdd] = useState("");

  async function updateAdd(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await database.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        user.$id,
        {
          user_address: add == "" ? user.user_address : add,
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      getUser();
    }
  }

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
          <div className="setting">
            <div className="s-nav-wrap">
              <div className="s-nav">
                <h6 style={{ width: "100%", marginBottom: "10px" }}>General</h6>
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
                    src="./user-brown.svg"
                    alt="user"
                  />
                  Profile
                </button>
                <button>
                  <img
                    height={"25px"}
                    width={"25px"}
                    src="./order-brown.svg"
                    style={{ filter: "grayscale(100%)" }}
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
              <div className="s-c-img-wrap">
                <div className="s-c-image">
                  <img
                    src={`${
                      file
                        ? URL.createObjectURL(file)
                        : user?.user_image
                        ? storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            user.user_image
                          )
                        : "./user2.svg"
                    }`}
                    alt="user"
                  />
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                  />
                  {file && <button onClick={changePic}>Change Profile</button>}
                </div>
              </div>
              <div className="s-c-info1-wrap">
                <div className="s-c-info1">
                  <span>
                    <p>Name :</p>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder={
                        user.user_name ? user.user_name : "Your Name"
                      }
                    />
                  </span>
                  <span>
                    <p>Email :</p>
                    <input
                      style={{ pointerEvents: "none", cursor: "not-allowed" }}
                      value={user.user_email}
                      type="text"
                    />
                  </span>
                  <span>
                    <p>Phone :</p>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                      placeholder={
                        user.user_phone ? user.user_phone : "Your Phone Number"
                      }
                    />
                  </span>
                  <span>
                    <p>Birthday :</p>
                    <input
                      onChange={(e) => setBirth(e.target.value)}
                      type="Date"
                      value={birth || user.user_birthday}
                    />
                  </span>
                </div>
                <button onClick={handleInfo}>Save Changes</button>
              </div>
              <div className="s-c-info2">
                <h6>Address</h6>
                <p>
                  *Untuk saat ini, SepatuLoe hanya melayani pengiriman di area
                  Yogyakarta. Jika pengguna mencantumkan alamat di luar area
                  tersebut, admin akan menghubungi untuk melakukan refund.
                </p>
                <br />
                <textarea
                  value={add}
                  onChange={(e) => setAdd(e.target.value)}
                  placeholder={
                    user.user_address ? user.user_address : "Your Address"
                  }
                ></textarea>
                <button onClick={updateAdd}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
