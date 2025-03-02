import React, { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import EditProfile from "./edit-profile";
import AccountSecurity from "../account-security";

function UserProfile() {
  const { getDecodedIDToken, refreshAccessToken } = useAuthContext();
  const [userInfo, setUserInfo] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getIdToken();
  }, []);

  const handleUpdateSuccess = () => {
    updateToken().then(() => {
      setShowEditForm(false);
    });  
  };

  const getIdToken = () => {
    getDecodedIDToken().then((decodedIdToken) => {
      console.log(decodedIdToken);
      setUserInfo({
        username: decodedIdToken.username  || "N/A",
        accountType:decodedIdToken.accountType,
        email: decodedIdToken.email|| "N/A",
          givenName: decodedIdToken.given_name || "N/A",
          familyName: decodedIdToken.family_name || "N/A",
          mobile: decodedIdToken.phone_number || "N/A",
          country: decodedIdToken.address.country || "N/A",
          birthdate: decodedIdToken.birthdate || "N/A",
      })})
  }

  const updateToken = async () => {
    const refresh = await refreshAccessToken();
    if(refresh) {
      getIdToken();
    }
  }

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  if (error) return <p>{error}</p>;

  // load userinfo before rendering profile details**
  if (!userInfo) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px"}}>
      <AccountSecurity accountType={userInfo.accountType} />

      {showEditForm && userInfo ? (
        <EditProfile
          userInfo={userInfo}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          <h2>User Profile</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <strong>User Name:</strong> {userInfo.username || "N/A"}
            </li>
            <li>
              <strong>Account Type:</strong> {userInfo.accountType || "N/A"}
            </li>
            <li>
              <strong>Full Name:</strong> {userInfo.givenName || "N/A"}{" "}
              {userInfo.familyName}
            </li>
            <li>
              <strong>Email:</strong> {userInfo.email || "N/A"}
            </li>
            <li>
              <strong>Country:</strong> {userInfo.country || "N/A"}
            </li>
            <li>
              <strong>Birth date</strong> {userInfo.birthdate || "N/A"}
            </li>
            <li>
              <strong>Mobile:</strong> {userInfo.mobile || "N/A"}
            </li>
          </ul>
          <button onClick={() => setShowEditForm(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
}

export default UserProfile;
