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

const ViewProfile = ({ userInfo, setShowEditForm }) => {

  return (
    <>
      <div className="heading_container ">
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
                        <span>083434342982340</span>
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
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="detail-box user-profile" style={ { marginTop: "0" } }>
            <div className="contact_section">
              <div className="contact_form-container profile-edit">
                <h5>Profile</h5>
                <ul className="details-list">
                  {/* TODO: Uncomment the following code block after implementing the profile picture upload feature */}
                  {/* <li>
                    { (userInfo?.picture && userInfo.picture !== "") &&
                      <img
                        src={ userInfo.picture }
                        alt="User Image"
                        style={ { width: "100%", maxWidth: "300px", maxHeight: "300px" } } />
                    }
                  </li> */}
                  <li>
                    <strong>User Name:</strong> { userInfo.username }
                  </li>
                  <li>
                    <strong>Account Type:</strong> { userInfo.accountType }
                  </li>
                  <li>
                    <strong>Full Name:</strong> { userInfo.givenName }{" "}{ userInfo.familyName }
                  </li>
                  <li>
                    <strong>Email:</strong> {userInfo.email }
                  </li>
                  <li>
                    <strong>Country:</strong> {userInfo.country }
                  </li>
                  <li>
                    <strong>Birth date</strong> {userInfo.birthdate }
                  </li>
                  <li>
                    <strong>Mobile:</strong> {userInfo.mobile }
                  </li>
                </ul>

                <div className="form-buttons">
                  <button className="edit-button secondary" onClick={() => setShowEditForm(true)}>Edit Profile</button>
                </div>
              </div>
            </div>
          </div>
          <div className="detail-box user-profile">
            <div className="contact_section">
              <div className="contact_form-container profile-edit">
                <div className="row">
                  <div className="col-md-12">
                    <h5>Account Security</h5>
                    <AccountSecurity accountType={userInfo.accountType} userId={userInfo.userId} />
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
