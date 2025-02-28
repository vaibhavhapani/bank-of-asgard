/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// import { useAuthContext } from "@asgardeo/auth-react";
// import SignUpForm from "./components/sign-up/sign-up-form";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import HomePage from "./pages/home";
import BusinessBankingPage from "./pages/business-banking";
import PersonalBankingPage from "./pages/personal-banking";
import RegisterAccountPage from "./pages/register-account";
import Logo from "./assets/logo.svg";
import "./assets/css/bootstrap.css";
import "./assets/css/responsive.css";
import "./assets/css/style.scss";
import "./App.css";

const App = () => {
  // const { state, signIn, signOut } = useAuthContext();
  const navActive = false;
  const navActiveClass = (navActive) ? "active" : "";

  return (
    <Router>
      <header className="header_section">
        <div className="header_top">
          <div className="container-fluid">
            <div className="contact_link-container">
              <span>
                <Link to="/personal-banking" className="contact_link1">
                  <span>
                    Personal
                  </span>
                </Link>
                <span className="divider">|</span>
                <Link to="/business-banking" className="contact_link1">
                  <span>
                    Business
                  </span>
                </Link>
              </span>
              <span>
                <Link to="/register-account" className="register_link">
                  <span>
                    Register
                  </span>
                </Link>
                <a href="" className="login_link">
                  <span>
                    Login
                  </span>
                </a>
              </span>
            </div>
          </div>
        </div>
        <div className="header_bottom">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg custom_nav-container">
              <Link to="/" className="navbar-brand">
                <span>
                  <img src={ Logo } alt="Bank of Asgard" />
                </span>
              </Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className=""></span>
              </button>

              <div className="collapse navbar-collapse ml-auto" id="navbarSupportedContent">
                <ul className="navbar-nav">
                  <li className={ `nav-item ${navActiveClass}` }>
                    <a className="nav-link" href="">
                      Everyday Banking
                      <span>Accounts & Credit Cards</span>
                      { navActive && <span className="sr-only">(current)</span> }
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      Offers & Rewards
                      <span>Accounts & Credit Cards</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      International
                      <span>Accounts & Credit Cards</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      Digital Banking
                      <span>Accounts & Credit Cards</span>
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/personal-banking" element={ <PersonalBankingPage /> } />
        <Route path="/business-banking" element={ <BusinessBankingPage /> } />
        <Route path="/register-account" element={ <RegisterAccountPage /> } />
        <Route path="/" element={ <HomePage /> } />
      </Routes>

      <section className="info_section ">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="info_logo">
                <a className="navbar-brand" href="index.html">
                  <span>
                    Bank of Asgard
                  </span>
                </a>
                <p>
                  Copyright Bank of Asgard. <br />
                  2024 - 2025 All rights reserved.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="info_links">
                <h5>
                  Useful Link
                </h5>
                <ul>
                  <li>
                    <a href="">
                      dolor sit amet, consectetur
                    </a>
                  </li>
                  <li>
                    <a href="">
                      magna aliqua. Ut enim ad
                    </a>
                  </li>
                  <li>
                    <a href="">
                      minim veniam,
                    </a>
                  </li>
                  <li>
                    <a href="">
                      quisdotempor incididunt r
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div className="info_info">
                <h5>
                  Contact Us
                </h5>
              </div>
              <div className="info_contact">
                <a href="" className="">
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  <span>
                    Lorem ipsum dolor sit amet,
                  </span>
                </a>
                <a href="" className="">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                  <span>
                    Call : +01 1234567890
                  </span>
                </a>
                <a href="" className="">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                  <span>
                    contact@bankofasgard.com
                  </span>
                </a>
              </div>
            </div>
            <div className="col-md-3">
              <div className="info_form ">
                <h5>
                  Newsletter
                </h5>
                <form action="#">
                  <input type="email" placeholder="Enter your email" />
                  <button>
                    Subscribe
                  </button>
                </form>
                <div className="social_box">
                  <a href="">
                    <i className="fa fa-facebook" aria-hidden="true"></i>
                  </a>
                  <a href="">
                    <i className="fa fa-twitter" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Router>
  );
};

export default App;
