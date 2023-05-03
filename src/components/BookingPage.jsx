import React, { useState } from 'react';
import './styles/BookingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const BOOKING_URL = 'http://localhost:8080/booking/reserve-ticket';

function BookingPage() {
    const username = localStorage.getItem('username');
    const [fullName, setFullName] = useState('');
    const [seats, setSeats] = useState(1);
    const startDestination = localStorage.getItem('startDestination');
    const endDestination = localStorage.getItem("endDestination");
    const availableSeats = localStorage.getItem('availableSeats');
    const busId = localStorage.getItem('busId');
    const busCapacity = localStorage.getItem('busCapacity');
    const reservedSeats = localStorage.getItem('reservedSeats');
    const [message, setMessage] = useState('');
    const [nameError, setNameError] = useState('');
    const [addMorePassengers, setAddMorePassengers] = useState(false);
    const [passengersArr, setPassengersArr] = useState([]);
    const navigate = useNavigate();

    const handleNameChange = (event) => {
        setFullName(event.target.value);
        setNameError('');
    };

    const handlePassengerNameChange = (e, index) => {
        const newPassengersArr = [...passengersArr];
        newPassengersArr[index].name = e.target.value;
        setPassengersArr(newPassengersArr);
    };

    const handleSeatsChange = (event) => {
        const seatsCount = event.target.value;
        setSeats(seatsCount);
        if (seatsCount > 1 && seatsCount > passengersArr.length) {
            setAddMorePassengers(true);
            const newPassengersArr = [...passengersArr];
            for (let i = newPassengersArr.length + 1; i < seatsCount; i++) {
                newPassengersArr.push({
                    id: i + 1,
                    name: '',
                    index: i - 1
                });
            }

            setPassengersArr(newPassengersArr);
        } else if (seatsCount <= passengersArr.length) {
            const newArr = [...passengersArr];
            newArr.pop();
            setPassengersArr(newArr);
        } else {
            setAddMorePassengers(false);
            setPassengersArr([]);
        }
    };

    const handleBooking = async (event) => {
        event.preventDefault();

        if (!fullName.trim()) {
            setNameError('Name cannot be blank');
            return;
        }

        try {
            const data = [{
                startDestination: startDestination,
                endDestination: endDestination,
                passengerName: fullName,
                busId: busId,
                busCapacity: busCapacity,
                reservedTickets: reservedSeats
            }];

            for (let i = 0; i < passengersArr.length; i++) {
                data.push({
                    startDestination: startDestination,
                    endDestination: endDestination,
                    passengerName: passengersArr[i].name,
                    busId: busId,
                    busCapacity: busCapacity,
                    reservedTickets: reservedSeats
                });
            }

            const response = await axios.post(BOOKING_URL,
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log("RESPONSE: ", JSON.stringify(response?.data));

            if (response?.data) {
                localStorage.setItem('ticketInfo', JSON.stringify(response.data));
                navigate('/booking/ticket-preview');
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

    const handleDashboardClick = () => {
        navigate("/home");
    };

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={{ background: "#f5f5f5" }}>
            <nav className="navbar navbar-expand" style={{ display: 'block' }}>
                <div className="navbar-header" style={{ marginLeft: "5rem" }}>
                    <h1>Booking Page</h1>
                    <div className="container-fluid" style={{ display: 'block' }}>
                        <div className="row">
                            <div className="col-5">
                                <h4> Hi, Welcome <span>{username}</span></h4>
                            </div>
                            <div className="col-3">
                                <button className='btn anchor'>My Bookings</button>
                            </div>
                            <div className="col-2">
                                <button className='btn anchor' onClick={handleDashboardClick}>Dashboard</button>
                            </div>
                            <div className="col-1">
                                <button className="btn anchor" onClick={handleLogout}> <i className="fa fa-arrow-circle-o-left"></i>&nbsp;Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <br /><br /><br /><br />

            <div className="container">
                {message && <div className="alert alert-danger mt-2">{message}</div>}
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <h2>Bus Ticket Booking</h2>
                        <p>Please fill in your details to complete the booking:</p>
                        <form onSubmit={handleBooking}>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name:</label>
                                <input type="text" className="form-control" id="fullName" value={fullName} onChange={handleNameChange} autoFocus required />
                                {nameError && <div className="alert alert-danger mt-2">{nameError}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="seats">Number of Seats:</label>
                                <input type="number" className="form-control" id="seats" min="1" max={availableSeats} value={seats} onChange={handleSeatsChange} autoFocus required />
                            </div>
                            {addMorePassengers === true &&
                                passengersArr.map((passenger) => (
                                    <div className="form-group" key={passenger.id}>
                                        <label htmlFor={`name${passenger.id}`}>Passenger {passenger.id} Full Name:</label>
                                        <input type="text" className="form-control" id={`name${passenger.id}`} value={passenger.name} onChange={(e) => handlePassengerNameChange(e, passenger.index)} autoFocus required />
                                        {nameError && <div className="alert alert-danger mt-2">{nameError}</div>}
                                    </div>
                                ))}
                            <button type="submit" className="btn btn-primary">Book Now</button>
                        </form>
                    </div>
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

export default BookingPage;