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

const ProfileCard = ({
  userInfo,
  setShowEditForm
}) => {
  /**
   * Resolves the user name by dropping the user store domain.
   * @returns {string} - Resolved user name.
   */
  const resolveUserName = () => {
    const usernameParts = userInfo.username.split("/");

    if (usernameParts.length > 1) {
      return usernameParts[1];
    }
    return usernameParts[0];
  }

  return (
    <div className="detail-box user-profile" style={{ marginTop: "0" }}>
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
              <strong>User Name:</strong> {resolveUserName()}
            </li>
            <li>
              <strong>Account Type:</strong> {userInfo.accountType}
            </li>
            <li>
              <strong>Full Name:</strong> {userInfo.givenName}{" "}
              {userInfo.familyName}
            </li>
            <li>
              <strong>Email:</strong> {userInfo.email}
            </li>
            <li>
              <strong>Country:</strong> {userInfo.country}
            </li>
            <li>
              <strong>Birth date</strong> {userInfo.birthdate}
            </li>
            <li>
              <strong>Mobile:</strong> {userInfo.mobile}
            </li>
          </ul>

          <div className="form-buttons">
            <button
              className="edit-button secondary"
              onClick={() => setShowEditForm(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileCard.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setShowEditForm: PropTypes.func.isRequired
};

export default ProfileCard;
