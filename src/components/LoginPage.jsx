import React, { useState } from 'react';
import './styles/LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './styles/images/bus-logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const LOGIN_URL = process.env.REACT_APP_BACK_END_ENDPOINT + '/authenticate';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passError, setPassError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setUsernameError('');
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPassError('');
    };

    const handleSubmit = async (e) => {
        console.log('LOGIN URL: ' + LOGIN_URL);
        setLoading(true);
        e.preventDefault();

        if (!username.trim()) {
            setUsernameError('Username cannot be blank');
            return;
        }

        if (!password.trim()) {
            setPassError('Password cannot be blank');
            return;
        }

        const data = {
            username: username,
            password: password
        };

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(JSON.stringify(response?.data));
            console.log(JSON.stringify(response));

            if (response?.data) {
                localStorage.setItem('userId', response.data);
            }

            let token = response.headers.get("Authorization");
            console.log('TOKEN: ', token);
            if (token !== null && token !== undefined) {
                localStorage.setItem('token', token)
                navigate('/admin/home');
                return;
            }

            setLoading(false);
            setMessage("Login successful!");
            localStorage.setItem("username", username);
            setUsername("");
            setPassword("");
            navigate("/home");
        } catch (err) {
            setLoading(false);
            if (!err?.response) {
                setMessage('No Server Response');
            } else if (err.response?.status === 400) {
                setMessage('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setMessage(err.response?.data);
            } else {
                setMessage(err.response?.data);
            }
        }
    };

    return (
        <div className="login-body container-fluid d-flex justify-content-center align-items-center vh-100">
            {loading && (
                <div className="text-center" style={{ backgroundColor: "#123abc", padding: "20px" }}>
                    <BeatLoader color={"#ffffff"} loading={loading} />
                </div>
            )}
            <div className="card col-sm-8 col-md-6 col-lg-4">
                <div className="card-header">
                    <img src={logo} alt="Bus Logo" className="bus-logo" />
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
                            {passError && <div className="alert alert-danger mt-2">{passError}</div>}
                        </div>
                        {message && <div className="alert alert-danger mt-2">{message}</div>}
                        <button type="submit" className="btn btn-primary btn-block mt-4">Login</button>
                    </form>
                </div>
                <div className="card-footer">
                    <p className="text-center mb-0">Don't have an account? <Link to="/register">Sign up here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
