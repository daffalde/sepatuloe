import { createClient } from "@supabase/supabase-js";
import { Client } from "appwrite";
import { useContext, useEffect, useState } from "react";
import { account, database } from "../components/Client";
import Cookies from "js-cookie";

export default function Test() {
  function tombol() {
    console.log(account.get());
  }

  useEffect(() => {
    async function as() {
      try {
        const resp = await database.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE,
          import.meta.env.VITE_APPWRITE_PRODUCT
        );
        console.log(resp);
      } catch (e) {
        console.log(e);
      }
    }
    as();
  }, []);
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
