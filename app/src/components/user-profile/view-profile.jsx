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

import PropTypes from "prop-types";
import AccountSecurity from "./account-security";
import ProfileCard from "./view/profile-card";
import CloseAccountCard from "./close-account-card";

const ViewProfile = ({ userInfo, setShowEditForm }) => {

  return (
    <>
      <div className="heading_container">
        <h2>Welcome, { userInfo.givenName }{" "}{ userInfo.familyName }!</h2>
      </div>

      <div className="row" style={ { marginTop: "25px" } }>
        <div className="col-md-7">
          <div className="detail-box user-profile" style={ { marginTop: "0", height: "100%" } }>
            <div className="contact_section">
            <div className="contact_form-container profile-edit">
                <h5>Account Details</h5>
                <ul className="accounts-list">
                  <li>
                    <div className="row">
                      <div className="col-md-8">
                        <h6>Savings Account</h6>
                        <span><i className="fa fa-money" aria-hidden="true"></i>083434342982340</span>
                      </div>
                      <div className="col-md-4">
                        $ 13,565.45
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col-md-8">
                        <h6>Live+ Credit Card</h6>
                        <span><i className="fa fa-credit-card" aria-hidden="true"></i> 4574-3434-2984-2365</span>
                      </div>
                      <div className="col-md-4">
                        - $ 4,5600.67
                      </div>
                    </div>
                  </li>
                </ul>

                <div className="form-buttons">
                  <button className="edit-button">Make a transfer</button>
                </div>

                <hr />

                <ul className="account-options-list">
                  <li className="disabled">
                    <i className="fa fa-file-text" aria-hidden="true"></i>
                    <span>Balance Statement</span>
                  </li>
                  <li className="disabled">
                    <i className="fa fa-credit-card" aria-hidden="true"></i>
                    <span>Request Credit Card</span>
                  </li>
                  <li className="disabled">
                    <i className="fa fa-exchange" aria-hidden="true"></i>
                    <span>Request a Loan</span>
                  </li>
                  <li className="disabled">
                    <i className="fa fa-heart" aria-hidden="true"></i>
                    <span>Credit Limit Increase</span>
                  </li>
                </ul>

                <CloseAccountCard userId={ userInfo.userId }/>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5" style={ { display: "flex", flexDirection: "column" } }>
          <ProfileCard userInfo={ userInfo } setShowEditForm={ setShowEditForm } />

          <div className="detail-box user-profile" style={ { flex: "1" } }>
            <div className="contact_section">
              <div className="contact_form-container profile-edit">
                <div className="row">
                  <div className="col-md-12">
                    <h5>Account Security</h5>
                    <AccountSecurity accountType={userInfo.accountType} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ViewProfile.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setShowEditForm: PropTypes.func.isRequired
};

export default ViewProfile;
