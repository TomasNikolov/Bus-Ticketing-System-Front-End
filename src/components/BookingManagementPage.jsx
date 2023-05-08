import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";

function BookingManagementPage() {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            setMessage('');
            setSuccessMessage('');
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/admin/bookings",
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );

                console.log("RESPONSE: ", JSON.stringify(response?.data));

                if (response?.data) {
                    setBookings(response.data);
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
        fetchBookings();
    }, []);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = (booking) => {
        setSelectedBooking(booking);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const formData = event.target.elements;
        const updatedBooking = {
            id: selectedBooking.id,
            startDestination: formData.startDestination.value,
            endDestination: formData.endDestination.value,
            departureDate: formData.departureDate.value,
            departureTime: formData.departureTime.value,
            arrivalDate: formData.arrivalDate.value,
            arrivalTime: formData.arrivalTime.value,
            status: formData.status.value,
            price: formData.price.value
        };

        console.log('UPDATED BOOKING: ', JSON.stringify(updatedBooking));

        try {
            const response = await axios.put("http://localhost:8080/admin/bookings",
                JSON.stringify(updatedBooking),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 200) {
                setSuccessMessage('Booking has been successfully updated.');
                setTimeout(() => { }, 5000);
                setSelectedBooking(null);
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

    const handleDelete = async (booking) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/admin/bookings?id=${booking.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 204) {
                setSuccessMessage('Booking has been successfully deleted.');
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
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h1>Booking Management</h1>
                </div>
                {bookings.length === 0 ? (
                    <div className="alert alert-info">
                        <p>Currently, there are no bookings registered in the system. Please check back later.</p>
                    </div>) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Departure Date</th>
                                <th>Departure Time</th>
                                <th>Arrival Date</th>
                                <th>Arrival Time</th>
                                <th>Bus Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Action(Edit/Delete)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td type="number">{booking.id}</td>
                                    <td type="text">{booking.startDestination}</td>
                                    <td type="text">{booking.endDestination}</td>
                                    <td type="date">{booking.departureDate}</td>
                                    <td type="time">{booking.departureTime}</td>
                                    <td type="date">{booking.arrivalDate}</td>
                                    <td type="time">{booking.arrivalTime}</td>
                                    <td type="text">{booking.busName}</td>
                                    <td type="number">{booking.price}</td>
                                    <td type="text">{booking.active.toString()}</td>
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
                )}

                {loading && (
                    <div className="text-center">
                        <BeatLoader color={"#123abc"} loading={loading} />
                    </div>
                )}

                {selectedBooking && (
                    <Modal show={showEditModal} onHide={handleEditClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Booking</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {successMessage && <div className="alert alert-success mt-2">{successMessage}</div>}
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group controlId="startDestination" className="mb-3">
                                    <Form.Label>Start Destination</Form.Label>
                                    <Form.Control type="text" placeholder="Enter start destination" required defaultValue={selectedBooking.startDestination} />
                                </Form.Group>
                                <Form.Group controlId="endDestination" className="mb-3">
                                    <Form.Label>End Destination</Form.Label>
                                    <Form.Control type="text" placeholder="Enter end destination" required defaultValue={selectedBooking.endDestination} />
                                </Form.Group>
                                <Form.Group controlId="departureDate" className="mb-3">
                                    <Form.Label>Departure Date</Form.Label>
                                    <Form.Control type="date" placeholder="Enter departure date" required defaultValue={selectedBooking.departureDate} />
                                </Form.Group>
                                <Form.Group controlId="departureTime" className="mb-3">
                                    <Form.Label>Departure Time</Form.Label>
                                    <Form.Control type="time" placeholder="Enter departure time" required defaultValue={selectedBooking.departureTime} />
                                </Form.Group>
                                <Form.Group controlId="arrivalDate" className="mb-3">
                                    <Form.Label>Arrival Date</Form.Label>
                                    <Form.Control type="date" placeholder="Enter arrival date" required defaultValue={selectedBooking.arrivalDate} />
                                </Form.Group>
                                <Form.Group controlId="arrivalTime" className="mb-3">
                                    <Form.Label>Arrival Time</Form.Label>
                                    <Form.Control type="time" placeholder="Enter arrival time" required defaultValue={selectedBooking.arrivalTime} />
                                </Form.Group>
                                <Form.Group controlId="status" className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" defaultValue='Active' required>
                                        <option>Active</option>
                                        <option>Canceled</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="price" className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="number" placeholder="Enter price" defaultValue={selectedBooking.price} required />
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

export default BookingManagementPage;