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
import { ACCOUNT_TYPES, ROUTES, SITE_SECTIONS } from "../constants/app-constants";
import { environmentConfig, isFeatureEnabled } from "../util/environment-util";
import { getVerificationStatus } from "../api/identity-verification";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { FEATURE_MAP } from "../constants/feature-constants";

const UserProfilePage = ({ setSiteSection }) => {
  const { getDecodedIDToken, refreshAccessToken, state, signIn, httpRequest } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [idvClaims, setIdvClaims] = useState([]);
  const [isIdVStatusLoading, setIsIdVStatusLoading] = useState(true);

  const isIdentityVerificationEnabled = isFeatureEnabled(FEATURE_MAP.IDENTITY_VERIFICATION);

  const isIdentityVerified = useMemo(() => {
    if (idvClaims) {
      if (idvClaims.length === 0) {
        return false;
      }

      if (idvClaims.every((claim) => claim.isVerified === true)) {
        return true;
      }
    }
    return false;
  }, [idvClaims]);

  const isIdentityVerificationInProgress = useMemo(() => {
    if (!isIdentityVerificationEnabled) {
      return false;
    }

    if (idvClaims) {
      if (idvClaims.length === 0) {
        return false;
      }

      if (idvClaims.some((claim) => claim.claimMetadata.onfido_workflow_status === "processing")) {
        return true;
      }
    }
    return false;
  }, [idvClaims]);

  const request = requestConfig =>
    httpRequest(requestConfig)
      .then(response => response)
      .catch(error => error);

  const fetchIdentityVerificationStatus = async () => {
    setIsIdVStatusLoading(true);
    try {
      const response = await getVerificationStatus();
      setIdvClaims(response);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Something went wrong while getting identity verification status", {
        variant: "error",
      })
    } finally {
      setIsIdVStatusLoading(false);
    }
  };

  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }

    if (!isIdentityVerificationEnabled) {
      return;
    }

    fetchIdentityVerificationStatus();
  }, [state.isAuthenticated]);

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
      url: `${environmentConfig.ASGARDEO_BASE_URL}/scim2/Me`,
    }).then((response) => {
      console.log(response.data);

      if (response.data) {

        if (response.data["urn:scim:schemas:extension:custom:User"]?.accountType === ACCOUNT_TYPES.BUSINESS) {
          setSiteSection(SITE_SECTIONS.BUSINESS);
        } else {
          setSiteSection(SITE_SECTIONS.PERSONAL);
        }
        setUserInfo({
          userId: response.data.id || "",
          username: response.data.userName || "",
          accountType: response.data["urn:scim:schemas:extension:custom:User"].accountType || "N/A",          email: response.data.emails[0] || "",
          givenName: response.data.name.givenName || "",
          familyName: response.data.name.familyName || "",
          mobile: response.data.phoneNumbers[0].value || "",
          country: response.data["urn:scim:wso2:schema"].country || "",
          birthdate: response.data["urn:scim:wso2:schema"].dateOfBirth || "",
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

  const handleStartIdentityVerification = async (e) => {
    e.preventDefault();

    let reInitiate = false;

    if (idvClaims && idvClaims.length > 0) {
      idvClaims.forEach((claim) => {
        if (claim.claimMetadata.onfido_workflow_status === "awaiting_input") {
          reInitiate = true;
        }
      });
    }

    navigate(ROUTES.IDENTITY_VERIFICATION, { state: { reInitiate }})
  };

  if (!userInfo) {
    return;
  }

  if (isIdentityVerificationEnabled && isIdVStatusLoading) {
    return (
      <div className="verification-pending-container">
        <div className="content loading-container">
          <div className="spinner-border text-dark" role="status">
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isIdentityVerificationInProgress) {
    return (
      <div className="verification-pending-container">
        <div className="content">
          <i className="fa fa-clock-o" aria-hidden="true"></i>
          <h5>Identity Verification Pending</h5>
          <p>
            Your identity verification is currently in progress. Please wait for
            the verification to complete.
          </p>
        </div>
      </div>
    );
  }

  if (isIdentityVerificationEnabled && !isIdentityVerified) {
    return (
      <div className="verification-start-container">
        <div className="content">
          <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
          <h5>Identity Verification is Required</h5>
          <p>
            You are required to complete your identity verification before you
            can access your account.
          </p>
          <button
            className="secondary"
            onClick={fetchIdentityVerificationStatus}
          >
            Refresh Status
          </button>
          <button
            className=""
            onClick={handleStartIdentityVerification}
          >
            Start Verification
          </button>
        </div>
      </div>
    );
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
