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

import { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import EditProfile from "./edit-profile";
import AccountSecurity from "../account-security";

const UserProfile = () => {

  const [ userInfo, setUserInfo ] = useState(null);
  const [ showEditForm, setShowEditForm ] = useState(false);

  const { getDecodedIDToken, refreshAccessToken, state } = useAuthContext();

  useEffect(() => {
    getIdToken();
  }, []);

  const handleUpdateSuccess = () => {
    updateToken().then(() => {
      setShowEditForm(false);
    });  
  };

  const getIdToken = () => {
    getDecodedIDToken().then((decodedIdToken) => {
      console.log(decodedIdToken);
      setUserInfo({
        username: decodedIdToken.username  || "N/A",
        accountType:decodedIdToken.accountType,
        email: decodedIdToken.email|| "N/A",
          givenName: decodedIdToken.given_name || "N/A",
          familyName: decodedIdToken.family_name || "N/A",
          mobile: decodedIdToken.phone_number || "N/A",
          country: decodedIdToken.address.country || "N/A",
          birthdate: decodedIdToken.birthdate || "N/A",
      })})
  }

  const updateToken = async () => {
    const refresh = await refreshAccessToken();
    if(refresh) {
      getIdToken();
    }
  }

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  if (!state.isAuthenticated) { 
    return <p>Please log in to view your profile.</p>;
  }

  // load userinfo before rendering profile details**
  if (!userInfo) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div>
      {showEditForm && userInfo ? (
        <>
          <AccountSecurity accountType={userInfo.accountType} />
          <EditProfile
            userInfo={userInfo}
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={handleCancelEdit}
          />
        </>
      ) : (
        <div className="contact_section">
          <div className="contact_form-container profile-edit">
            <ul className="details-list">
              <li>
                <strong>User Name:</strong> {userInfo.username || "N/A"}
              </li>
              <li>
                <strong>Account Type:</strong> {userInfo.accountType || "N/A"}
              </li>
              <li>
                <strong>Full Name:</strong> {userInfo.givenName || "N/A"}{" "}
                {userInfo.familyName}
              </li>
              <li>
                <strong>Email:</strong> {userInfo.email || "N/A"}
              </li>
              <li>
                <strong>Country:</strong> {userInfo.country || "N/A"}
              </li>
              <li>
                <strong>Birth date</strong> {userInfo.birthdate || "N/A"}
              </li>
              <li>
                <strong>Mobile:</strong> {userInfo.mobile || "N/A"}
              </li>
            </ul>

            <div className="form-buttons">
              <button className="edit-button" onClick={() => setShowEditForm(true)}>Edit Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
