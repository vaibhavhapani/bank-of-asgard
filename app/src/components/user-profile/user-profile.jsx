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

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import EditProfile from "./edit-profile";

const UserProfile = () => {

  const { getDecodedIDToken } = useAuthContext();

  const [userInfo, setUserInfo] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState(null);

  const { httpRequest } = useAuthContext();

  const request = requestConfig =>
    httpRequest(requestConfig)
      .then(response => response)
      .catch(error => error);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await request({
        method: "GET",
        url: "https://api.asgardeo.io/t/sampleorg1/scim2/Me",
        headers: { "Content-Type": "application/json" },
      });

        setUserInfo({
          username: response.data.userName.split('/').pop() || "N/A",
          accountType:
            response.data["urn:scim:schemas:extension:custom:User"]
              .accountType || "N/A",
          email: response.data.emails[0] || "N/A",
          givenName: response.data.name.givenName || "N/A",
          familyName: response.data.name.familyName || "N/A",
          mobile: response.data.phoneNumbers[0].value || "N/A",
          country: response.data["urn:scim:wso2:schema"].country || "N/A",
          birthdate: response.data["urn:scim:wso2:schema"].dateOfBirth || "N/A",
        });
      } catch (err) {
        setError("Failed to retrieve user profile.");
      }
    }
    fetchUserProfile();
  }, []);

  const handleUpdateSuccess = () => {
    setShowEditForm(false);
    window.location.reload();
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  if (error) return <p>{error}</p>;

  // load userinfo before rendering profile details**
  if (!userInfo) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      {showEditForm && userInfo ? (
        <EditProfile
          userInfo={userInfo}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <h2>User Profile</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
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
          <button onClick={() => setShowEditForm(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
}

export default UserProfile;
