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
import { Link, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import SignUpForm from "../components/sign-up/sign-up-form";
import EverydayBanking from "../assets/images/sofa-online-card-dcm-45094.jpg";
import GoGlobal from "../assets/images/6739-mass-retail-woman-checking-phone-in-the-city-1240x400.jpg";
import { ACCOUNT_TYPES, ROUTES, SITE_SECTIONS, URL_QUERY_PARAMS } from "../constants/app-constants";

const RegisterAccountPage = ({ setSiteSection }) => {

  const [ searchParams ] = useSearchParams();

  const accountType = searchParams.get(URL_QUERY_PARAMS.ACCOUNT_TYPE) || "";

  useEffect(() => {
    if (accountType === ACCOUNT_TYPES.BUSINESS) {
      setSiteSection(SITE_SECTIONS.BUSINESS);
    }
    else if (accountType === ACCOUNT_TYPES.PERSONAL) {
      setSiteSection(SITE_SECTIONS.PERSONAL);
    }
    else {
      setSiteSection(null);
    }
  }, [ accountType ]);

  return (
    <>
      <section className="about_section layout_padding">
        <div className="container">

          { (accountType !== "") ?
            (
              <div className="row">
                <div className="col-md-8 px-0">
                  <div className="img_container">
                    <div className="img-box">
                      <SignUpForm accountType={ accountType } />
                    </div>
                  </div>
                </div>
                <div className="col-md-4 px-0">
                  <div className="detail-box" style={ { marginTop: "120px" } }>
                    { (accountType === ACCOUNT_TYPES.BUSINESS) ?
                      (
                        <>
                          <div className="heading_container ">
                            <h2>Business Banking</h2>
                          </div>
                          <img src={ GoGlobal } alt="" style={ { width: "100%" } } />
                          <p>
                            We&apos;re supporting smarter business by building future focused insights, 
                            and easier to use products and services that facilitate new ways to grow
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="heading_container ">
                            <h2>Personal Banking</h2>
                          </div>
                          <img src={ EverydayBanking } alt="" style={ { width: "100%" } } />
                          <p>
                            Step into a world of endless opportunity when shopping and banking online.
                            We&apos;re here to help you with smart and safe banking.
                          </p>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6">
                  <div className="box ">
                    <div className="img-box">
                      <img src={ EverydayBanking } alt="" style={ { width: "100%" } } />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Personal Banking
                      </h5>
                      <p>
                        Step into a world of endless opportunity when shopping and banking online.
                        We&apos;re here to help you with smart and safe banking.
                      </p>
                      <Link to={ `${ROUTES.REGISTER_ACCOUNT}?${URL_QUERY_PARAMS.ACCOUNT_TYPE}=${ACCOUNT_TYPES.PERSONAL}` }>
                        Personal Account
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="box ">
                    <div className="img-box">
                      <img src={ GoGlobal } alt="" style={ { width: "100%" } } />
                    </div>
                    <div className="detail-box">
                      <h5>
                        Business Banking
                      </h5>
                      <p>
                        We&apos;re supporting smarter business by building future focused insights, 
                        and easier to use products and services that facilitate new ways to grow
                      </p>
                      <Link to={ `${ROUTES.REGISTER_ACCOUNT}?${URL_QUERY_PARAMS.ACCOUNT_TYPE}=${ACCOUNT_TYPES.BUSINESS}` }>
                        Business Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

        </div>
      </section>
    </>
  );
}

RegisterAccountPage.propTypes = {
  setSiteSection: PropTypes.object.isRequired,
};

export default RegisterAccountPage;
