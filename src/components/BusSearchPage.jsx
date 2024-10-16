import React, { useState } from 'react';
import './styles/DashboardPage.css';
import './styles/BusSearchPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

function BusSearchPage() {
    const [startDestination, setStartDestination] = useState('');
    const [endDestination, setEndDestination] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [startError, setStartError] = useState('');
    const [endError, setEndError] = useState('');
    const [dateError, setDateError] = useState('');
    const [busData, setBusData] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
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
            const response = await axios.get(process.env.REACT_APP_BACK_END_ENDPOINT + `/buses?start=${startDestination}&end=${endDestination}&date=${date}`,
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
        console.log("Bus: ", JSON.stringify(bus)); 

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

    const formatCurrency = (value) => {
        return value.toLocaleString('bg-BG', { style: 'currency', currency: 'BGN' });
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            departureTime: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.TIME_IS }] },
            arrivalTime: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.TIME_IS }] },
            ticketPrice: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        });
        setGlobalFilterValue('');
    };

    const ticketPriceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.ticketPrice);
    };

    const ticketPriceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="BGN" locale="bg-BG" />;
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
                        <Nav.Link as={Link} to="/user/profile">
                            Personal Information
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
                            <input
                                id="from"
                                className="form-control"
                                required
                                onChange={handleStarDestinationChange}
                            />
                            {startError && <div className="alert alert-danger">{startError}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="control-label" htmlFor="to">To:</label>
                            <input
                                id="to"
                                className="form-control"
                                required
                                onChange={handleEndDestinationChange}
                            />
                            {endError && <div className="alert alert-danger">{endError}</div>}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label className="control-label" htmlFor="date">Date:</label>
                            <input
                                type="date"
                                id="date"
                                className="form-control"
                                required
                                onChange={handleDateChange}
                            />
                            {dateError && <div className="alert alert-danger">{dateError}</div>}
                        </div>
                    </div>
                    <div className="col-md-3" style={{ paddingTop: 33 }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="table-container mt-4">
                    {busData.length > 0 && (
                        <DataTable
                            value={busData}
                            tableStyle={{ minWidth: '50rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}
                            paginator
                            showGridlines
                            rows={10}
                            dataKey="id"
                            className="styled-table"
                            filters={filters}
                            globalFilterFields={['name', 'departureTime', 'arrivalTime', 'ticketPrice']}
                        >
                            <Column field="name"
                                header="Bus Name"
                                className="table-column"
                                filter
                                filterPlaceholder="Search by bus name"
                                headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            ></Column>
                            <Column field="startDestination"
                                header="From"
                                className="table-column"
                                headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            ></Column>
                            <Column field="endDestination"
                                header="To"
                                className="table-column"
                                headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            ></Column>
                            <Column field="departureTime"
                                header="Departure Time"
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
                            <Column field="ticketPrice"
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
                            <Column
                                header="Action"
                                headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                                body={(rowData) => (
                                    <button className="btn btn-primary action-btn" onClick={() => handleBooking(rowData)}>
                                        Book
                                    </button>
                                )}
                            ></Column>
                        </DataTable>
                    )}
                </div>
            </div>

            <footer
                className="bg-dark text-white py-3"
                style={{ marginTop: "15rem", height: "10rem" }}
            >
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
                <div
                    className="bg-secondary text-center py-2"
                    style={{ height: "3.5rem" }}
                >
                    <p className="mb-0">
                        &copy; 2024 Bus Reservation. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default BusSearchPage;