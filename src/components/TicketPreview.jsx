import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const DELETE_TICKET_URL = 'http://localhost:8080/ticket/delete';

function TicketPreview() {
    const startDestination = localStorage.getItem('startDestination');
    const endDestination = localStorage.getItem("endDestination");
    const busId = localStorage.getItem('busId');
    const departureDate = localStorage.getItem('departureDate');
    const departureTime = localStorage.getItem('departureTime');
    const arrivalTime = localStorage.getItem('arrivalTime');
    const ticketInfo = JSON.parse(localStorage.getItem('ticketInfo') || '[]');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlePayClick = () => {
        navigate('/booking/payment');
    };

    const handleDenyClick = async () => {
        try {
            const data = [];
            ticketInfo.forEach((ticket) => {
                data.push(ticket.id)
            });

            console.log('DATA: ', JSON.stringify(data));
            const response = await axios.delete(DELETE_TICKET_URL,
                {
                    data: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 204) {
                navigate('/home');
            }
        } catch (err) {
            if (!err?.response) {
                setMessage('No Server Response');
            } else if (err.response?.status === 403) {
                console.log(JSON.stringify(err.response));
                setMessage("Access Denied. You don't have permission to access this resource. Please contact the system administrator if you believe you should have access.");
            } else if (err.response?.status === 404) {
                console.log(JSON.stringify(err.response?.data?.message[0]));
                setMessage(err.response?.data?.message[0]);
            } else {
                setMessage("Internal server error");
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
                {message && <div className="alert alert-danger mt-2">{message}</div>}
                <h1 style={{ textAlign: "center" }}>Ticket Preview</h1>
                {ticketInfo.length > 0 &&
                    ticketInfo.map((ticket) => (
                        <div className="row" key={ticket.id} style={{ background: "#fff", padding: "20px", marginBottom: "20px", borderRadius: "10px" }}>
                            <div className="col-md-6">
                                <h3>Ticket Details</h3>
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    <li><strong>Passenger Name:</strong> {ticket.passengerName}</li>
                                    <li><strong>Bus ID:</strong> {ticket.busId}</li>
                                    <li><strong>Departure Date:</strong> {departureDate}</li>
                                    <li><strong>Departure Time:</strong> {departureTime}</li>
                                    <li><strong>Arrival Time:</strong> {arrivalTime}</li>
                                    <li><strong>Seat Number:</strong> {ticket.seatNumber}</li>
                                    <li><strong>Price:</strong> {ticket.price} $</li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h3>Bus Details</h3>
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    <li><strong>Bus ID:</strong> {busId}</li>
                                    <li><strong>Start Destination:</strong> {startDestination}</li>
                                    <li><strong>End Destination:</strong> {endDestination}</li>
                                    <li><strong>Departure Time:</strong> {departureTime}</li>
                                    <li><strong>Arrival Time:</strong> {arrivalTime}</li>
                                </ul>
                            </div>
                        </div>
                    ))}


                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    <button className="btn btn-danger" style={{ borderRadius: "10px", fontSize: "18px", width: "18rem" }} onClick={handleDenyClick}>Deny Booking</button>
                    <div style={{ width: "5%" }}></div>
                    <div style={{ width: "5%" }}></div>
                    <button className="btn btn-success" style={{ borderRadius: "10px", fontSize: "18px", width: "18rem" }} onClick={handlePayClick}>Confirm and Pay</button>
                </div>
            </div>

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
                <div className="bg-secondary text-center py-2">
                    <p className="mb-0">&copy; 2023 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default TicketPreview;