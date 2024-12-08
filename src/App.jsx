import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./assets/pages/Test";
import Dashboard from "./assets/pages/dashboard/Dashboard";
import Login from "./assets/pages/Login";
import Signup from "./assets/pages/Signup";
import Otp from "./assets/pages/Otp";
import Recovery from "./assets/pages/Recovery";
import { useEffect } from "react";
import { account, database } from "./assets/components/Client";
import Cookies from "js-cookie";
import axios from "axios";
import { Query } from "appwrite";
import Home from "./assets/pages/Home";
import Store from "./assets/pages/Store";

function App() {
  async function getUser() {
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/signup" &&
      window.location.pathname !== "/recovery" &&
      window.location.pathname !== "/otp"
    ) {
      try {
        const resp1 = await account.get();
        console.log(resp1);
        if (!resp1.emailVerification) {
          await axios.delete(
            `https://cloud.appwrite.io/v1/users/${resp1.$id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "X-Appwrite-Response-Format": "1.6.0",
                "X-Appwrite-Project": import.meta.env.VITE_APPWRITE_PROJECT,
                "X-Appwrite-Key": import.meta.env.VITE_APPWRITE_API,
              },
            }
          );
        } else {
          const cekUser = await database.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE,
            import.meta.env.VITE_APPWRITE_USER,
            [Query.contains("$id", resp1.$id)]
          );
          if (cekUser.total == 0) {
            const resp2 = await database.createDocument(
              import.meta.env.VITE_APPWRITE_DATABASE,
              import.meta.env.VITE_APPWRITE_USER,
              resp1.$id,
              {
                user_name: resp1.name,
                user_email: resp1.email,
              }
            );
            Cookies.set("user", JSON.stringify(resp2));
          } else {
            Cookies.set("user", JSON.stringify(cekUser.documents[0]));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/test" Component={Test} />
          {/* dashboard admin */}
          <Route path="/dashboard" Component={Dashboard} />

          {/* pages */}
          <Route path="/" Component={Home} />
          <Route path="/store" Component={Store} />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Signup} />
          <Route path="/otp" Component={Otp} />
          <Route path="/recovery" Component={Recovery} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
