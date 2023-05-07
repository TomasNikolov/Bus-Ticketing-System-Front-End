import React, { useState } from "react";
import { Container, Table, Button, Modal, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function UserManagementPage() {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([{ id: 1, name: "User 1", email: "user1@example.com", role: "admin", }, { id: 2, name: "User 2", email: "user2@example.com", role: "user", }, { id: 3, name: "User 3", email: "user3@example.com", role: "user", },]);

    const handleAddClose = () => setShowAddModal(false);
    const handleAddShow = () => setShowAddModal(true);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleAddSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newUser = {
            id: users.length + 1,
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
        };
        setUsers([...users, newUser]);
        setShowAddModal(false);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedUser = {
            ...selectedUser,
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
        };
        const index = users.findIndex((user) => user.id === selectedUser.id);
        setUsers([...users.slice(0, index), updatedUser, ...users.slice(index + 1)]);
        setSelectedUser(null);
        setShowEditModal(false);
    };

    const handleDelete = (user) => {
        const index = users.findIndex((u) => u.id === user.id);
        setUsers([...users.slice(0, index), ...users.slice(index + 1)]);
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 style={{ width: "40%" }}>User Management</h1>
                    <div style={{ width: "20%" }}></div>
                    <Button variant="primary" style={{ width: "10%" }} onClick={handleAddShow}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add User
                    </Button>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
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

                <Modal show={showAddModal} onHide={handleAddClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAddSubmit}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" required />
                            </Form.Group>
                            <Form.Group controlId="type" className="mb-3">
                                <Form.Label>Type</Form.Label>
                                <Form.Control as="select" required>
                                    <option>AC</option>
                                    <option>Non-AC</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="seats" className="mb-3">
                                <Form.Label>No. of Seats</Form.Label>
                                <Form.Control type="number" placeholder="Enter no. of seats" required />
                            </Form.Group>
                            <Form.Group controlId="fare" className="mb-3">
                                <Form.Label>Fare</Form.Label>
                                <Form.Control type="number" placeholder="Enter fare" required />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {selectedUser && (
                    <Modal show={showEditModal} onHide={handleEditClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" defaultValue={selectedUser.name} required />
                                </Form.Group>
                                <Form.Group controlId="type" className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control as="select" defaultValue={selectedUser.type} required>
                                        <option>AC</option>
                                        <option>Non-AC</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="seats" className="mb-3">
                                    <Form.Label>No. of Seats</Form.Label>
                                    <Form.Control type="number" placeholder="Enter no. of seats" defaultValue={selectedUser.seats} required />
                                </Form.Group>
                                <Form.Group controlId="fare" className="mb-3">
                                    <Form.Label>Fare</Form.Label>
                                    <Form.Control type="number" placeholder="Enter fare" defaultValue={selectedUser.fare} required />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                )}
            </Container>

            <footer className="bg-dark text-white py-3" style={{ marginTop: "10rem", height: "10rem" }}>
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
