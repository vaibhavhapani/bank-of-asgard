import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { QRCodeCanvas } from "qrcode.react";

function TotpSetup({ onCancel }) {
    const { httpRequest } = useAuthContext();
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [decodedQrCodeUrl, setDecodedQrCodeUrl] = useState(null);
    const [error, setError] = useState(null);
    const [otpCode, setOtpCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [setupComplete, setSetupComplete] = useState(false);
    const [totpEnabled, setTotpEnabled] = useState(false);

    const request = requestConfig =>
        httpRequest(requestConfig)
            .then(response => response)
            .catch(error => error);

    useEffect(() => {
        checkTotpStatus();
    }, []);

   

    const checkTotpStatus = async () => {
        try {
            const response = await request({
                method: "GET",
                url: "https://api.asgardeo.io/t/sampleorg1/api/users/v1/me/mfa/authenticators",
                headers: { "Content-Type": "application/json" },
            });

            if (response.data.enabledAuthenticators && response.data.enabledAuthenticators.includes("totp")) {
                setTotpEnabled(true);
                fetchQrCode(); // If already enabled, show QR code
            } else {
                setTotpEnabled(false);
            }
        } catch (err) {
            setError("Error checking TOTP status: " + (err.response?.data?.detail || err.message));
        }
    };


    const registerTotp = async () => {
        try {
            const response = await request({
                method: "POST",
                url: "https://api.asgardeo.io/t/sampleorg1/api/users/v1/me/totp",
                headers: { "accept": "application/json" },
                data: { "action": "INIT" }
            });

            if (response.data.qrCodeUrl) {
                console.log(response.data.qrCodeUrl);
                setQrCodeUrl(response.data.qrCodeUrl);
                setDecodedQrCodeUrl(decodeBase64(response.data.qrCodeUrl));

            } else {
                setError("Failed to register TOTP.");
            }
        } catch (err) {
            setError("Error setting up TOTP: " + (err.response?.data?.detail || err.message));
        }
    };

    const fetchQrCode = async () => {
        try {
            const response = await request({
                method: "POST",
                url: "https://api.asgardeo.io/t/sampleorg1/api/users/v1/me/totp",
                headers: { "Content-Type": "application/json" },
                data: { action: "VIEW" },
            });

            if (response.data?.qrCodeUrl) {
                setQrCodeUrl(response.data.qrCodeUrl);
                setDecodedQrCodeUrl(decodeBase64(response.data.qrCodeUrl));
            } else {
                setError("Failed to retrieve QR code.");
            }
        } catch (err) {
            setError("Error fetching QR code: " + (err.response?.data?.detail || err.message));
        }
    };

    const validateOtp = async () => {
        try {
            if (!otpCode) {
                setError("Please enter the OTP code.");
                return;
            }
            setIsValidating(true);

            const response = await request({
                method: "POST",
                url: "https://api.asgardeo.io/t/sampleorg1/api/users/v1/me/totp",
                headers: { "Content-Type": "application/json" },
                data: { action: "VALIDATE", verificationCode: otpCode },
            });

            if (response.data.isValid) {
                setSetupComplete(true);
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch (err) {
            setError("Error validating OTP: " + (err.response?.data?.detail || err.message));
        } finally {
            setIsValidating(false);
        }
    };

    const decodeBase64 = (encodedString) => {
        try {
          return atob(encodedString);
        } catch (e) {
          console.error("Failed to decode QR Code URL:", e);
          return null;
        }
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px", maxWidth: "500px", margin: "auto" }}>
            <h2>Setup TOTP</h2>

            {setupComplete ? (
                <>
                    <p>TOTP setup is complete. You can now use the authenticator app.</p>
                    <button onClick={onCancel}>Done</button>
                </>
            ) : (
                <>
                    {totpEnabled ? (
                        <>
                            <p>Scan this QR code to reconfigure your authenticator app:</p>
                            {qrCodeUrl && 
                            <div style={{ padding: "10px", display: "inline-block" }}>
                                <QRCodeCanvas value={decodedQrCodeUrl}/>
                            </div>
                            }
                            <button onClick={onCancel} style={{ marginTop: "10px" }}>Done</button>
                        </>
                    ) : (
                        <>
                            {!qrCodeUrl ? (
                                <button onClick={registerTotp}>Generate QR Code</button>
                            ) : (
                                <>
                                    <p>Scan this QR code with your authenticator app:</p>
                                    <div style={{ padding: "10px", display: "inline-block" }}>

                                        <QRCodeCanvas value={decodedQrCodeUrl}/>
                                    </div>
                                    <h3>Validate First-Time OTP</h3>
                                    <p>Enter the 6-digit OTP code generated by your app:</p>
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        style={{ width: "100%", padding: "8px", fontSize: "16px", marginBottom: "10px" }}
                                    />
                                    <button onClick={validateOtp} disabled={isValidating} style={{ marginRight: "10px" }}>
                                        {isValidating ? "Validating..." : "Validate OTP"}
                                    </button>
                                    <button onClick={onCancel} style={{ backgroundColor: "#ccc" }}>Cancel</button>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default TotpSetup;