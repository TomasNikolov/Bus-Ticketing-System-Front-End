import React, { useState } from 'react';
import './styles/DashboardPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function BusSearchPage() {
    const [startDestination, setStartDestination] = useState('');
    const [endDestination, setEndDestination] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [startError, setStartError] = useState('');
    const [endError, setEndError] = useState('');
    const [dateError, setDateError] = useState('');
    const [busData, setBusData] = useState([]);
    const navigate = useNavigate();

    const handleStarDestinationChange = (event) => {
        setStartDestination(event.target.value);
        setStartError('');
        setMessage('');
    };

    const handleEndDestinationChange = (event) => {
        setEndDestination(event.target.value);
        setEndError('');
        setMessage('');
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
        setDateError('');
        setMessage('');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        setBusData('');

        if (!startDestination.trim()) {
            setStartError("Start Destination cannot be blank");
            return;
        }

        if (!endDestination.trim()) {
            setEndError("End Destination cannot be blank");
            return;
        }

        if (!date.trim()) {
            setDateError("Date cannot be blank");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/buses?start=${startDestination}&end=${endDestination}&date=${date}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.data) {
                setBusData(response.data);
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
    }

    function handleBooking(bus) {
        console.log("Booking ticket for bus with ID: ", bus.id);

        localStorage.setItem('busId', bus.id);
        localStorage.setItem('startDestination', bus.startDestination);
        localStorage.setItem('endDestination', bus.endDestination);
        localStorage.setItem('reservationDate', bus.departureDate);
        localStorage.setItem('busCapacity', bus.capacity);
        localStorage.setItem('availableSeats', bus.availableSeats);
        localStorage.setItem('reservedSeats', bus.reservedSeats);
        localStorage.setItem('departureTime', bus.departureTime);
        localStorage.setItem('arrivalTime', bus.arrivalTime);
        localStorage.setItem('departureDate', bus.departureDate);
        localStorage.setItem('ticketPrice', bus.ticketPrice);

        navigate("/booking")
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
                        <Nav.Link as={Link} to="/my_bookings">
                            My Bookings
                        </Nav.Link>
                        <Nav.Link onClick={handleLogout}>
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <br /><br /><br /><br />

            <div className="container">
                {message && <div className="alert alert-danger mt-2">{message}</div>}
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="control-label" htmlFor="from">From:</label>
                            <input id="from" className="form-control" required autoFocus onChange={handleStarDestinationChange} />
                            {startError && <div className="alert alert-danger mt-2">{startError}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="control-label" htmlFor="to">To:</label>
                            <input id="to" className="form-control" required autoFocus onChange={handleEndDestinationChange} />
                            {endError && <div className="alert alert-danger mt-2">{endError}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="control-label" htmlFor="date">Date:</label>
                            <input type="date" id="date" className="form-control" required autoFocus onChange={handleDateChange} />
                            {dateError && <div className="alert alert-danger mt-2">{dateError}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <button type="submit" className="btn btn-primary" style={{ marginTop: "24px" }} onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </div>

            <br /><br /><br />

            <div className="container">
                {busData.length > 0 && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Departure Time</th>
                                <th>Arrival Time</th>
                                <th>Bus Name</th>
                                <th>Ticket Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {busData.map((bus) => (
                                <tr key={bus.id}>
                                    <td type="text">{bus.startDestination}</td>
                                    <td type="text">{bus.endDestination}</td>
                                    <td type="time">{bus.departureTime}</td>
                                    <td type="time">{bus.arrivalTime}</td>
                                    <td type="text">{bus.name}</td>
                                    <td type="number">{bus.ticketPrice}</td>
                                    <td><button className="btn btn-primary" onClick={() => handleBooking(bus)}>Book</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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
                <div className="bg-secondary text-center py-2" style={{ height: "3.5rem" }}>
                    <p className="mb-0">&copy; 2023 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default BusSearchPage;