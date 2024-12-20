import { useEffect } from "react";
import { account, database } from "../components/Client";
import Cookies from "js-cookie";

export default function Test() {
  async function det() {
    try {
      console.log("cheking...");
      const a = await database.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE,
        import.meta.env.VITE_APPWRITE_CART
      );
      console.log(a);
    } catch (e) {
      console.error(e);
    } finally {
      console.log("done");
    }
  }
  useEffect(() => {
    det();
  }, []);

  function tombol() {
    console.log(account.get());
  }

  // logout
  async function logout() {
    try {
      Cookies.remove("user");
      Cookies.remove("id");
      await account.deleteSessions();
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <>
      <div className="container">
        <h1>test</h1>
        <button onClick={logout}>logout</button>
        <button onClick={tombol}>tombol</button>
      </div>
    </>
  );
}
