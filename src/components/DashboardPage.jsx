import React from 'react';
import './styles/AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faUsers, faClipboardList } from "@fortawesome/free-solid-svg-icons";

function DashboardPage() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div>
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
                        <Nav.Link as={Link} to="/user/profile">
                            Personal Information
                        </Nav.Link>
                        <Nav.Link onClick={handleLogout}>
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="admin-page-container">
                <div className="admin-page-title">Welcome {username}!</div>
                <div className="admin-page-description">What would you like to do today?</div>
                <div className="admin-page-actions">
                    <Link to="/find_bus" className="admin-page-action">
                        <div className="admin-page-action-icon">
                            <FontAwesomeIcon icon={faBus} />
                        </div>
                        <div className="admin-page-action-title">Find a Bus</div>
                    </Link>
                    <Link to="/my_bookings" className="admin-page-action">
                        <div className="admin-page-action-icon">
                            <FontAwesomeIcon icon={faClipboardList} />
                        </div>
                        <div className="admin-page-action-title">My Bookings</div>
                    </Link>
                    <Link to="/user/profile" className="admin-page-action">
                        <div className="admin-page-action-icon">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div className="admin-page-action-title">Update Profile</div>
                    </Link>
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
                <div className="bg-secondary text-center py-2" style={{ height: "3.5rem" }}>
                    <p className="mb-0">&copy; 2023 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default DashboardPage;