import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";

function BusManagementPage() {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [buses, setBuses] = useState([]);
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBuses = async () => {
            setMessage('');
            setSuccessMessage('');
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/admin/buses",
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );

                console.log("RESPONSE: ", JSON.stringify(response?.data));

                if (response?.data) {
                    setBuses(response.data);
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
        fetchBuses();
    }, []);

    const handleAddClose = () => setShowAddModal(false);
    const handleAddShow = () => setShowAddModal(true);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = (bus) => {
        setSelectedBus(bus);
        setShowEditModal(true);
    };

    const handleAddSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const formData = event.target.elements;
        const newBus = {
            name: formData.name.value,
            startDestination: formData.startDestination.value,
            endDestination: formData.endDestination.value,
            capacity: formData.capacity.value,
            availableSeats: formData.availableSeats.value,
            reservedSeats: formData.reservedSeats.value,
            departureDate: formData.departureDate.value,
            departureTime: formData.departureTime.value,
            arrivalDate: formData.arrivalDate.value,
            arrivalTime: formData.arrivalTime.value,
            distance: formData.distance.value,
            ticketPrice: formData.ticketPrice.value,
        };

        try {
            const response = await axios.post("http://localhost:8080/admin/buses",
                JSON.stringify(newBus),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 201) {
                setLoading(false);
                setSuccessMessage('The bus has been successfully created.');
                setTimeout(() => console.log(""), 5000);
                setShowAddModal(false);
                window.location.reload();
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

    const handleEditSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const formData = event.target.elements;
        const updatedBus = {
            id: selectedBus.id,
            name: formData.name.value,
            startDestination: formData.startDestination.value,
            endDestination: formData.endDestination.value,
            capacity: formData.capacity.value,
            availableSeats: formData.availableSeats.value,
            reservedSeats: formData.reservedSeats.value,
            departureDate: formData.departureDate.value,
            departureTime: formData.departureTime.value,
            arrivalDate: formData.arrivalDate.value,
            arrivalTime: formData.arrivalTime.value,
            distance: formData.distance.value,
            ticketPrice: formData.ticketPrice.value,
        };

        console.log('UPDATED BUS: ', JSON.stringify(updatedBus));

        try {
            const response = await axios.put("http://localhost:8080/admin/buses",
                JSON.stringify(updatedBus),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 200) {
                setSuccessMessage('The bus has been successfully updated.');
                setTimeout(() => { }, 5000);
                setSelectedBus(null);
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

    const handleDelete = async (bus) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this bus?");
        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8080/admin/buses?id=${bus.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 204) {
                setSuccessMessage('The bus has been successfully deleted.');
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
                    <h1 style={{ width: "40%" }}>Bus Management</h1>
                    <div style={{ width: "20%" }}></div>
                    <Button variant="primary" style={{ width: "10%" }} onClick={handleAddShow}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Bus
                    </Button>
                </div>
                <div className="table-responsive">
                    {buses.length === 0 ? (
                        <div className="alert alert-info">
                            <p>There are no buses in the system at the moment. Please check back later or add new buses.</p>
                        </div>) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Capacity</th>
                                    <th>Available Seats</th>
                                    <th>Reserved Seats</th>
                                    <th>Departure Date</th>
                                    <th>Departure Time</th>
                                    <th>Arrival Date</th>
                                    <th>Arrival Time</th>
                                    <th>Distance</th>
                                    <th>Ticket Price</th>
                                    <th>Action(Edit/Delete)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buses.map((bus) => (
                                    <tr key={bus.id}>
                                        <td type="number">{bus.id}</td>
                                        <td type="text">{bus.name}</td>
                                        <td type="text">{bus.startDestination}</td>
                                        <td type="text">{bus.endDestination}</td>
                                        <td type="number">{bus.capacity}</td>
                                        <td type="number">{bus.availableSeats}</td>
                                        <td type="number">{bus.reservedSeats}</td>
                                        <td type="date">{bus.departureDate}</td>
                                        <td type="time">{bus.departureTime}</td>
                                        <td type="date">{bus.arrivalDate}</td>
                                        <td type="time">{bus.arrivalTime}</td>
                                        <td type="number">{bus.distance}</td>
                                        <td type="currency">{bus.ticketPrice}</td>
                                        <td>
                                            <div className="d-flex">
                                                <div style={{ width: "5%" }}></div>
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    className="mr-2 ml-2"
                                                    onClick={() => handleEditShow(bus)}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Button>
                                                <div style={{ width: "10%" }}></div>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(bus)}
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
                </div>

                {loading && (
                    <div className="text-center">
                        <BeatLoader color={"#123abc"} loading={loading} />
                    </div>
                )}

                <Modal show={showAddModal} onHide={handleAddClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Bus</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {successMessage && <div className="alert alert-success mt-2">{successMessage}</div>}
                        <Form onSubmit={handleAddSubmit}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter name" required />
                            </Form.Group>
                            <Form.Group controlId="startDestination" className="mb-3">
                                <Form.Label>Start Destination</Form.Label>
                                <Form.Control type="text" placeholder="Enter start destination" required />
                            </Form.Group>
                            <Form.Group controlId="endDestination" className="mb-3">
                                <Form.Label>End Destination</Form.Label>
                                <Form.Control type="text" placeholder="Enter end destination" required />
                            </Form.Group>
                            <Form.Group controlId="capacity" className="mb-3">
                                <Form.Label>Capacity</Form.Label>
                                <Form.Control type="number" placeholder="Enter bus capacity" required />
                            </Form.Group>
                            <Form.Group controlId="availableSeats" className="mb-3">
                                <Form.Label>Available Seats</Form.Label>
                                <Form.Control type="number" placeholder="Enter available seats" required />
                            </Form.Group>
                            <Form.Group controlId="reservedSeats" className="mb-3">
                                <Form.Label>Reserved Seats</Form.Label>
                                <Form.Control type="number" placeholder="Enter reserved seats" required />
                            </Form.Group>
                            <Form.Group controlId="departureDate" className="mb-3">
                                <Form.Label>Departure Date</Form.Label>
                                <Form.Control type="date" placeholder="Enter departure date" required />
                            </Form.Group>
                            <Form.Group controlId="departureTime" className="mb-3">
                                <Form.Label>Departure Time</Form.Label>
                                <Form.Control type="time" placeholder="Enter departure time" required />
                            </Form.Group>
                            <Form.Group controlId="arrivalDate" className="mb-3">
                                <Form.Label>Arrival Date</Form.Label>
                                <Form.Control type="date" placeholder="Enter arrival date" required />
                            </Form.Group>
                            <Form.Group controlId="arrivalTime" className="mb-3">
                                <Form.Label>Arrival Time</Form.Label>
                                <Form.Control type="time" placeholder="Enter arrival time" required />
                            </Form.Group>
                            <Form.Group controlId="distance" className="mb-3">
                                <Form.Label>Route Distance</Form.Label>
                                <Form.Control type="number" placeholder="Enter route distance" required />
                            </Form.Group>
                            <Form.Group controlId="ticketPrice" className="mb-3">
                                <Form.Label>Ticket Price</Form.Label>
                                <Form.Control type="number" placeholder="Enter ticket price" required />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {selectedBus && (
                    <Modal show={showEditModal} onHide={handleEditClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Bus</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {successMessage && <div className="alert alert-success mt-2">{successMessage}</div>}
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group controlId="name" className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" required defaultValue={selectedBus.name} />
                                </Form.Group>
                                <Form.Group controlId="startDestination" className="mb-3">
                                    <Form.Label>Start Destination</Form.Label>
                                    <Form.Control type="text" placeholder="Enter start destination" required defaultValue={selectedBus.startDestination} />
                                </Form.Group>
                                <Form.Group controlId="endDestination" className="mb-3">
                                    <Form.Label>End Destination</Form.Label>
                                    <Form.Control type="text" placeholder="Enter end destination" required defaultValue={selectedBus.endDestination} />
                                </Form.Group>
                                <Form.Group controlId="capacity" className="mb-3">
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Control type="number" placeholder="Enter bus capacity" required defaultValue={selectedBus.capacity} />
                                </Form.Group>
                                <Form.Group controlId="availableSeats" className="mb-3">
                                    <Form.Label>Available Seats</Form.Label>
                                    <Form.Control type="number" placeholder="Enter available seats" required defaultValue={selectedBus.availableSeats} />
                                </Form.Group>
                                <Form.Group controlId="reservedSeats" className="mb-3">
                                    <Form.Label>Reserved Seats</Form.Label>
                                    <Form.Control type="number" placeholder="Enter reserved seats" required defaultValue={selectedBus.reservedSeats} />
                                </Form.Group>
                                <Form.Group controlId="departureDate" className="mb-3">
                                    <Form.Label>Departure Date</Form.Label>
                                    <Form.Control type="date" placeholder="Enter departure date" required defaultValue={selectedBus.departureDate} />
                                </Form.Group>
                                <Form.Group controlId="departureTime" className="mb-3">
                                    <Form.Label>Departure Time</Form.Label>
                                    <Form.Control type="time" placeholder="Enter departure time" required defaultValue={selectedBus.departureTime} />
                                </Form.Group>
                                <Form.Group controlId="arrivalDate" className="mb-3">
                                    <Form.Label>Arrival Date</Form.Label>
                                    <Form.Control type="date" placeholder="Enter arrival date" required defaultValue={selectedBus.arrivalDate} />
                                </Form.Group>
                                <Form.Group controlId="arrivalTime" className="mb-3">
                                    <Form.Label>Arrival Time</Form.Label>
                                    <Form.Control type="time" placeholder="Enter arrival time" required defaultValue={selectedBus.arrivalTime} />
                                </Form.Group>
                                <Form.Group controlId="distance" className="mb-3">
                                    <Form.Label>Route Distance</Form.Label>
                                    <Form.Control type="number" placeholder="Enter route distance" required defaultValue={selectedBus.distance} />
                                </Form.Group>
                                <Form.Group controlId="ticketPrice" className="mb-3">
                                    <Form.Label>Ticket Price</Form.Label>
                                    <Form.Control type="number" placeholder="Enter ticket price" required defaultValue={selectedBus.ticketPrice} />
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
export default BusManagementPage;
