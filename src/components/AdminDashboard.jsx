import React from 'react';
import './styles/AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faUsers, faClipboardList } from "@fortawesome/free-solid-svg-icons";

function AdminDashboard() {
    const navigate = useNavigate();

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

            <div className="admin-page-container">
                <div className="admin-page-title">Welcome Admin!</div>
                <div className="admin-page-description">What would you like to do today?</div>
                <div className="admin-page-actions">
                    <Link to="/admin/buses" className="admin-page-action">
                        <div className="admin-page-action-icon">
                            <FontAwesomeIcon icon={faBus} />
                        </div>
                        <div className="admin-page-action-title">Bus Management</div>
                    </Link>
                    <Link to="/admin/bookings" className="admin-page-action">
                        <div className="admin-page-action-icon">
                            <FontAwesomeIcon icon={faClipboardList} />
                        </div>
                        <div className="admin-page-action-title">Booking Management</div>
                    </Link>
                    <Link to="/admin/users" className="admin-page-action">
                        <div className="admin-page-action-icon">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div className="admin-page-action-title">User Management</div>
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
                    <p className="mb-0">&copy; 2024 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default AdminDashboard;