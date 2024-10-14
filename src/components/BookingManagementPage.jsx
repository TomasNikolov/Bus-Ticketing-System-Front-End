import React, { useState, useEffect, useRef } from "react";
import { Container, Button, Modal, Form, Nav, Navbar, NavDropdown, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import './styles/BusSearchPage.css';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

function BookingManagementPage() {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const accept = (booking) => {
        handleDelete(booking);
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected booking cancellation!', life: 5000 });
    }

    const confirmCancelBooking = (booking) => {
        confirmDialog({
            message: 'Do you want cancel this booking?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(booking),
            reject
        });
    };

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
                setShowEditModal(false);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Booking has been successfully updated!', life: 5000 });
                setTimeout(() => {
                    setSelectedBooking(null);
                    window.location.reload();
                    setLoading(false);
                }, 5000);
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
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Booking has been successfully deleted!', life: 5000 });
                setTimeout(() => {
                    window.location.reload();
                    setLoading(false);
                }, 5000);
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

    const formatCurrency = (value) => {
        return value.toLocaleString('bg-BG', { style: 'currency', currency: 'BGN' });
    };

    const ticketPriceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ticketPriceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="BGN" locale="bg-BG" />;
    };

    return (
        <div style={{ background: "#f5f5f5" }}>
            <Toast ref={toast} />
            <ConfirmDialog />

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
                    <DataTable
                        value={bookings}
                        tableStyle={{ minWidth: '50rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}
                        paginator
                        showGridlines
                        rows={10}
                        dataKey="id"
                        className="styled-table"
                    >
                        <Column field="startDestination"
                            header="From"
                            sortable
                            filter
                            filterPlaceholder="Search by bus destination"
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="endDestination"
                            header="To"
                            sortable
                            filter
                            filterPlaceholder="Search by bus destination"
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="departureDate"
                            header="Departure Date"
                            sortable
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="departureTime"
                            header="Departure Time"
                            sortable
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="arrivalDate"
                            header="Arrival Date"
                            sortable
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="arrivalTime"
                            header="Arrival Time"
                            sortable
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="price"
                            header="Ticket Price"
                            sortable
                            className="table-column"
                            filterField="ticketPrice"
                            dataType="numeric"
                            body={ticketPriceBodyTemplate}
                            filter
                            filterElement={ticketPriceFilterTemplate}
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="status"
                            header="Status"
                            sortable
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column
                            header="Actions"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            style={{ minWidth: '7rem' }}
                            body={(rowData) => (
                                <div className="d-flex align-items-center">
                                    <div style={{ width: "20%" }}></div>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="mr-3 ml-3"
                                        onClick={() => handleEditShow(rowData)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <div style={{ width: "20%" }}></div>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => confirmCancelBooking(rowData)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </Button>
                                </div>
                            )}
                        ></Column>
                    </DataTable>
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
                                <Row>
                                    <Col>
                                        <Form.Group controlId="startDestination" className="mb-3">
                                            <Form.Label>Start Destination</Form.Label>
                                            <Form.Control type="text" placeholder="Enter start destination" required defaultValue={selectedBooking.startDestination} />
                                        </Form.Group>
                                        <Form.Group controlId="departureDate" className="mb-3">
                                            <Form.Label>Departure Date</Form.Label>
                                            <Form.Control type="date" placeholder="Enter departure date" required defaultValue={selectedBooking.departureDate} />
                                        </Form.Group>
                                        <Form.Group controlId="arrivalDate" className="mb-3">
                                            <Form.Label>Arrival Date</Form.Label>
                                            <Form.Control type="date" placeholder="Enter arrival date" required defaultValue={selectedBooking.arrivalDate} />
                                        </Form.Group>
                                        <Form.Group controlId="status" className="mb-3">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Control as="select" defaultValue='Active' required>
                                                <option>Active</option>
                                                <option>Canceled</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="endDestination" className="mb-3">
                                            <Form.Label>End Destination</Form.Label>
                                            <Form.Control type="text" placeholder="Enter end destination" required defaultValue={selectedBooking.endDestination} />
                                        </Form.Group>
                                        <Form.Group controlId="departureTime" className="mb-3">
                                            <Form.Label>Departure Time</Form.Label>
                                            <Form.Control type="time" placeholder="Enter departure time" required defaultValue={selectedBooking.departureTime} />
                                        </Form.Group>
                                        <Form.Group controlId="arrivalTime" className="mb-3">
                                            <Form.Label>Arrival Time</Form.Label>
                                            <Form.Control type="time" placeholder="Enter arrival time" required defaultValue={selectedBooking.arrivalTime} />
                                        </Form.Group>
                                        <Form.Group controlId="price" className="mb-3">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control type="number" placeholder="Enter price" defaultValue={selectedBooking.price} required />
                                        </Form.Group>
                                    </Col>
                                </Row>
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
                    <p className="mb-0">&copy; 2024 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default BookingManagementPage;