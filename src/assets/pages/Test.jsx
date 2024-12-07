import { createClient } from "@supabase/supabase-js";
import { Client } from "appwrite";
import { useEffect } from "react";
import { account, database } from "../components/Client";
import Cookies from "js-cookie";
import axios from "axios";

export default function Test() {
  async function getProduk() {
    try {
      const resp = await account.get();

      if (!resp.emailVerification) {
        console.log("false");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete() {
    try {
      const resp = await axios.delete(
        `https://cloud.appwrite.io/v1/users/${
          JSON.parse(Cookies.get("user")).$id
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Response-Format": "1.6.0",
            "X-Appwrite-Project": "6751acf100395684669b",
            "X-Appwrite-Key":
              "standard_392651d20a6e793148622276048f347c0045d9931e5f47348d69036d44f1afe33909d92d9ad6a0dd535bc6109837b5f7875124142889c68747c02c54a7e018fb975631d01895a912aef496598a50a4d08b6e579258aaa3584d2fd2ccf40a496d834781647ce914e17c3877eea4fcc085d85efdea76669046a1b85c66f0c58c5a",
          },
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getProduk();
  }, []);

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
        <button onClick={handleDelete}>delete</button>
        <button onClick={logout}>logout</button>
      </div>
    </>
  );
}
