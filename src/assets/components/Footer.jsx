import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [emailnotfi, setEmailnotif] = useState("");

  function sendEmail(e) {
    e.preventDefault();

    const templateEmail = {
      email: email,
      to_name: email,
    };

    try {
      emailjs.send(
        "service_yynca6q",
        "template_fw7th8d",
        templateEmail,
        "iJPY2GDKJ59B4-f70"
      );
    } catch (err) {
      console.log(err);
    } finally {
      setEmail("");
      setEmailnotif("*Email Terkirim");
    }
  }
  return (
    <>
      <div className="footer-container">
        <div className="footer">
          <div className="f-head">
            <ul>
              <li>
                <h6>Company</h6>
              </li>
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/store"}>Store</Link>
              </li>
              <li>
                <Link to={"/about"}>About</Link>
              </li>
            </ul>
            <ul>
              <li>
                <h6>Support</h6>
              </li>
              <li>
                <Link to={"/ship"}>Shipping Policy</Link>
              </li>
              <li>
                <Link to={"/faq"}>FAQs</Link>
              </li>
              <li>
                <Link to={"/guide"}>Size Guide</Link>
              </li>
              <li>
                <Link to={"/privacy"}>Privacy Policy</Link>
              </li>
            </ul>
            <ul>
              <li>
                <h6>Official</h6>
              </li>
              <li>
                <Link to={"https://pijakbumi.com/"}>Pijak Bumi</Link>
              </li>
              <li>
                <Link to={"https://nahproject.com/"}>NAH</Link>
              </li>
              <li>
                <Link to={"https://shopee.co.id/sepatukanky"}>Kanky</Link>
              </li>
              <li>
                <Link to={"https://sepatucompass.com/"}>Compass</Link>
              </li>
              <li>
                <Link to={"https://shopee.co.id/bavitoofficialshop"}>
                  Bavito
                </Link>
              </li>
            </ul>
            <div className="f-h-news">
              <h6>Newsletter</h6>
              <p>Subscribe to get special offers and updates.</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Enter your email"
              />
              <p>{emailnotfi}</p>
              <button onClick={sendEmail}>Subscribe</button>
            </div>
          </div>
          <div className="f-bottom">
            <p>©2024 SepatuLoe.All rights reserved.</p>
            <span>
              <img
                src="./fb.svg"
                alt="fb"
                width={"20px"}
                onClick={() => window.open("https://www.facebook.com/")}
                style={{ cursor: "pointer" }}
              />
              <img
                src="./twt.svg"
                alt="fb"
                width={"20px"}
                onClick={() => window.open("https://www.twitter.com")}
                style={{ cursor: "pointer" }}
              />
              <img
                src="./ig.svg"
                alt="fb"
                width={"20px"}
                onClick={() => window.open("https://www.instagram.com/")}
                style={{ cursor: "pointer" }}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
