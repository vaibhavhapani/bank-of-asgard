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

import propTypes from "prop-types";

const PasswordValidation = ({ password }) => {

    // Password validation criteria
    const validations = [
        { regex: /.{8,}/, label: "Minimum 8 characters" },
        { regex: /[A-Z]/, label: "At least 1 uppercase letter" },
        { regex: /[a-z]/, label: "At least 1 lowercase letter" },
        { regex: /\d/, label: "At least 1 number" },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, label: "At least 1 special character" },
    ];

    return (
        <ul className="password-validation">
            { validations.map((rule, index) => (
            <li
                key={ index }
                className={ `${ rule.regex.test(password) ? "text-success" : "" }` }
            >
                <i className={ `fa ${ rule.regex.test(password) ? "fa-check" : "fa-times" }`}></i>
                { rule.label }
            </li>
            ))}
        </ul>
    );
}

PasswordValidation.propTypes = {
    password: propTypes.string.isRequired
};

export default PasswordValidation;
