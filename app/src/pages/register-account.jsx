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
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import SignUpForm from "../components/sign-up/sign-up-form";
import EverydayBanking from "../assets/images/sofa-online-card-dcm-45094.jpg";
import GoGlobal from "../assets/images/6739-mass-retail-woman-checking-phone-in-the-city-1240x400.jpg";
import { URL_QUERY_PARAMS } from "../constants/app-constants";
import { ACCOUNT_TYPES } from "../constants/app-constants";
import { SITE_SECTIONS } from "../constants/app-constants";

const RegisterAccountPage = ({ setSiteSection }) => {

  const [ searchParams ] = useSearchParams();

  const accountType = searchParams.get(URL_QUERY_PARAMS.ACCOUNT_TYPE) || ACCOUNT_TYPES.PERSONAL;

  useEffect(() => {
    if (accountType === ACCOUNT_TYPES.BUSINESS) {
      setSiteSection(SITE_SECTIONS.BUSINESS);
    }
    else {
      setSiteSection(SITE_SECTIONS.PERSONAL);
    }
  }, [ accountType ]);

  return (
    <>
      <section className="about_section layout_padding">
        <div className="container">
          <div className="row">
            <div className="col-md-8 px-0">
              <div className="img_container">
                <div className="img-box">
                  <SignUpForm accountType={ accountType } />
                </div>
              </div>
            </div>
            <div className="col-md-4 px-0">
              <div className="detail-box">
                <div className="heading_container ">
                  { (accountType === ACCOUNT_TYPES.BUSINESS) ?
                    (
                      <h2>Business Banking</h2>
                    ) : (
                      <h2>Personal Banking</h2>
                    )
                  }
                </div>
                { (accountType === ACCOUNT_TYPES.BUSINESS) ?
                  (
                    <img src={ GoGlobal } alt="" style={ { width: "100%" } } />
                  ) : (
                    <img src={ EverydayBanking } alt="" style={ { width: "100%" } } />
                  )
                }
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

RegisterAccountPage.propTypes = {
  setSiteSection: PropTypes.object.isRequired,
};

export default RegisterAccountPage;
