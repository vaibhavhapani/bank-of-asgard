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
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import CountrySelect from "../country-select";
import { ACCOUNT_TYPES } from "../../constants/app-constants";

const SignUpForm = ({ accountType }) => {

  const { signIn } = useAuthContext();

  const [ signupData, setSignupData ] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    username: '',
    password: '',
    email: '',
    mobile: '',
    accountType: accountType
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_ENDPOINT}/signup`, signupData);

      console.log(response.data.message);

      if (response.status == 200) {
        signIn();
      }
  
      console.log('User signed up:', signupData);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="contact_section">
      <div className="container">
        <div className="heading_container heading_center">
          { (accountType === ACCOUNT_TYPES.BUSINESS) ?
            (
              <h2>Create your business account</h2>
            ) : (
              <h2>Create your account</h2>
            )
          }
        </div>
        <div className="">
          <div className="row">
            <div className="col-md-7 mx-auto">
              <form onSubmit={handleSignup} className="contact_form-container">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  placeholder="Enter a username"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  required
                />

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Enter a password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />

                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter first name"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter last name"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={signupData.dateOfBirth}
                  onChange={(e) => setSignupData({ ...signupData, dateOfBirth: e.target.value })}
                  required
                />

                <label htmlFor="country">Country</label>
                <CountrySelect
                  value={signupData.country}
                  onChange={(value) => setSignupData({ ...signupData, country: value?.label || "" })} />

                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="number"
                  placeholder="Enter mobile"
                  value={signupData.mobile}
                  onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                  required
                />

                <button type="submit">Signup</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SignUpForm.propTypes = {
  accountType: PropTypes.object.isRequired
};

export default SignUpForm;
