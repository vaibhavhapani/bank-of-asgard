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

import { useAuthContext } from "@asgardeo/auth-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate
} from "react-router-dom";
import HomePage from "./pages/home";
import BusinessBankingPage from "./pages/business-banking";
import RegisterAccountPage from "./pages/register-account";
import UserProfilePage from "./pages/user-profile";
import Logo from "./assets/logo.svg";
import "./assets/css/bootstrap.css";
import "./assets/css/responsive.css";
import "./assets/css/style.scss";

const PERSONAL_BANKING_PATH = "/personal-banking";
const BUSINESS_BANKING_PATH = "/business-banking";
const USER_PROFILE_PATH = "/user-profile";
const REGISTER_ACCOUNT_PATH = "/register-account";

const App = () => {
  const { state, signIn, signOut } = useAuthContext();

  return (
    <Router>
      <header className="header_section">
        <div className="header_top">
          <div className="container-fluid">
            <div className="contact_link-container">
              <span>
                <NavLink to={ PERSONAL_BANKING_PATH } className={({ isActive }) => isActive ? "contact_link1 active" : "contact_link1"}>
                  <span>
                    Personal
                  </span>
                </NavLink>
                <span className="divider">|</span>
                <NavLink to={ BUSINESS_BANKING_PATH } className={({ isActive }) => isActive ? "contact_link1 active" : "contact_link1"}>
                  <span>
                    Business
                  </span>
                </NavLink>
              </span>
              <span>
                {
                  state.isAuthenticated ?
                  (
                    <>
                        <span className="login_details">Welcome, { state.username }!</span>
                        <Link to={ USER_PROFILE_PATH }>
                          <span>
                            My Banking
                          </span>
                        </Link>
                        <button className="login_link" onClick={ () => signOut() }>
                            Logout
                        </button>
                    </>
                  ) : (
                    <>
                      <Link to={ REGISTER_ACCOUNT_PATH } className="register_link">
                        <span>
                          Register
                        </span>
                      </Link>
                      <button className="login_link" onClick={ () => signIn() }>
                          Login
                      </button>
                    </>
                  )
                }
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
                  <li className="nav-item">
                    <NavLink to={ PERSONAL_BANKING_PATH } className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                      Everyday Banking
                      <span>Accounts & Credit Cards</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      Offers & Rewards
                      <span>Exclusive Offers</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      International
                      <span>Global Benefits</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      Digital Banking
                      <span>Banking made easy</span>
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <Routes>
        <Route path={ PERSONAL_BANKING_PATH } element={ <HomePage /> } />
        <Route path={ BUSINESS_BANKING_PATH } element={ <BusinessBankingPage /> } />
        <Route path={ REGISTER_ACCOUNT_PATH } element={ <RegisterAccountPage /> } />
        <Route path={ USER_PROFILE_PATH } element={ <UserProfilePage /> } />
        <Route path="/" element={ <Navigate to={ PERSONAL_BANKING_PATH } /> } />
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
