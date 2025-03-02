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

const ViewProfile = ({ userInfo, setShowEditForm }) => {

  return (
    <>
      <div className="heading_container ">
        <h2>User Profile</h2>
      </div>
      <div className="detail-box user-profile">
        <div className="row">
          <div className="col-md-8 px-0">
            <div className="img_container">
              <div className="img-box">
                <div className="contact_section">
                  <div className="contact_form-container profile-edit">
                    <ul className="details-list">
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
                      <button className="edit-button" onClick={() => setShowEditForm(true)}>Edit Profile</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 px-0">
            <p style={ { textAlign: "center" } }>
              { (userInfo?.picture && userInfo.picture !== "") &&
                <img
                  src={ userInfo.picture }
                  alt="User Image"
                  style={ { width: "100%", maxWidth: "300px", maxHeight: "300px" } } />
              }
            </p>
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
