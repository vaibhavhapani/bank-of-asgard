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

import { useEffect } from "react";
import PropTypes from "prop-types";
import MobileBanking from "../assets/images/mobile-banking.jpg";
import DigitalBanking from "../assets/images/digital-banking.jpg";
import EverydayBanking from "../assets/images/sofa-online-card-dcm-45094.jpg";
import RewardingLife from "../assets/images/two-woman-pick-up-dress.jpg";
import GoGlobal from "../assets/images/6739-mass-retail-woman-checking-phone-in-the-city-1240x400.jpg";
import { SITE_SECTIONS } from "../constants/app-constants";

const PersonalBankingPage = ({ setSiteSection }) => {

  useEffect(() => {
    setSiteSection(SITE_SECTIONS.PERSONAL);
  }, []);

  return (
    <>
      <section className=" slider_section ">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-9 image-box">
                    <div className="detail-box">
                      <h1>
                        Get more out of life with
                        an Asgard Live+  <br />
                        <span>Credit Card</span>
                      </h1>
                      <p>
                        Live it up with 10% cashback on dining, <br />
                        shopping and entertainment. <br /><br /><br />
                      </p>
                      <div className="btn-box">
                        <a href="" className="btn-1"> Read more </a>
                        <a href="" className="btn-2">Inquire</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 side-box">
                    <div>
                      <h2>Mobile banking</h2>
                      Mobile banking find out more about ways to bank
                      The bank in your pocket.
                    </div>
                    <hr />
                    <div>
                      <h2>Protect yourself from scams</h2>
                      Protect yourself from scams This link will open in a new window
                      Learn more about scams and frauds along with tips on how to protect your money.
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </section>

      <section className="service_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Do more with Bank of Asgard
            </h2>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="box ">
                <div className="img-box">
                  <img src={ EverydayBanking } alt="" style={ { width: "100%" } } />
                </div>
                <div className="detail-box">
                  <h6>
                    Everyday Banking
                  </h6>
                  <p>
                    Minima consequatur architecto eaque assumenda ipsam itaque quia eum in doloribus debitis impedit ut minus tenetur corrupti excepturi ullam.
                  </p>
                  <a href="">
                    Read More
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="box ">
                <div className="img-box">
                  <img src={ RewardingLife } alt="" style={ { width: "100%" } } />
                </div>
                <div className="detail-box">
                  <h6>
                    A Rewarding Life!
                  </h6>
                  <p>
                    Minima consequatur architecto eaque assumenda ipsam itaque quia eum in doloribus debitis impedit ut minus tenetur corrupti excepturi ullam.
                  </p>
                  <a href="">
                    Read More
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="box ">
                <div className="img-box">
                  <img src={ GoGlobal } alt="" style={ { width: "100%" } } />
                </div>
                <div className="detail-box">
                  <h6>
                    Go Global
                  </h6>
                  <p>
                    Minima consequatur architecto eaque assumenda ipsam itaque quia eum in doloribus debitis impedit ut minus tenetur corrupti excepturi ullam.
                  </p>
                  <a href="">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Explore the next generation banking!
            </h2>
            <p>
              Lorem ipsum dolor sit amet, non odio tincidunt ut ante, lorem a euismod suspendisse vel, sed quam nulla mauris
              iaculis. Erat eget vitae malesuada, tortor tincidunt porta lorem lectus.
            </p>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-6 mx-auto ">
              <div className="box">
                <div className="img-box">
                  <img src={ MobileBanking } alt="" />
                </div>
                <div className="detail-box">
                  <h5>
                    Mobile Banking
                  </h5>
                  <h6 className="">
                    Read More
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mx-auto ">
              <div className="box">
                <div className="img-box">
                  <img src={ DigitalBanking } alt="" />
                </div>
                <div className="detail-box">
                  <h5>
                    Digital Everywhere
                  </h5>
                  <h6 className="">
                    Read More
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mx-auto ">
              <div className="box">
                <div className="img-box">
                  <img src={ MobileBanking } alt="" />
                </div>
                <div className="detail-box">
                  <h5>
                    Business Banking
                  </h5>
                  <h6 className="">
                    Read More
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-box">
            <a href="">
              View All
            </a>
          </div>
        </div>
      </section>

      <section className="contact_section layout_padding">
        <div className="contact_bg_box">
          <div className="img-box">
            <img src={ MobileBanking } alt="" />
          </div>
        </div>
      </section>

      <section className="client_section layout_padding">
        <div className="container ">
          <div className="heading_container heading_center">
            <h2>
              We vow to a secure banking experience to our customers!
            </h2>
          </div>
          <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="box">
                  <div className="img-box">
                    <img src="images/client.png" alt="" />
                  </div>
                  <div className="detail-box">
                    <h4>
                      Minim Veniam
                    </h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                      do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip
                    </p>
                  </div>
                </div>
              </div>
              <div className="carousel-item ">
                <div className="box">
                  <div className="img-box">
                    <img src="images/client.png" alt="" />
                  </div>
                  <div className="detail-box">
                    <h4>
                      Minim Veniam
                    </h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                      do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip
                    </p>
                  </div>
                </div>
              </div>
              <div className="carousel-item ">
                <div className="box">
                  <div className="img-box">
                    <img src="images/client.png" alt="" />
                  </div>
                  <div className="detail-box">
                    <h4>
                      Minim Veniam
                    </h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                      do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel_btn-box">
              <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                <i className="fa fa-angle-left" aria-hidden="true"></i>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                <i className="fa fa-angle-right" aria-hidden="true"></i>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

PersonalBankingPage.propTypes = {
  setSiteSection: PropTypes.object.isRequired,
};

export default PersonalBankingPage;
