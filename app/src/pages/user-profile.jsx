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
import EditProfile from "../components/user-profile/edit-profile";
import ViewProfile from "../components/user-profile/view-profile";

const UserProfilePage = () => {

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

      if (!decodedIdToken) {
        return;
      }

      setUserInfo({
        username: decodedIdToken.username || "",
        accountType: decodedIdToken.accountType || "N/A",
        email: decodedIdToken.email || "",
          givenName: decodedIdToken.given_name || "",
          familyName: decodedIdToken.family_name || "",
          mobile: decodedIdToken.phone_number || "",
          country: decodedIdToken.address?.country || "",
          birthdate: decodedIdToken.birthdate || "",
          picture: decodedIdToken.picture || ""
      });
    });
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
}

export default UserProfilePage;
