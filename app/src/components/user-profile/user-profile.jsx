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

const UserProfile = () => {

  const [ userInfo, setUserInfo ] = useState(null);
  const [ showEditForm, setShowEditForm ] = useState(false);
  const [ error, setError ] = useState(null);

  const { httpRequest, state } = useAuthContext();

  const requestConfig = {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/scim+json"
    },
    method: "GET",
    url: `${import.meta.env.VITE_REACT_APP_ASGARDEO_BASE_URL}/scim2/Me`
  };

  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }

    httpRequest(requestConfig)
        .then((response) => {
          const responseData = response.data;

          console.log(responseData);

          setUserInfo({
            username: responseData?.userName.split('/').pop() || "N/A",
            accountType: responseData["urn:scim:schemas:extension:custom:User"]?.accountType || "N/A",
            email: (responseData?.emails && responseData?.emails.length > 0) ? responseData?.emails[0] : "N/A",
            givenName: responseData?.name?.givenName || "N/A",
            familyName: responseData?.name?.familyName || "N/A",
            mobile:(responseData?.phoneNumbers && responseData?.phoneNumbers.length > 0) ?
              responseData?.phoneNumbers[0]?.value : "N/A",
            country: responseData["urn:scim:wso2:schema"]?.country || "N/A",
            birthdate: responseData["urn:scim:wso2:schema"]?.dateOfBirth || "N/A",
          });
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to retrieve user profile.");
        });
  }, [ state ]);

  const handleUpdateSuccess = () => {
    setShowEditForm(false);
    window.location.reload();
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  if (error) return <p>{error}</p>;

  if (!state.isAuthenticated) { 
    return <p>Please log in to view your profile.</p>;
  }

  // load userinfo before rendering profile details**
  if (!userInfo) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div>
      { showEditForm && userInfo ? (
        <EditProfile
          userInfo={userInfo}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={handleCancelEdit}
        />
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
