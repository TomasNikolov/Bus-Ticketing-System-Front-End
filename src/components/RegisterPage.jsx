import React, { useState } from 'react';
import './styles/RegisterPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const REGISTER_URL = 'http://localhost:8080/user/register';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const minUsernameLength = 6;
    const minPasswordLength = 8;

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setUsernameError('');
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username.length < minUsernameLength) {
            setUsernameError('Username must be at least 6 characters long.');
            return;
        }

        if (password.length < minPasswordLength) {
            setPasswordError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return;
        }

        const data = {
            username: username,
            password: password,
        };

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(JSON.stringify(response?.data));
            console.log(JSON.stringify(response));

            setMessage("Registration successful!");
            setUsername("");
            setPassword("");
            navigate("/");
        } catch (err) {
            if (!err?.response) {
                setMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setMessage(err.response?.data?.message[0]);
            } else if (err.response?.status === 401) {
                setMessage('Unauthorized');
            } else {
                setMessage('Login Failed');
            }
        }
    };

    return (
        <div className="register-body container-fluid d-flex justify-content-center align-items-center vh-100">
            <div className="card col-sm-8 col-md-6 col-lg-4">
                <div className="card-header">
                    <h1 className="text-center">Sign Up</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" className="form-control" value={username} autoFocus required onChange={handleUsernameChange} />
                            {usernameError && <div className="alert alert-danger mt-2">{usernameError}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" className="form-control" value={password} autoFocus required onChange={handlePasswordChange} />
                            {passwordError && <div className="alert alert-danger mt-2">{passwordError}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input type="password" id="confirmPassword" className="form-control" value={confirmPassword} autoFocus required onChange={handleConfirmPasswordChange} />
                            {confirmPasswordError && <div className="alert alert-danger mt-2">{confirmPasswordError}</div>}
                        </div>
                        {message && <div className="alert alert-danger mt-2">{message}</div>}
                        <button type="submit" className="btn btn-primary btn-block mt-4">Register</button>
                    </form>
                </div>
                <div className="card-footer">
                    <p className="text-center mb-0">Already have an account? <Link to="/">Login here.</Link></p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
