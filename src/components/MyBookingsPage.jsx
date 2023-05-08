import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Navbar, Nav } from 'react-bootstrap';
import InfoMessage from './InfoMessage';
import { Link } from 'react-router-dom';
import { BeatLoader } from "react-spinners";

function MyBookingsPage() {
    const userId = localStorage.getItem('userId');
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [disableButton, setDisableButton] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`http://localhost:8080/booking?userId=${userId}`);

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
        fetchBookings(userId);
    }, [userId]);

    const handleCancelClick = async (booking) => {
        setLoading(true);
        setDisableButton(true);

        try {
            const response = await axios.delete(`http://localhost:8080/booking?id=${booking.id}`,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 204) {
                window.location.reload();
                setLoading(false);
                setDisableButton(false);
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

    const handleGenerateClick = async (booking) => {
        setLoading(true);
        setDisableButton(true);

        try {
            const response = await axios.get(`http://localhost:8080/ticket/send?ticketId=${booking.ticketId}`,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 200) {
                window.location.reload();
                setLoading(false);
                setDisableButton(false);
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

            <br /><br />

            <div className="container">
                <h1 style={{ textAlign: "center", paddingBottom: "2rem" }}>My Bookings</h1>
                {message && <div className="alert alert-danger mt-2">{message}</div>}
                {bookings.length === 0 ? <InfoMessage /> : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Departure Date</th>
                                <th>Departure Time</th>
                                <th>Arrival Date</th>
                                <th>Arrival Time</th>
                                <th>Bus Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Cancel Booking</th>
                                <th>Generate Ticket(Will be sent on Email)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td type="text">{booking.startDestination}</td>
                                    <td type="text">{booking.endDestination}</td>
                                    <td type="date">{booking.departureDate}</td>
                                    <td type="time">{booking.departureTime}</td>
                                    <td type="date">{booking.arrivalDate}</td>
                                    <td type="time">{booking.arrivalTime}</td>
                                    <td type="text">{booking.busName}</td>
                                    <td type="currency">{booking.price}</td>
                                    <td type="text">{booking.status}</td>
                                    <td><button className="btn btn-danger" disabled={disableButton} style={{ borderRadius: "10px" }} onClick={() => handleCancelClick(booking)}>Cancel Booking</button></td>
                                    <td><button className="btn btn-primary" disabled={disableButton} style={{ borderRadius: "10px" }} onClick={() => handleGenerateClick(booking)}>Generate Ticket</button></td>
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
            </div>

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
                <div className="bg-secondary text-center py-2">
                    <p className="mb-0">&copy; 2023 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default MyBookingsPage;