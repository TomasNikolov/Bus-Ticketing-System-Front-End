import React, { useState } from 'react';
import './LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './bus-logo.png';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username.trim()) {
            setError('Username cannot be blank');
            return;
        }

        if (!password.trim()) {
            setError('Password cannot be blank');
            return;
        }

        console.log(`Username: ${username} Password: ${password}`);
        // Perform login logic here
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
            <div className="card col-sm-8 col-md-6 col-lg-4">
                <div className="card-header">
                    <img src={logo} alt="Bus Logo" className="bus-logo" />
                    <h1 className="text-center">Bus Ticketing System</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" className="form-control" value={username} autoFocus required onChange={handleUsernameChange} />
                            {error && <div className="alert alert-danger mt-2">{error}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" className="form-control" value={password} autoFocus required onChange={handlePasswordChange} />
                            {error && <div className="alert alert-danger mt-2">{error}</div>}
                        </div>
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
