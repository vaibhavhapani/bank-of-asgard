<img src="./logo.png" width="400" alt="Bank of Asgard" />

# Instructions to use the application

1. Register an organization with Asgardeo.
2. Create a [custom attribute](https://wso2.com/asgardeo/docs/guides/users/attributes/manage-attributes/) with the name `accountType` and add it to the Profile scope. Additionally, include the country attribute in the profile scope too.
3. Create a SPA application.
  * Enable the `Code` and `Refresh Grant` types
  * Add authorize redirect URL: `http://localhost:5173` and allowed origin: `http://localhost:5173`
  * Add the `country` and `accountType` to Profile scope navigating to `User Attributes & Stores` -> `Attributes` -> `OpenId Connect` -> `Scopes` -> `Profile` -> `New Attribute`.
  * Enable the following scopes and attributes within the client application created.  
    * `Profile - Country, First Name, Last Name, Username, Birth Date, AccountType; Email - email;  Phone - telephone; Address - country.`
4. Enable the following authenticators within the client application:
  * `Identifier First` - First Step
  * `Username and Password`, `Passkey` - Second Step
  * `Totp` and `Email OTP` - Third Step
5. Configure the following conditional authentication script (Replace the `<NODE_SERVER_BASE_PATH>` with server URL):
```js
var moneyTransferThres = 10000;
var riskEndpoint = "<NODE_SERVER_BASE_PATH>/risk"

var onLoginRequest = function(context) {

    var isMoneyTransfer = context.request.params.action && context.request.params.action[0] === "money-transfer";

    if (isMoneyTransfer) {
        Log.info("Custom param:" + context.request.params.action[0]);
        Log.info("Custom param:" + context.request.params.transfer_amount[0]);
        var amount = parseInt(context.request.params.transfer_amount[0] || -1);

        executeStep(1);
        if (amount > moneyTransferThres) {
            executeStep(4, {
                stepOptions: {
                    forceAuth: 'true'
                }
            }, {});
        }

    } else {

        executeStep(1, {
            onSuccess: function(context) {
                var user = context.steps[1].subject;
                var accountType = user.localClaims["http://wso2.org/claims/accountType"];
                var country = user.localClaims["http://wso2.org/claims/country"];
                Log.info("Account Type: " + accountType);
                Log.info("Country: " + country);
                var ipAddress = context.request.ip;
                Log.info("IP Address: " + ipAddress);
                var requestPayload = {
                    ip: ipAddress,
                    country: country,
                };
                if (accountType === "Personal") {
                    httpPost(riskEndpoint, requestPayload, {
                        "Accept": "application/json"
                    }, {
                        onSuccess: function(context, data) {
                            Log.info("Successfully invoked the external API.");
                            Log.info("Logging data for country risk: " + data.hasRisk);

                            if (data.hasRisk === false) {
                                executeStep(2, {
                                    authenticationOptions: [{
                                        authenticator: 'FIDOAuthenticator'
                                    }, {
                                        authenticator: 'BasicAuthenticator'
                                    }]
                                }, {
                                    onSuccess: function(context) {
                                        var user = context.currentKnownSubject;
                                        var sessions = getUserSessions(user);
                                        Log.info(sessions);
                                        if (sessions.length > 0) {
                                            executeStep(3, {
                                                authenticationOptions: [{
                                                    authenticator: 'email-otp-authenticator'
                                                }]
                                            }, {});
                                        }
                                    }
                                });
                            } else {
                                executeStep(2, {
                                    authenticationOptions: [{
                                        authenticator: 'FIDOAuthenticator'
                                    }, {
                                        authenticator: 'BasicAuthenticator'
                                    }],
                                }, {});
                                Log.info("In 2nd step for Personal Accounts");

                                executeStep(3, {
                                    authenticationOptions: [{
                                        authenticator: 'email-otp-authenticator'
                                    }]
                                }, {});
                            }
                        },
                        onFail: function(context, data) {
                            Log.error("Failed to invoke risk API");
                            fail();
                        }
                    });
                } else if (accountType === "Business") {
                    Log.info("In second step for Business");

                    executeStep(2, {
                        authenticationOptions: [{
                            authenticator: 'BasicAuthenticator'
                        }]
                    }, {});
                    var preferredClaimURI = "http://wso2.org/claims/identity/preferredMFAOption";
                    var preferredClaim = user.localClaims[preferredClaimURI];

                    if (preferredClaim != null) {
                        Log.info("Preferred Claim Available");

                        var jsonObj = JSON.parse(preferredClaim);
                        var authenticationOption = jsonObj.authenticationOption;
                        Log.info("preferredClaim authenticationOption " + authenticationOption);
                        executeStep(3, {
                            authenticationOptions: [{
                                authenticator: authenticationOption
                            }],
                        }, {});
                    } else {
                        Log.info("Preferred claim not available and in 3rd step");
                        executeStep(3, {
                            authenticationOptions: [{
                                authenticator: 'totp'
                            }, {
                                authenticator: 'email-otp-authenticator'
                            }]
                        }, {
                            onSuccess: function(context) {
                                var preferredClaimURI = "http://wso2.org/claims/identity/preferredMFAOption";
                                Log.info("3rd step successful");
                                var user = context.steps[3].subject;
                                var isFirstLogin = user.localClaims["http://wso2.org/claims/isFirstLogin"];
                                Log.info("User isFirstLogin claim:" + isFirstLogin);
                                if (isFirstLogin === "false") {
                                    var authenticatorName = context.steps[3].authenticator;
                                    var preferredMFA = {
                                        authenticationOption: authenticatorName
                                    };
                                    user.localClaims[preferredClaimURI] = JSON.stringify(preferredMFA);
                                    Log.info("Preferred MFA set from second login for user" + user.username + " as " + user.localClaims[preferredClaimURI]);
                                } else {
                                    user.localClaims["http://wso2.org/claims/isFirstLogin"] = false;
                                    Log.info("User logged in for the first time. Setting isFirstLogin to false");
                                }
                            }
                        });
                    }
                }
            },
            onFail: function(context) {
                Log.info('User not found');
                var parameterMap = {
                    'errorCode': 'login_failed',
                    'errorMessage': 'login could not be completed',
                    "errorURI": 'https://localhost:9443/authenticationendpoint/login.jsp'
                };
                fail(parameterMap);

            }
        });
    }
};

```
6. Create a standard web application and enable the following grant types:
  `Code`, `Client Credentials`
7. Add the Authorized redirect URLs and allowed origins:
redirect url: `https://localhost:5003`, allowed origin: `https://localhost:5003 http://localhost:5173`

8. Enable API Authorization access for SCIM2 Users API with the scopes:
```
internal_user_mgt_create internal_user_mgt_list internal_user_mgt_view internal_user_mgt_delete internal_user_mgt_update
```
9. Navigate to Connections -> Passkey Setup -> Add the Trusted Origins: `http://localhost:5173` and enable `Allow Passkey usernameless authentication` option. 

 10. Navigate to root directory and run `npm i`.
 11. Create a copy of `app/public/config.example.js` inside the `app/public/` folder. And name it as `config.js`. Update the config values accordingly.
 12. Navigate to `App_home/app` and execute `npm start` to run the application.
 13. Navigate to `App_home/server` and execute `nodemon server.js` to run the server.
 14. Test the application from registration of a personal and corporate account types.
