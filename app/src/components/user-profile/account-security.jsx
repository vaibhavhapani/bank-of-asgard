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
import axios from "axios";
import PasskeySetup from "../passkey-setup/passkey-setup";
import TotpSetup from "../totp/totp-setup";
import { useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { ACCOUNT_TYPES } from "../../constants/app-constants";

const AccountSecurity = ({ accountType, userId }) => {
  const { signOut } = useAuthContext();
  const [error, setError] = useState(null);

  const closeAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to close your account? This action cannot be undone."
    );

    if (!isConfirmed) {
      return; // Exit if user cancels
    }

    try {
      console.log("User requires to close the account!!");
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/close-account`,
        { params: { userId } }
      );

      if (response.status == 200) {
        alert("Account closed successfully");
        signOut();
      }
    } catch (err) {
      console.error("Error Closing Account:", err);
      setError(
        "Error Closing Account: " + (err.response?.data?.detail || err.message)
      );
      console.log(error);
    }
  };

  return (
    <>
      {accountType === ACCOUNT_TYPES.BUSINESS ? (
        <TotpSetup />
      ) : (
        <PasskeySetup />
      )}
      <hr className="divider" />
      <div>
        <button onClick={closeAccount} className="close-account-button">Close Account</button>
      </div>
    </>
  );
}

AccountSecurity.propTypes = {
  accountType: PropTypes.object.isRequired,
  userId: PropTypes.object.isRequired
};

export default AccountSecurity;
