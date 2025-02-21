import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
//import { Button } from '@/components/ui/button';
import axios from "axios";

function Signup() {
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    username: '',
    password: '',
    email: '',
    mobile: '',
    accountType: ''
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5003/signup", signupData);
      //alert(response.data.message);
      console.log(response.data.message);
      //setSignupData({ ...signupData, [e.target.name]: e.target.value });

      console.log('User signed up:', signupData);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              value={signupData.username}
              onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={signupData.firstName}
              onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={signupData.lastName}
              onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
              required
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={signupData.dateOfBirth}
              onChange={(e) => setSignupData({ ...signupData, dateOfBirth: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={signupData.country}
              onChange={(e) => setSignupData({ ...signupData, country: e.target.value })}
              required
            />
            
            <input
              type="number"
              placeholder="Mobile"
              value={signupData.mobile}
              onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
              required
            />
            <select name="accountType" value={signupData.accountType} 
              onChange={(e) => setSignupData({ ...signupData, accountType: e.target.value })} required>
              <option value="">Select Account Type</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
            <button type="submit">Signup</button>
          </form>
    </div>
  );
}

export default Signup;