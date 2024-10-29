import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar, Nav } from 'react-bootstrap';
import InfoMessage from './InfoMessage';
import { Link } from 'react-router-dom';
import { BeatLoader } from "react-spinners";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import GeminiChatBot from './GeminiChatBot';

function MyBookingsPage() {
    const userId = localStorage.getItem('userId');
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [disableButton, setDisableButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const accept = (booking) => {
        handleCancelClick(booking);
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected booking cancellation!', life: 5000 });
    }

    const confirmCancelBooking = (booking) => {
        confirmDialog({
            message: 'Do you want cancel this booking?',
            header: 'Cancellation Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(booking),
            reject
        });
    };

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);

            try {
                const response = await axios.get(process.env.REACT_APP_BACK_END_ENDPOINT + `/booking?userId=${userId}`);

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
            const response = await axios.delete(process.env.REACT_APP_BACK_END_ENDPOINT + `/booking?id=${booking.id}`,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 204) {
                toast.current.show({ severity: 'success', summary: 'Confirmed', detail: 'Booking cancelled successfully!', life: 5000 });
                setTimeout(() => {
                    navigate(0);
                    setLoading(false);
                    setDisableButton(false);
                }, 5000);
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
            const response = await axios.get(process.env.REACT_APP_BACK_END_ENDPOINT + `/ticket/send?ticketId=${booking.ticketId}`,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Ticket successfully generated!', life: 5000 });
                setTimeout(() => {
                    navigate(0);
                    setLoading(false);
                    setDisableButton(false);
                }, 5000);
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
                        <Nav.Link as={Link} to="/user/profile">
                            Personal Information
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
                {loading && (
                    <div className="text-center">
                        <BeatLoader color={"#123abc"} loading={loading} />
                    </div>
                )}
                {message && <div className="alert alert-danger mt-2">{message}</div>}
                {bookings.length === 0 ? <InfoMessage /> : (
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
                            header="Generate Ticket"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            body={(rowData) => (
                                <button className="btn btn-primary action-btn" disabled={disableButton} onClick={() => handleGenerateClick(rowData)}>
                                    Generate
                                </button>
                            )}
                        ></Column>
                        <Column
                            header="Cancel Booking"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            body={(rowData) => (
                                <button className="btn btn-danger action-btn" disabled={disableButton} onClick={() => confirmCancelBooking(rowData)}>
                                    Cancel
                                </button>
                            )}
                        ></Column>
                    </DataTable>
                )}

                <GeminiChatBot />
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
                    <p className="mb-0">&copy; 2024 Bus Reservation. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default MyBookingsPage;