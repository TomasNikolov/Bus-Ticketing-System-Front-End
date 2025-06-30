import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Cards from 'react-credit-cards-2';
import axios from "axios";
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

const PAYMENT_URL = process.env.REACT_APP_BACK_END_ENDPOINT + '/payment';

function PaymentPage() {
    const userId = localStorage.getItem('userId');
    const ticketInfo = JSON.parse(localStorage.getItem('ticketInfo') || '[]');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');
    const [message, setMessage] = useState('');
    const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isNewCard, setIsNewCard] = useState(true);
    const [disableButton, setDisableButton] = useState(true);
    const [saveForFuture, setSaveForFuture] = useState(false);
    const amount = ticketInfo[0].price * ticketInfo.length;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedPaymentMethods = async () => {
            try {
                const response = await axios.get(`${PAYMENT_URL}?userId=${userId}`);
                console.log('SAVED METHODS: ' + JSON.stringify(response));
                if (response.data.length > 0) {
                    setIsNewCard(false);
                }
                setSavedPaymentMethods(response.data);
            } catch (error) {
                console.error("Error fetching saved payment methods:", error);
                setMessage("Failed to load saved payment methods.");
            }
        };

        fetchSavedPaymentMethods();

        const timer = setTimeout(() => {
            setMessage('');
        }, 5000);

        return () => clearTimeout(timer);
    }, [userId]);

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
                if (isNewCard) {
                    const formattedExpiry = value.includes('/')
                        ? value
                        : formatExpiry(value);
                    setExpiry(formattedExpiry);
                } else {
                    setExpiry(value)
                }

                break;
            case 'cvc':
                setCvc(value);
                break;
            case 'saveForFuture':
                setSaveForFuture(e.target.checked);
                break;
            default:
                break;
        }
    };

    const formatExpiry = (value) => {
        if (value.length >= 3) {
            return `${value.slice(0, 2)}/${value.slice(2, 4)}`;
        }
        return value;
    };

    const isValidExpiry = (expiry) => {
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        return (
            month >= 1 &&
            month <= 12 &&
            year >= currentYear &&
            (year > currentYear || month >= currentMonth)
        );
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        console.log(saveForFuture);

        const data = {
            amount: amount,
            userId: userId,
            saveForFutureUse: saveForFuture,
            ...(selectedMethod ? {
                cardNumber: selectedMethod.cardNumber,
                paymentToken: selectedMethod.paymentToken,
                cardHolder: selectedMethod.cardHolder,
                expiryDate: selectedMethod.expiryDate
            }
                : {
                    cardNumber: cardNumber,
                    cardHolder: cardName,
                    expiryDate: expiry,
                    cvv: cvc
                })
        };

        if (!isNewCard && !isValidExpiry(expiry)) {
            setMessage('Invalid expiry date. Please enter a valid date in MM/YY format.');
            return;
        }

        try {
            console.log('DATA: ', JSON.stringify(data));
            const response = await axios.post(PAYMENT_URL,
                JSON.stringify(data),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response?.data));

            if (response?.data) {
                navigate('/my_bookings');
            }
        } catch (err) {
            if (!err?.response) {
                setMessage('No Server Response');
            } else if (err.response?.status === 403) {
                setMessage("Access Denied. You don't have permission to access this resource.");
            } else if (err.response?.status === 404) {
                setMessage(err.response?.data?.message[0]);
            } else {
                setMessage("Internal server error");
            }
        }
    };

    const handleMethodChange = (method) => {
        setSelectedMethod(method);
        setDisableButton(false);
        setCardName(method.cardHolder);
        let cardNumber = method.cardFirstDigit + "**********" + method.cardNumber;
        setCardNumber(cardNumber);
        setExpiry(method.expiryDate);
    };

    const handlePayWithNewCard = () => {
        setCardName('');
        setCardNumber('');
        setExpiry('');
        setCvc('');
        setIsNewCard(true);
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
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/find_bus">Find a Bus</Nav.Link>
                        <Nav.Link as={Link} to="/my_bookings">My Bookings</Nav.Link>
                        <Nav.Link as={Link} to="/user/profile">Personal Information</Nav.Link>
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <br /><br />

            <div className="container mt-5">
                {message && <div className="alert alert-danger mt-2">{message}</div>}
                <div className="row justify-content-center">
                    <div className='col-md-4'>
                        <Cards
                            number={cardNumber}
                            expiry={expiry}
                            cvc={cvc}
                            name={cardName}
                            focused={focus}
                        />

                        <label htmlFor='amount' style={{ paddingTop: "3rem", textAlign: "center" }}>
                            <strong style={{ paddingTop: "3rem", textAlign: "center", fontSize: "1.5rem" }}>
                                Total amount to be paid: {amount} $
                            </strong>
                        </label>
                    </div>

                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card">
                            <div className="card-header bg-primary text-white">
                                <h3 className="mb-0">Payment Options</h3>
                            </div>
                            <div className="card-body">
                                {isNewCard ? (
                                    <form onSubmit={handlePaymentSubmit}>
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
                                                maxLength={16}
                                                value={cardNumber}
                                                onChange={handleInputChange}
                                                onFocus={(e) => setFocus(e.target.name)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cardName">Card Holder</label>
                                            <input
                                                type="text"
                                                placeholder='JOHN DOE'
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
                                                minLength={5}
                                                maxLength={5}
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
                                        <div className="form-group form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="saveForFuture"
                                                name="saveForFuture"
                                                checked={saveForFuture}
                                                onChange={handleInputChange}
                                            />
                                            <label className="form-check-label" htmlFor="saveForFuture">
                                                Save this card for future use
                                            </label>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-block">Pay Now</button>
                                    </form>
                                ) : (
                                    <div>
                                        <h5>Select a saved payment method:</h5>
                                        {savedPaymentMethods.map(method => (
                                            <div className="form-check" key={method.id}>
                                                <input
                                                    type="radio"
                                                    className="form-check-input"
                                                    name="savedMethod"
                                                    id={`method-${method.id}`}
                                                    checked={selectedMethod?.id === method.id}
                                                    onChange={() => handleMethodChange(method)}
                                                />
                                                <label className="form-check-label" htmlFor={`method-${method.id}`}>
                                                    <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                                    {method.cardFirstDigit}** **** **** {method.cardNumber} - {method.cardHolder}
                                                </label>
                                            </div>
                                        ))}
                                        <div className='pt-3'>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                                                onClick={handlePayWithNewCard}
                                                style={{ maxWidth: '200px' }}
                                            >
                                                Pay with New Card
                                            </button>
                                        </div>
                                        <div className='pt-5'>
                                            <button type="submit" className="btn btn-primary btn-block" onClick={handlePaymentSubmit} disabled={disableButton}>Pay Now</button>
                                        </div>
                                    </div>
                                )}
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
                    <p className="mb-0">&copy; 2024 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default PaymentPage;