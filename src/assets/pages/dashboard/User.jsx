import { useEffect, useRef, useState } from "react";
import { database, storage } from "../../components/Client";
import Cookies from "js-cookie";
import axios from "axios";
import { ID } from "appwrite";

export default function User() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  async function getUser() {
    setLoading(true);
    try {
      const resp = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER
      );
      setData(resp.documents);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  //   delete user
  async function deleteUser(e) {
    try {
      await axios.delete(`https://cloud.appwrite.io/v1/users/${e}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Response-Format": "1.6.0",
          "X-Appwrite-Project": import.meta.env.VITE_APPWRITE_PROJECT,
          "X-Appwrite-Key": import.meta.env.VITE_APPWRITE_API,
        },
      });
      await database.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        e
      );
    } catch (e) {
      console.error(e);
    } finally {
      getUser();
    }
  }

  //   edit
  const [edit, setEdit] = useState(false);
  const [dataedit, setDataedit] = useState();

  async function getEdit(e) {
    setLoading(true);
    setEdit(true);

    try {
      const resp = await database.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        e
      );
      setDataedit(resp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  //   edit profile
  const [file, setFile] = useState();

  async function profil(e) {
    e.preventDefault();
    try {
      const resp1 = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET,
        ID.unique(),
        file
      );
      await database.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        dataedit.$id,
        {
          user_image: resp1.$id,
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  }

  const name = useRef("");
  const phone = useRef("");
  const address = useRef("");

  async function identity(e) {
    e.preventDefault();
    try {
      await database.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_USER,
        dataedit.$id,
        {
          user_name: name.current.value,
          user_phone: phone.current.value,
          user_address: address.current.value,
        }
      );
    } catch (e) {
      console.error(e);
    } finally {
      window.location.reload();
    }
  }

  // search
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="d-search">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search Name or Email...."
        />
      </div>
      {loading ? (
        <div className="loading2">
          <img src="./loading.svg" alt="loading" />
        </div>
      ) : (
        <div className="d-in">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((e) => e.$id !== import.meta.env.VITE_ADMIN_ID)
                .filter(
                  (e) =>
                    e.user_name.toLowerCase().includes(search.toLowerCase()) ||
                    e.user_email.toLowerCase().includes(search.toLowerCase())
                )
                .map((e, i) => (
                  <tr key={i}>
                    <td>{e.$id}</td>
                    <td>
                      <span className="d-u-s1">
                        <img
                          style={{
                            aspectRatio: "1/1",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: "50%",
                          }}
                          width={"50px"}
                          src={`${
                            e.user_image !== null
                              ? storage.getFilePreview(
                                  import.meta.env.VITE_APPWRITE_BUCKET,
                                  e.user_image
                                )
                              : "./d-profil.svg"
                          }`}
                          alt="profil"
                        />
                        <p>{e.user_name}</p>
                      </span>
                    </td>
                    <td>{e.user_email}</td>
                    <td>{e.user_phone !== null ? e.user_phone : "null"}</td>
                    <td>
                      <span
                        className="d-u-s2"
                        style={{
                          textAlign: `${
                            e.user_address !== null ? "start" : "center"
                          }`,
                        }}
                      >
                        {e.user_address !== null ? e.user_address : "null"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => getEdit(e.$id)}
                        className="table-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(e.$id)}
                        className="table-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {edit && (
            <>
              <div onClick={() => setEdit(false)} className="d-in-edit"></div>
              {loading == false && (
                <div className="d-i-e-content">
                  <h4>Edit</h4>
                  <br />
                  <img
                    width={"150px"}
                    style={{
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      objectPosition: "center",
                      border: "3px solid grey",
                      borderRadius: "5px",
                    }}
                    src={
                      dataedit.user_image !== null
                        ? storage.getFilePreview(
                            import.meta.env.VITE_APPWRITE_BUCKET,
                            dataedit.user_image
                          )
                        : "./d-profil.svg"
                    }
                    alt="profile"
                  />
                  <form onSubmit={profil}>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button>Ganti Profile</button>
                  </form>
                  <br />
                  <form onSubmit={identity}>
                    <p>Name :</p>
                    <input
                      ref={name}
                      type="text"
                      placeholder={dataedit.user_name}
                    />
                    <br />
                    <p>Phone :</p>
                    <input
                      ref={phone}
                      type="text"
                      placeholder={dataedit.user_phone}
                    />
                    <br />
                    <p>Address :</p>
                    <textarea
                      ref={address}
                      placeholder={dataedit.user_address}
                    ></textarea>
                    <br />
                    <br />
                    <button>Update</button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
