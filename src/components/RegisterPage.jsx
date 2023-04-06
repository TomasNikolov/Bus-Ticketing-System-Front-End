import React, { useState } from 'react';
import './RegisterPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
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

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        console.log(`Username: ${username} Password: ${password}`);
        // Perform registration logic here
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
            <div className="card col-sm-8 col-md-6 col-lg-4">
                <div className="card-header">
                    <h1 className="text-center">Sign Up</h1>
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
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input type="password" id="confirmPassword" className="form-control" value={confirmPassword} autoFocus required onChange={handleConfirmPasswordChange} />
                            {error && <div className="alert alert-danger mt-2">{error}</div>}
                        </div>
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
