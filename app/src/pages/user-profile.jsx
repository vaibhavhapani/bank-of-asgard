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
import PropTypes from "prop-types";
import { useAuthContext } from "@asgardeo/auth-react";
import EditProfile from "../components/user-profile/edit-profile";
import ViewProfile from "../components/user-profile/view-profile";
import { ACCOUNT_TYPES, SITE_SECTIONS } from "../constants/app-constants";

const UserProfilePage = ({ setSiteSection }) => {
  const { getDecodedIDToken, refreshAccessToken, state, signIn, httpRequest } = useAuthContext();

  const [ userInfo, setUserInfo ] = useState(null);
  const [ showEditForm, setShowEditForm ] = useState(false);
  const request = requestConfig =>
    httpRequest(requestConfig)
      .then(response => response)
      .catch(error => error);

  useEffect(() => {
    if (!state.isAuthenticated) { 
      signIn();
    }
  }, []);

  useEffect(() => {
    getUserInfo();
    //getIdToken();     // Update after the fix with refresh token
  }, []);

  const handleUpdateSuccess = () => {
    getUserInfo();                // Remove after the fix with refresh token
    setShowEditForm(false);

    // updateToken().then(() => {    // Use after the fix with refresh token
    //   getUpdatedUser();
    //   setShowEditForm(false);
    // });
  };

  const getUserInfo = () => {
    request({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/scim+json",
      },
      method: "GET",
      url: `${import.meta.env.VITE_REACT_APP_ASGARDEO_BASE_URL}/scim2/Me`,
    }).then((response) => {
      console.log(response.data);

      if (response.data) {

        if (response.data["urn:scim:wso2:schema"]?.accountType === ACCOUNT_TYPES.BUSINESS) {
          setSiteSection(SITE_SECTIONS.BUSINESS);
        } else {
          setSiteSection(SITE_SECTIONS.PERSONAL);
        }
        setUserInfo({
          userId: response.data.id || "",
          username: response.data.userName || "",
          accountType: response.data["urn:scim:wso2:schema"].accountType || "N/A",
          email: response.data.emails[0] || "",
          givenName: response.data.name.givenName || "",
          familyName: response.data.name.familyName || "",
          mobile: response.data.phoneNumbers.value || "",
          country: response.data["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"].country || "",
          birthdate: response.data["urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"].birthdate || "",
          picture: response.data.picture || "",
        });
      }
      return;
    });
  };

  // Use after the fix with the refresh token
  const getIdToken = () => {
    getDecodedIDToken().then((decodedIdToken) => {
      console.log(decodedIdToken);

      if (decodedIdToken?.accountType === ACCOUNT_TYPES.BUSINESS) {
        setSiteSection(SITE_SECTIONS.BUSINESS);
      } else {
        setSiteSection(SITE_SECTIONS.PERSONAL);
      }

      if (!decodedIdToken) {
        return;
      }

      setUserInfo({
        userId: decodedIdToken.sub || "",
        username: decodedIdToken.username || "",
        accountType: decodedIdToken.accountType || "N/A",
        email: decodedIdToken.email || "",
        givenName: decodedIdToken.given_name || "",
        familyName: decodedIdToken.family_name || "",
        mobile: decodedIdToken.phone_number || "",
        country: decodedIdToken.address?.country || "",
        birthdate: decodedIdToken.birthdate || "",
        picture: decodedIdToken.picture || "",
      });
    });
  };

  // Use after the fix with refresh token
  const updateToken = async () => {
    const refresh = await refreshAccessToken();

    if (refresh) {
      getIdToken();
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  if (!userInfo) {
    return;
  }

  return (
    <>
      <section className="about_section layout_padding">
        <div className="container-fluid">
          { showEditForm && userInfo ? (
            <>
              <EditProfile
                userInfo={userInfo}
                onUpdateSuccess={handleUpdateSuccess}
                onCancel={handleCancelEdit}
              />
            </>
          ) : (
            <ViewProfile userInfo={ userInfo } setShowEditForm={ setShowEditForm } />
          )}
        </div>
      </section>
    </>
  );
};

UserProfilePage.propTypes = {
  setSiteSection: PropTypes.object.isRequired,
};

export default UserProfilePage;
