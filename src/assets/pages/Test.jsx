import { createClient } from "@supabase/supabase-js";
import { Client } from "appwrite";
import { useEffect, useState } from "react";
import { account, database } from "../components/Client";
import Cookies from "js-cookie";
import axios from "axios";

export default function Test() {
  const [data, setData] = useState();
  async function getProduk() {
    try {
      const resp = await account.get();
      Cookies.set("tes", JSON.stringify(resp));
      try {
        const a = JSON.parse(Cookies.get("tes"));
        setData(a);
      } catch (e) {
        console.log("ini error");
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getProduk();
  }, []);

  function tombol() {
    console.log(data);
  }

  // logout
  async function logout() {
    try {
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
