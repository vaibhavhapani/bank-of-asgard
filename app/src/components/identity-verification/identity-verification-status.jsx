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

import { useSnackbar } from "notistack";
import { getVerificationStatus } from "../../api/identity-verification";
import { useState } from "react";
import { useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { useMemo } from "react";
import { ROUTES } from "../../constants/app-constants";
import { useNavigate } from "react-router";
import { environmentConfig } from "../../util/environment-util";

const IdentityVerificationStatus = () => {
  const { state } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [isIdVStatusLoading, setIsIdVStatusLoading] = useState(true);
  const [idvClaims, setIdvClaims] = useState([]);

  const verifiableClaims = environmentConfig.IDENTITY_VERIFICATION_CLAIMS || [];

  const isIdentityVerified = useMemo(() => {
    if (idvClaims) {
      if (
        verifiableClaims.every((claimUri) => {
          return idvClaims.some(
            (idvClaim) =>
              idvClaim.uri === claimUri && idvClaim.isVerified === true
          );
        })
      ) {
        return true;
      }
    }
    return false;
  }, [idvClaims]);

  const isIdentityVerificationInProgress = useMemo(() => {
    if (idvClaims) {
      if (idvClaims.length === 0) {
        return false;
      }

      if (
        idvClaims.some(
          (claim) => claim.claimMetadata.onfido_workflow_status === "processing"
        )
      ) {
        return true;
      }
    }
    return false;
  }, [idvClaims]);

  const fetchIdentityVerificationStatus = async () => {
    setIsIdVStatusLoading(true);
    try {
      const response = await getVerificationStatus();
      setIdvClaims(response);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        "Something went wrong while getting identity verification status",
        {
          variant: "error",
        }
      );
    } finally {
      setIsIdVStatusLoading(false);
    }
  };

  useEffect(() => {
    if (!state.isAuthenticated) {
      return;
    }

    fetchIdentityVerificationStatus();
  }, [state.isAuthenticated]);

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

    navigate(ROUTES.IDENTITY_VERIFICATION, { state: { reInitiate } });
  };

  if (isIdVStatusLoading || isIdentityVerified) {
    return null;
  }

  return (
    <div className="identity-verification-message">
      <div className="container-fluid content-wrapper">
        {isIdentityVerificationInProgress && (
          <>
            <i className="fa fa-clock-o" aria-hidden="true"></i>
            <p>
              Your identity verification is currently in progress. Please wait
              for the verification to complete.
            </p>
          </>
        )}

        {!isIdentityVerified && !isIdentityVerificationInProgress && (
          <>
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            <p>
              In order to perform money transfers higher than $10,000, you need
              to verify your identity.
            </p>
            <a onClick={handleStartIdentityVerification}>Start Verification</a>
          </>
        )}
      </div>
    </div>
  );
};

export default IdentityVerificationStatus;
