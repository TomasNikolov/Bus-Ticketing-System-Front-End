import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";

function UserManagementPage() {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setMessage('');
            setSuccessMessage('');
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/admin/users",
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );

                console.log("RESPONSE: ", JSON.stringify(response?.data));

                if (response?.data) {
                    setUsers(response.data);
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
    }, []);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const formData = event.target.elements;
        const updatedUser = {
            id: selectedUser.id,
            username: formData.username.value,
            firstName: formData.firstName.value,
            lastName: formData.lastName.value,
            enabled: formData.enabled.value,
            role: formData.role.value
        };

        console.log('UPDATED USER: ', JSON.stringify(updatedUser));

        try {
            const response = await axios.put("http://localhost:8080/admin/users",
                JSON.stringify(updatedUser),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 200) {
                setSuccessMessage('User has been successfully updated.');
                setTimeout(() => { }, 5000);
                setSelectedUser(null);
                setShowEditModal(false);
                window.location.reload();
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

    const handleDelete = async (user) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/admin/users?id=${user.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 204) {
                setSuccessMessage('User has been successfully deleted.');
                setTimeout(() => { }, 5000);
                window.location.reload();
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

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand as={Link} to="/admin/home">
                    Bus Ticketing System
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/admin/home">
                            Home
                        </Nav.Link>
                        <NavDropdown title="Manage" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/admin/buses">
                                Bus Management
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/bookings">
                                Booking Management
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/users">
                                User Management
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link onClick={handleLogout}>
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Container className="mt-4" style={{ paddingTop: "2rem" }}>
                {message && <div className="alert alert-danger mt-2">{message}</div>}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>User Management</h1>
                </div>
                {users.length === 0 ? (
                    <div className="alert alert-info">
                        <p>Currently, there are no users registered in the system. Please check back later.</p>
                    </div>) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Enabled</th>
                                <th>Role</th>
                                <th>Action(Edit/Delete)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td type="number">{user.id}</td>
                                    <td type="text">{user.username}</td>
                                    <td type="email">{user.email}</td>
                                    <td type="text">{user.firstName}</td>
                                    <td type="text">{user.lastName}</td>
                                    <td type="text">{user.enabled.toString()}</td>
                                    <td type="text">{user.role}</td>
                                    <td>
                                        <div className="d-flex">
                                            <div style={{ width: "5%" }}></div>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="mr-2 ml-2"
                                                onClick={() => handleEditShow(user)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <div style={{ width: "10%" }}></div>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(user)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {loading && (
                    <div className="text-center">
                        <BeatLoader color={"#123abc"} loading={loading} />
                    </div>
                )}

                {selectedUser && (
                    <Modal show={showEditModal} onHide={handleEditClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {successMessage && <div className="alert alert-success mt-2">{successMessage}</div>}
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" defaultValue={selectedUser.username} required />
                                </Form.Group>
                                <Form.Group controlId="firstName" className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter first name" defaultValue={selectedUser.firstName} required />
                                </Form.Group>
                                <Form.Group controlId="lastName" className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter last name" defaultValue={selectedUser.lastName} required />
                                </Form.Group>
                                <Form.Group controlId="enabled" className="mb-3">
                                    <Form.Label>Enabled</Form.Label>
                                    <Form.Control as="select" defaultValue="True" required>
                                        <option>True</option>
                                        <option>False</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="role" className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control as="select" defaultValue={selectedUser.role} required>
                                        <option>USER</option>
                                        <option>ADMIN</option>
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                )}
            </Container>

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
                    <p className="mb-0">&copy; 2023 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
export default UserManagementPage;
