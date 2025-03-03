<img src="./logo.png" width="400" alt="Bank of Asgard" />

# Instructions to use the application

1. Register an organisation with Asgardeo.
2. Create a [custom attribute](https://wso2.com/asgardeo/docs/guides/users/attributes/manage-attributes/) with the name `accountType` and add it to the Profile scope. Additionally, include the country attribute in the profile scope too.
3. Create a SPA application.
  * Enable the `Code` and `Refresh Grant` types
  * Add authorise redirect URL: `http://localhost:5173` and allowed origin: `http://localhost:5173`
  * Enable the following scopes and attributes within the client application created.  
    * `Profile - Country, First Name, Last Name, Username, Birth Date, AccountType; Email;  Phone.`
4. Enable the following authenticators within the client application:
  * `Identifier First` - First Step
  * `Username and Password`, `Passkey` - Second Step
  * `Totp` and `Email OTP` - Third Step
5. Configure the following conditional authentication script:
```js
var onLoginRequest = function (context) {
    executeStep(1, {
        onSuccess: function (context) {
            var user = context.steps[1].subject;
            var accountType = user.localClaims["http://wso2.org/claims/accountType"];
            var country = user.localClaims["http://wso2.org/claims/country"];

            var requestPayload = {
                ip: "112.87.14.181",  // Cannot retrieve the correct IP from the context. Therefore hardcode your ip address here for testing
                country: country,
            };
            if (accountType === "Personal") {
                httpGet(`https://api.ipgeolocation.io/ipgeo?apiKey=248c11c007ce4c7db07127c0a043288c&ip=${requestPayload.ip}&fields=country_name`,
                    {
                        onSuccess: function (context, data) {
                            Log.info("Successfully invoked the external API.");
                            Log.info("Logging data: " + data.country_name);
                            var country = context.steps[1].subject.localClaims["http://wso2.org/claims/country"];

                            if(data.country_name === country) {
                                executeStep(2, {
                                authenticationOptions: [{ authenticator: 'FIDOAuthenticator' }, { authenticator: 'BasicAuthenticator' }]
                                }, {
                                    onSuccess: function (context) {
                                        var user = context.currentKnownSubject;
                                        var sessions = getUserSessions(user);
                                        Log.info(sessions);
                                        if (sessions.length > 0) {
                                            executeStep(3, {
                                                authenticationOptions:[{
                                                    authenticator: 'email-otp-authenticator'
                                                }]}, {}
                                            );                                          
                                        }
                                    }
                                });                           
                            } else {
                                executeStep(2, { authenticationOptions: [{ authenticator: 'FIDOAuthenticator' }, { authenticator: 'BasicAuthenticator' }], }, {});
                                Log.info("In 2nd step for Personal Accounts");

                                executeStep(3, {
                                    authenticationOptions:[{
                                        authenticator: 'email-otp-authenticator'
                                    }]}, {}
                                );                            
                            }
                        },
                    }
                );
            } else if (accountType === "Corporate") {
                Log.info("In second step for Corporate");

                executeStep(2, {
                    authenticationOptions: [{
                        authenticator: 'BasicAuthenticator'
                    }]
                }, {}
                );
                var preferredClaimURI = "http://wso2.org/claims/identity/preferredMFAOption";
                var preferredClaim = user.localClaims[preferredClaimURI];
                
                if (preferredClaim != null) {
                    Log.info("Preferred Claim Available");

                    var jsonObj = JSON.parse(preferredClaim);
                    var authenticationOption = jsonObj.authenticationOption;
                    Log.info("preferredClaim authenticationOption " + authenticationOption);
                    executeStep(3, { authenticationOptions: [{ authenticator: authenticationOption }], }, {});
                } else {
                    Log.info("Preferred claim not available and in 3rd step");
                    executeStep(3, {
                        authenticationOptions: [{ authenticator: 'totp' }, { authenticator: 'email-otp-authenticator' }]  
                    }, {
                        onSuccess: function (context) {
                            Log.info("3rd step successful");
                            var preferredClaimURI = "http://wso2.org/claims/identity/preferredMFAOption";
                            var authenticatorName = context.steps[3].authenticator;
                            var preferredMFA = {
                                authenticationOption: authenticatorName
                            };
                            context.steps[3].subject.localClaims[preferredClaimURI] = JSON.stringify(preferredMFA);
                            Log.info(context.steps[3].subject.localClaims[preferredClaimURI]);
                        }
                    });
                }
            }
        },
    });
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

 10. Navigate to root directory and run `pnpm i`.
 11. Navigate to `App_home/app` and execute `pnpm dev` to run the application.
 12. Navigate to `App_home/server` and execute `nodemon server.js` to run the server.
 13. Test the application from registration of a personal and corporate account types.
