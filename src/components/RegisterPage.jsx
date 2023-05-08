import React, { useState } from 'react';
import './styles/RegisterPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const CONFIRMATION_URL = 'http://localhost:3000/confirm-account?token=';
const REGISTER_URL = 'http://localhost:8080/user/register';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [message, setMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const navigate = useNavigate();
    const minUsernameLength = 6;
    const minPasswordLength = 8;
    const [disableButton, setDisableButton] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError('');
    };

    const handleFirtstNameChange = (event) => {
        setFirstName(event.target.value);
        setFirstNameError('');
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        setLastNameError('');
    };

    const handleSubmit = async (e) => {
        setLoading('true');
        setDisableButton(true);
        e.preventDefault();

        if (username.length < minUsernameLength) {
            setUsernameError('Username must be at least 6 characters long.');
            setLoading(false);
            setDisableButton(false);return;
        }

        if (password.length < minPasswordLength) {
            setPasswordError('Password must be at least 8 characters long.');
            setLoading(false);
            setDisableButton(false); return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            setLoading(false);
            setDisableButton(false);
            return;
        }

        const data = {
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirmationUrl: CONFIRMATION_URL
        };

        console.log("DATA: ", JSON.stringify(data));

        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log(JSON.stringify(response));

            setLoading(false);
            setDisableButton(false);
            setMessage("Registration successful!");
            setUsername("");
            setPassword("");
            setEmail("");
            setFirstName("");
            setLastName("");
            setConfirmPassword("");
            navigate("/confirmation");
        } catch (err) {
            if (!err?.response) {
                setMessage('No Server Response');
                setLoading(false);
                setDisableButton(false);
            } else if (err.response?.status === 400) {
                setMessage(err.response?.data?.message[0]);
                setLoading(false);
                setDisableButton(false);
            } else if (err.response?.status === 401) {
                setMessage('Unauthorized');
                setLoading(false);
                setDisableButton(false);
            } else {
                setMessage('Login Failed');
                setLoading(false);
                setDisableButton(false);
            }
        }
    };

    return (
        <div className="register-body container-fluid d-flex justify-content-center align-items-center vh-100">
            {loading && (
                <div className="text-center" style={{ backgroundColor: "#123abc", padding: "20px" }}>
                    <BeatLoader color={"#ffffff"} loading={loading} />
                </div>
            )}
            <div className="card col-sm-8 col-md-6 col-lg-4">
                <div className="card-header">
                    <h1 className="text-center">Sign Up</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="username">Username:</label>
                                    <input type="text" id="username" className="form-control" value={username} autoFocus required onChange={handleUsernameChange} />
                                    {usernameError && <div className="alert alert-danger mt-2">{usernameError}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" className="form-control" value={email} autoFocus required onChange={handleEmailChange} />
                                    {emailError && <div className="alert alert-danger mt-2">{emailError}</div>}
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name:</label>
                                    <input type="text" id="firstName" className="form-control" value={firstName} autoFocus required onChange={handleFirtstNameChange} />
                                    {firstNameError && <div className="alert alert-danger mt-2">{firstNameError}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name:</label>
                                    <input type="text" id="lastName" className="form-control" value={lastName} autoFocus required onChange={handleLastNameChange} />
                                    {lastNameError && <div className="alert alert-danger mt-2">{lastNameError}</div>}
                                </div>
                            </div>
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
                        <button type="submit" className="btn btn-primary btn-block mt-4" disabled={disableButton}>Register</button>
                    </form>


                    {/* <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" className="form-control" value={username} autoFocus required onChange={handleUsernameChange} />
                            {usernameError && <div className="alert alert-danger mt-2">{usernameError}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" className="form-control" value={email} autoFocus required onChange={handleEmailChange} />
                            {emailError && <div className="alert alert-danger mt-2">{emailError}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name :</label>
                            <input type="text" id="firstName" className="form-control" value={firstName} autoFocus required onChange={handleFirtstNameChange} />
                            {firstNameError && <div className="alert alert-danger mt-2">{firstNameError}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" id="lastName" className="form-control" value={lastName} autoFocus required onChange={handleLastNameChange} />
                            {lastNameError && <div className="alert alert-danger mt-2">{lastNameError}</div>}
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
                        <button type="submit" className="btn btn-primary btn-block mt-4" disabled={disableButton}>Register</button>
                    </form> */}
                </div>
                <div className="card-footer">
                    <p className="text-center mb-0">Already have an account? <Link to="/">Login here.</Link></p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
