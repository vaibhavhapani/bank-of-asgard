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

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuthContext } from "@asgardeo/auth-react";
import AccountSecurity from "./account-security";

const EditProfile = ({ userInfo, onUpdateSuccess, onCancel }) => {

  const { httpRequest } = useAuthContext();

  const [ formData, setFormData ] = useState({
    givenName: "",
    familyName: "",
    dob: "",
    email: "",
    mobile: "",
    password: "",
    picture: ""
  });

  const request = requestConfig =>
    httpRequest(requestConfig)
      .then(response => response)
      .catch(error => error);

  useEffect(() => {
    if (userInfo) {
      console.log("inside userinfo" + userInfo);

      setFormData({
        givenName: userInfo.givenName || "",
        familyName: userInfo.familyName || "",
        dob: userInfo.birthdate || "",
        email: userInfo.email || "",
        mobile: userInfo.mobile || "",
        password: "",
        picture: userInfo.picture || ""
      });
      console.log("inside usereffect" + formData);
    }
  }, [ userInfo ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log(formData);

    try {
      const operations = [];
      // Add updated values to the PATCH request only if they are modified
      const valuePayload = {};

      if (formData.givenName.trim() !== "" || formData.familyName.trim() !== "") {
          valuePayload.name = {};
          if (formData.givenName.trim() !== "") valuePayload.name.givenName = formData.givenName;
          if (formData.familyName.trim() !== "") valuePayload.name.familyName = formData.familyName;
      }

      if (formData.email.trim() !== "") {
        valuePayload.emails = [formData.email];
      }

      if (formData.mobile.trim() !== "") {
        valuePayload.phoneNumbers = [{ type: "mobile", value: formData.mobile }];
      }
    
      if (formData.dob.trim() !== "") {
        valuePayload["urn:scim:wso2:schema"] = { dateOfBirth: formData.dob };
      }

      if (formData.password.trim() !== "") {
        valuePayload.password = formData.password;
      }

      if (formData.picture.trim() !== "") {
        valuePayload.picture = formData.picture;
      }

      if (Object.keys(valuePayload).length > 0) {
        operations.push({ op: "replace", value: valuePayload });
      }

      // If no fields were updated, return early
      if (operations.length === 0) {
        alert("No changes made.");
        return;
      }

      const payload = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: operations,
      };

      const response = await request({
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/scim+json"
        },
        method: "PATCH",
        data: payload,
        url: `${import.meta.env.VITE_REACT_APP_ASGARDEO_BASE_URL}/scim2/Me`
      });
    
      alert("Profile updated successfully");
      onUpdateSuccess();
    } catch (error) {
      alert("Profile update failed: " + (error.detail || error));
      console.log(error);
    }
  };

  return (
    <>
      <div className="heading_container ">
        <h2>User Profile - Edit</h2>
      </div>
      <div className="detail-box user-profile">
        <div className="row">
          <div className="col-md-8 px-0">
            <div className="img_container">
              <div className="img-box">
                <div className="contact_section">
                  <form onSubmit={handleSubmit} className="contact_form-container profile-edit">
                    <ul className="details-list">
                      <li>
                        <label>First Name:</label>
                        <input type="text" name="givenName" placeholder="First Name" value={formData.givenName} onChange={handleChange} />
                      </li>
                      <li>
                        <label>Last Name:</label>
                        <input type="text" name="familyName" placeholder="Last Name" value={formData.familyName} onChange={handleChange} />
                      </li>
                      <li>
                        <label>Date of Birth:</label>
                        <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} />
                      </li>
                      <li>
                        <label>Email:</label>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                      </li>
                      <li>
                        <label>Mobile:</label>
                        <input type="tel" name="mobile" placeholder="Phone Number" value={formData.mobile} onChange={handleChange} />
                      </li>
                      <li>
                        <label>Password:</label>
                        <input type="password" name="password" placeholder="New Password (Optional)" value={formData.password} onChange={handleChange} />
                      </li>
                      <li>
                        <label>Profile Picture:</label>
                        <input type="text" name="picture" placeholder="Profile Picture URL" value={formData.picture} onChange={handleChange} />
                      </li>
                    </ul>

                    <div className="form-buttons">
                      <button type="submit">Update Profile</button>
                      <button type="button" className="cancel-button" onClick={onCancel} style={{ marginLeft: "10px" }}>Cancel</button>
                    </div>
                  </form>
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
      <div className="heading_container mt-5">
        <h2>Account Security</h2>
      </div>
      <div className="detail-box user-profile">
        <div className="contact_section">
          <div className="contact_form-container">
            <div className="row">
              <div className="col-md-12">
                <AccountSecurity accountType={userInfo.accountType} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

EditProfile.propTypes = {
  userInfo: PropTypes.object.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default EditProfile;
