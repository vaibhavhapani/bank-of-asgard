import React, { useState } from "react";
import PasskeySetup from "../passkey-setup/passkey-setup";
import TotpSetup from "../totp/totp-setup";

const AccountSecurity = ({ accountType }) => {
  const [activeView, setActiveView] = useState("security");

  return (
    <div>
      <h3>Account Security</h3>

      {activeView === "security" && (
        <>
          {accountType === "Personal" && (
            <button onClick={() => setActiveView("passkey")}>
              Manage Passkeys
            </button>
          )}
          {accountType === "Corporate" && (
            <button onClick={() => setActiveView("totp")}>
              Setup TOTP
            </button>
          )}
        </>
      )}

      { activeView === "passkey" && <PasskeySetup onCancel={() => setActiveView("security")} /> }
      { activeView === "totp" && <TotpSetup onCancel={() => setActiveView("security")} /> }
    </div>
  );
}

export default AccountSecurity;
