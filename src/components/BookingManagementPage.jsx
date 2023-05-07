import React, { useState } from "react";
import { Container, Table, Button, Modal, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function BookingManagementPage() {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "johndoe@example.com",
            date: "2023-05-15",
            time: "10:00 AM",
            status: "Pending",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "janesmith@example.com",
            date: "2023-05-16",
            time: "11:00 AM",
            status: "Approved",
        },
        {
            id: 3,
            name: "Bob Johnson",
            email: "bobjohnson@example.com",
            date: "2023-05-17",
            time: "12:00 PM",
            status: "Rejected",
        },
    ]);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = (booking) => {
        setSelectedBooking(booking);
        setShowEditModal(true);
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedBooking = {
            ...selectedBooking,
            name: formData.get("name"),
            email: formData.get("email"),
            date: formData.get("date"),
            time: formData.get("time"),
            status: formData.get("status"),
        };
        const index = bookings.findIndex((booking) => booking.id === selectedBooking.id);
        setBookings([...bookings.slice(0, index), updatedBooking, ...bookings.slice(index + 1)]);
        setSelectedBooking(null);
        setShowEditModal(false);
    };

    const handleDelete = (booking) => {
        const index = bookings.findIndex((b) => b.id === booking.id);
        setBookings([...bookings.slice(0, index), ...bookings.slice(index + 1)]);
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
                    <h1>Booking Management</h1>
                    {/* <div style={{ width: "20%" }}></div>
                    <Button variant="primary" style={{ width: "10%" }} onClick={handleAddShow}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add User
                    </Button> */}
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.name}</td>
                                <td>{booking.email}</td>
                                <td>{booking.date}</td>
                                <td>{booking.time}</td>
                                <td>{booking.status}</td>
                                <td>
                                    <div className="d-flex">
                                        <div style={{ width: "5%" }}></div>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            className="mr-2 ml-2"
                                            onClick={() => handleEditShow(booking)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <div style={{ width: "10%" }}></div>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(booking)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* <Modal show={showAddModal} onHide={handleAddClose}>
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
                </Modal> */}

                {selectedBooking && (
                    <Modal show={showEditModal} onHide={handleEditClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Booking</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" defaultValue={selectedBooking.name} required />
                                </Form.Group>
                                <Form.Group controlId="type" className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control as="select" defaultValue={selectedBooking.type} required>
                                        <option>AC</option>
                                        <option>Non-AC</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="seats" className="mb-3">
                                    <Form.Label>No. of Seats</Form.Label>
                                    <Form.Control type="number" placeholder="Enter no. of seats" defaultValue={selectedBooking.seats} required />
                                </Form.Group>
                                <Form.Group controlId="fare" className="mb-3">
                                    <Form.Label>Fare</Form.Label>
                                    <Form.Control type="number" placeholder="Enter fare" defaultValue={selectedBooking.fare} required />
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

export default BookingManagementPage;