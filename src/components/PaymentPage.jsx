import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Cards from 'react-credit-cards-2';
import axios from "axios";

const PAYMENT_URL = 'http://localhost:8080/payment';

function PaymentPage() {
    const username = localStorage.getItem('username');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'cardNumber':
                setCardNumber(value);
                break;
            case 'cardName':
                setCardName(value);
                break;
            case 'expiry':
                setExpiry(value);
                break;
            case 'cvc':
                setCvc(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                cardNumber: cardNumber,
                cardHolder: cardName,
                expiryDate: expiry,
                cvv: cvc,
                amount: '50'
            };

            console.log('REQUEST BODY: ', JSON.stringify(data));

            const response = await axios.post(PAYMENT_URL,
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response?.data));

            if (response?.data) {
                //TODO: navigate to my bookings page.
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
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={{ background: "#f5f5f5" }}>
            <nav className="navbar navbar-expand" style={{ display: 'block' }}>
                <div className="navbar-header" style={{ marginLeft: "5rem" }}>
                    <h1>Payment Page</h1>
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

            <br /><br />

            <div className="container mt-5">
                {message && <div className="alert alert-danger mt-2">{message}</div>}
                <div className="row justify-content-center">
                    <Cards
                        number={cardNumber}
                        expiry={expiry}
                        cvc={cvc}
                        name={cardName}
                        focused={focus}
                    />
                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <h3 className="mb-0">Payment Details</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="form-control"
                                            id="cardNumber"
                                            name="cardNumber"
                                            pattern="\d{4}\d{4}\d{4}\d{4}"
                                            minLength={16}
                                            maxLength={19}
                                            value={cardNumber}
                                            onChange={handleInputChange}
                                            onFocus={(e) => setFocus(e.target.name)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cardName">Name on Card</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="cardName"
                                            name="cardName"
                                            value={cardName}
                                            onChange={handleInputChange}
                                            onFocus={(e) => setFocus(e.target.name)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="expiryDate">Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="form-control"
                                            id="expiry"
                                            name="expiry"
                                            pattern="^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$"
                                            minLength={4}
                                            maxLength={4}
                                            value={expiry}
                                            onChange={handleInputChange}
                                            onFocus={(e) => setFocus(e.target.name)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cvc">CVV</label>
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            className="form-control"
                                            id="cvc"
                                            name="cvc"
                                            minLength={3}
                                            maxLength={3}
                                            pattern="\d{3}"
                                            value={cvc}
                                            onChange={handleInputChange}
                                            onFocus={(e) => setFocus(e.target.name)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">Pay Now</button>
                                </form>
                            </div>
                        </div>
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

export default PaymentPage;