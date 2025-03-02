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

import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";
import UserProfile from "../components/user-profile/user-profile";

const UserProfilePage = () => {

  const { state, getDecodedIDToken } = useAuthContext();
  
  const [ decodedIDTokenDetails, setDecodedIDTokenDetails ] = useState(null);

  useEffect(() => {
    if (state.isAuthenticated) {
      getDecodedIDToken()
        .then((response) => {
          setDecodedIDTokenDetails(response);
      });
    }
  }, [ state, getDecodedIDToken ]);

  return (
    <>
      <section className="about_section layout_padding">
        <div className="container-fluid">
          <div className="heading_container ">
            <h2>User Profile</h2>
          </div>
          <div className="detail-box user-profile">
            <div className="row">
              <div className="col-md-8 px-0">
                <div className="img_container">
                  <div className="img-box">
                    <UserProfile />
                  </div>
                </div>
              </div>
              <div className="col-md-4 px-0">
                {/* <div className="heading_container">
                  { (decodedIDTokenDetails?.given_name && decodedIDTokenDetails?.family_name) ?
                    (
                      <h2>{ decodedIDTokenDetails.given_name } { decodedIDTokenDetails.family_name }</h2>
                    ) : (
                      <h2>{ state.username }</h2>
                    )
                  }
                </div> */}
                <p style={ { textAlign: "center" } }>
                  { decodedIDTokenDetails?.picture &&
                    <img
                      src={ decodedIDTokenDetails.picture }
                      alt="User Image"
                      style={ { width: "100%", maxWidth: "300px", maxHeight: "300px" } } />
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UserProfilePage;
