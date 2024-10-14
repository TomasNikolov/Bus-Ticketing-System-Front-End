import React, { useState, useEffect } from "react";
import { Form, Button, Nav, Navbar } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";

function EditProfile() {
    const name = localStorage.getItem('username');
    const [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            setMessage('');
            setSuccessMessage('');
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/user?username=${name}`,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log("RESPONSE: ", JSON.stringify(response?.data));

                if (response?.data) {
                    setUser(response.data);
                    setUsername(response.data.username);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setLoading(false);
                }
            } catch (err) {
                if (!err?.response) {
                    setMessage('No Server Response');
                    setLoading(false);
                } else if (err.response?.status === 403) {
                    console.log(JSON.stringify(err.response));
                    setMessage("Access Denied. You don't have permission to access this resource. Please contact the system administrator if you believe you should have access.");
                    setLoading(false);
                } else if (err.response?.status === 404) {
                    console.log(JSON.stringify(err.response?.data?.message[0]));
                    setMessage(err.response?.data?.message[0]);
                    setLoading(false);
                } else {
                    setMessage("Internal server error");
                    setLoading(false);
                }
            }
        };
        fetchUsers();
    }, [name]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setDisableButton(true);

        const data = {
            id: user.id,
            username: username,
            firstName: firstName,
            lastName: lastName
        };

        console.log('User: ', JSON.stringify(data));

        try {
            const response = await axios.put("http://localhost:8080/user",
                JSON.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 200) {
                setSuccessMessage('User has been successfully updated.');
                localStorage.setItem('username', username);
                setTimeout(() => { }, 5000);
                setLoading(false);
                setDisableButton(false);
                window.location.reload();
            }
        } catch (err) {
            if (!err?.response) {
                setMessage('No Server Response');
                setLoading(false);
                setDisableButton(false);
            } else if (err.response?.status === 403) {
                console.log(JSON.stringify(err.response));
                setMessage("Access Denied. You don't have permission to access this resource. Please contact the system administrator if you believe you should have access.");
                setLoading(false);
                setDisableButton(false);
            } else if (err.response?.status === 404) {
                console.log(JSON.stringify(err.response?.data?.message[0]));
                setMessage(err.response?.data?.message[0]);
                setLoading(false);
                setDisableButton(false);
            } else {
                setMessage("Internal server error");
                setLoading(false);
                setDisableButton(false);
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={{ background: "#f5f5f5" }}>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand as={Link} to="/home">
                    Bus Ticketing System
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/home">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/find_bus">
                            Find a Bus
                        </Nav.Link>
                        <Nav.Link as={Link} to="/my_bookings">
                            My Bookings
                        </Nav.Link>
                        <Nav.Link onClick={handleLogout}>
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <br />

            <div className="edit-profile-form">
                <h1 className="text-center mb-4">Edit Profile</h1>

                {message && <div className="alert alert-danger mt-2">{message}</div>}
                {successMessage && <div className="alert alert-success mt-2">{successMessage}</div>}

                <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded" style={{ fontSize: "1.2em", maxWidth: "600px", margin: "0 auto", backgroundColor: "#f9f9f9" }}>
                    <Form.Group controlId="username" className="mb-4">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={username}
                            onChange={handleUsernameChange}
                            style={{ fontSize: "1.1em", padding: "12px" }}
                        />
                    </Form.Group>

                    <Form.Group controlId="firstName" className="mb-4">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            style={{ fontSize: "1.1em", padding: "12px" }}
                        />
                    </Form.Group>

                    <Form.Group controlId="lastName" className="mb-4">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleLastNameChange}
                            style={{ fontSize: "1.1em", padding: "12px" }}
                        />
                    </Form.Group>

                    <div className="text-center">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={disableButton}
                            style={{ fontSize: "1.2em", padding: "10px 30px", width: "100%" }}>
                            Save Changes
                        </Button>
                    </div>
                </Form>
            </div>

            {loading && (
                <div className="text-center">
                    <BeatLoader color={"#123abc"} loading={loading} />
                </div>
            )}

            <footer className="bg-dark text-white py-3" style={{ marginTop: "15rem", height: "10rem" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h4>About Us</h4>
                            <p>Bus Ticketing Company.</p>
                        </div>
                        <div className="col-md-6">
                            <h4>Contact Us</h4>
                            <ul className="list-unstyled">
                                <li>City, State Zip</li>
                                <li>Phone: (555) 555-5555</li>
                                <li>Email: info@example.com</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary text-center py-2" style={{ height: "3.5rem" }}>
                    <p className="mb-0">&copy; 2024 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default EditProfile;