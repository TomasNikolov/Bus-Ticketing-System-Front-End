import React, { useState, useEffect, useRef } from "react";
import { Container, Button, Modal, Form, Nav, Navbar, NavDropdown, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import * as XLSX from 'xlsx';
import './styles/BusManagmentPage.css';
import GeminiChatBot from './GeminiChatBot';

function BusManagementPage() {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [buses, setBuses] = useState([]);
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const accept = (bus) => {
        handleDelete(bus);
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected to delete a bus!', life: 5000 });
    }

    const confirmDeleteBus = (bus) => {
        confirmDialog({
            message: 'Do you want delete this bus?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(bus),
            reject
        });
    };

    useEffect(() => {
        const fetchBuses = async () => {
            setMessage('');
            setSuccessMessage('');
            setLoading(true);
            try {
                const response = await axios.get(process.env.REACT_APP_BACK_END_ENDPOINT + "/admin/buses",
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );

                console.log("RESPONSE: ", JSON.stringify(response?.data));

                if (response?.data) {
                    setBuses(response.data);
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
        fetchBuses();
    }, []);

    const handleAddClose = () => setShowAddModal(false);
    const handleAddShow = () => setShowAddModal(true);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = (bus) => {
        setSelectedBus(bus);
        setShowEditModal(true);
    };

    const handleAddSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const formData = event.target.elements;
        const newBus = {
            name: formData.name.value,
            startDestination: formData.startDestination.value,
            endDestination: formData.endDestination.value,
            capacity: formData.capacity.value,
            availableSeats: formData.availableSeats.value,
            reservedSeats: formData.reservedSeats.value,
            departureDate: formData.departureDate.value,
            departureTime: formData.departureTime.value,
            arrivalDate: formData.arrivalDate.value,
            arrivalTime: formData.arrivalTime.value,
            distance: formData.distance.value,
            ticketPrice: formData.ticketPrice.value,
        };

        try {
            const response = await axios.post(process.env.REACT_APP_BACK_END_ENDPOINT + "/admin/buses",
                JSON.stringify(newBus),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 201) {
                setShowAddModal(false);
                setShowEditModal(false);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'The bus has been successfully created!', life: 5000 });
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

    const handleEditSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const formData = event.target.elements;
        const updatedBus = {
            id: selectedBus.id,
            name: formData.name.value,
            startDestination: formData.startDestination.value,
            endDestination: formData.endDestination.value,
            capacity: formData.capacity.value,
            availableSeats: formData.availableSeats.value,
            reservedSeats: formData.reservedSeats.value,
            departureDate: formData.departureDate.value,
            departureTime: formData.departureTime.value,
            arrivalDate: formData.arrivalDate.value,
            arrivalTime: formData.arrivalTime.value,
            distance: formData.distance.value,
            ticketPrice: formData.ticketPrice.value,
        };

        console.log('UPDATED BUS: ', JSON.stringify(updatedBus));

        try {
            const response = await axios.put(process.env.REACT_APP_BACK_END_ENDPOINT + "/admin/buses",
                JSON.stringify(updatedBus),
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
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'The bus has been successfully updated!', life: 5000 });
                setTimeout(() => {
                    setSelectedBus(null);
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

    const handleDelete = async (bus) => {
        setLoading(true);
        try {
            const response = await axios.delete(process.env.REACT_APP_BACK_END_ENDPOINT + `/admin/buses?id=${bus.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 204) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'The bus has been successfully deleted!', life: 5000 });
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
        return formatCurrency(rowData.ticketPrice);
    };

    const ticketPriceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="BGN" locale="bg-BG" />;
    };

    const createBuses = async (busesData) => {
        try {
            const response = await axios.post(process.env.REACT_APP_BACK_END_ENDPOINT + "/admin/buses/bulk",
                JSON.stringify(busesData),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            if (response?.status === 201) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'All buses has been successfully uploaded!', life: 5000 });
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
    }

    const handleFileUpload = (e) => {
        setLoading(true);
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet);

            let transformedData = transformKeys(sheetData);
            console.log('SHEET DATA: ' + JSON.stringify(transformedData, null, 2));
            createBuses(transformedData);
        };

        reader.readAsBinaryString(file);
        document.getElementById("file-upload").value = "";
    };

    const transformKeys = (data) => {
        const excelDateToJSDate = (serial) => {
            const excelStartDate = new Date(1900, 0, 1);
            const days = serial - 1;
            return new Date(excelStartDate.getTime() + days * 24 * 60 * 60 * 1000);
        };

        const parseExcelTime = (fraction) => {
            const totalSeconds = fraction * 24 * 60 * 60;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);
            return { hours, minutes, seconds };
        };

        const formatForBackend = (date, time) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate() - 1).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            const formattedTime = time;
            return { formattedDate, formattedTime };
        };

        return data.map(item => {
            const transformedItem = {};

            Object.keys(item).forEach(key => {
                const newKey = key.charAt(0).toLowerCase() + key.slice(1).replace(/\s+/g, '');

                if (newKey === 'departureDate' || newKey === 'arrivalDate') {
                    const jsDate = excelDateToJSDate(item[key]);
                    transformedItem[newKey] = jsDate;
                } else if (newKey === 'departureTime' || newKey === 'arrivalTime') {
                    const parsedTime = parseExcelTime(item[key]);
                    transformedItem[newKey] = `${String(parsedTime.hours).padStart(2, '0')}:${String(parsedTime.minutes).padStart(2, '0')}:${String(parsedTime.seconds).padStart(2, '0')}`;
                } else {
                    transformedItem[newKey] = item[key];
                }
            });

            if (transformedItem.departureDate && transformedItem.departureTime) {
                const formattedDeparture = formatForBackend(transformedItem.departureDate, transformedItem.departureTime);
                transformedItem.departureDate = formattedDeparture.formattedDate;
                transformedItem.departureTime = formattedDeparture.formattedTime;
            }

            if (transformedItem.arrivalDate && transformedItem.arrivalTime) {
                const formattedArrival = formatForBackend(transformedItem.arrivalDate, transformedItem.arrivalTime);
                transformedItem.arrivalDate = formattedArrival.formattedDate;
                transformedItem.arrivalTime = formattedArrival.formattedTime;
            }

            return transformedItem;
        });
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
                {loading && (
                    <div className="text-center">
                        <BeatLoader color={"#123abc"} loading={loading} />
                    </div>
                )}

                {message &&
                    <div className="alert alert-danger mt-2">
                        {message}
                    </div>
                }
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 style={{ width: "40%" }}>Bus Management</h1>
                    <div style={{ width: "20%" }}></div>
                    <Button
                        variant="primary"
                        style={{ width: "10%" }}
                        onClick={handleAddShow}
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Add Bus
                    </Button>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        <i className="pi pi-upload"></i> Upload Buses
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileUpload}
                        accept=".xlsx"
                        aria-label="File upload input"
                        style={{ display: 'none', width: "10" }}
                    />
                </div>
                <div className="table-responsive">
                    {buses.length === 0 ? (
                        <div className="alert alert-info">
                            <p>There are no buses in the system at the moment. Please check back later or add new buses.</p>
                        </div>) : (
                        <DataTable
                            value={buses}
                            tableStyle={{ minWidth: '50rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}
                            paginator
                            showGridlines
                            rows={10}
                            dataKey="id"
                            className="styled-table"
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
                            <Column field="arrivalDate"
                                header="Arrival Date"
                                sortable
                                className="table-column"
                                headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            ></Column>
                            <Column field="capacity"
                                header="Capacity"
                                sortable
                                className="table-column"
                                dataType="numeric"
                                filter
                                filterPlaceholder="Search by bus capacity"
                                style={{ maxWidth: '8rem' }}
                                headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            ></Column>
                            <Column field="availableSeats"
                                header="Available Seats"
                                sortable
                                className="table-column"
                                dataType="numeric"
                                filter
                                filterPlaceholder="Search by available seats"
                                style={{ maxWidth: '8rem' }}
                                headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                            ></Column>
                            <Column field="reservedSeats"
                                header="Reserved Seats"
                                sortable
                                className="table-column"
                                dataType="numeric"
                                filter
                                filterPlaceholder="Search by available seats"
                                style={{ maxWidth: '8rem' }}
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
                                            onClick={() => confirmDeleteBus(rowData)}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </Button>
                                    </div>
                                )}
                            ></Column>
                        </DataTable>
                    )}
                </div>

                <Modal show={showAddModal} onHide={handleAddClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Bus</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {successMessage &&
                            <div className="alert alert-success mt-2">
                                {successMessage}
                            </div>
                        }
                        <Form onSubmit={handleAddSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group
                                        controlId="name"
                                        className="mb-3"
                                    >
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter name"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="startDestination"
                                        className="mb-3"
                                    >
                                        <Form.Label>Start Destination</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter start destination"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="departureDate"
                                        className="mb-3"
                                    >
                                        <Form.Label>Departure Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Enter departure date"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="arrivalDate"
                                        className="mb-3"
                                    >
                                        <Form.Label>Arrival Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Enter arrival date"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="availableSeats"
                                        className="mb-3"
                                    >
                                        <Form.Label>Available Seats</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter available seats"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="distance"
                                        className="mb-3">
                                        <Form.Label>Route Distance</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter route distance"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group
                                        controlId="capacity"
                                        className="mb-3"
                                    >
                                        <Form.Label>Capacity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter bus capacity"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="endDestination"
                                        className="mb-3"
                                    >
                                        <Form.Label>End Destination</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter end destination"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="departureTime"
                                        className="mb-3"
                                    >
                                        <Form.Label>Departure Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            placeholder="Enter departure time"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="arrivalTime"
                                        className="mb-3"
                                    >
                                        <Form.Label>Arrival Time</Form.Label>
                                        <Form.Control
                                            type="time"
                                            placeholder="Enter arrival time"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="reservedSeats"
                                        className="mb-3"
                                    >
                                        <Form.Label>Reserved Seats</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter reserved seats"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        controlId="ticketPrice"
                                        className="mb-3"
                                    >
                                        <Form.Label>Ticket Price</Form.Label>
                                        <Form.Control
                                            type="number" step="0.01"
                                            placeholder="Enter ticket price"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {selectedBus && (
                    <Modal show={showEditModal} onHide={handleEditClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Bus</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {successMessage &&
                                <div className="alert alert-success mt-2">
                                    {successMessage}
                                </div>
                            }
                            <Form onSubmit={handleEditSubmit}>
                                <Row>
                                    <Col>
                                        <Form.Group
                                            controlId="name"
                                            className="mb-3"
                                        >
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                required
                                                defaultValue={selectedBus.name}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="startDestination"
                                            className="mb-3"
                                        >
                                            <Form.Label>Start Destination</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter start destination"
                                                required
                                                defaultValue={selectedBus.startDestination}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="departureDate"
                                            className="mb-3"
                                        >
                                            <Form.Label>Departure Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter departure date"
                                                required defaultValue={selectedBus.departureDate}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="arrivalDate"
                                            className="mb-3"
                                        >
                                            <Form.Label>Arrival Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter arrival date"
                                                required
                                                defaultValue={selectedBus.arrivalDate}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="availableSeats"
                                            className="mb-3"
                                        >
                                            <Form.Label>Available Seats</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter available seats"
                                                required
                                                defaultValue={selectedBus.availableSeats}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="distance"
                                            className="mb-3"
                                        >
                                            <Form.Label>Route Distance</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter route distance"
                                                required
                                                defaultValue={selectedBus.distance}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group
                                            controlId="capacity"
                                            className="mb-3"
                                        >
                                            <Form.Label>Capacity</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter bus capacity"
                                                required
                                                defaultValue={selectedBus.capacity}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="endDestination"
                                            className="mb-3"
                                        >
                                            <Form.Label>End Destination</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter end destination"
                                                required
                                                defaultValue={selectedBus.endDestination}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="departureTime"
                                            className="mb-3"
                                        >
                                            <Form.Label>Departure Time</Form.Label>
                                            <Form.Control
                                                type="time"
                                                placeholder="Enter departure time"
                                                required
                                                defaultValue={selectedBus.departureTime}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="arrivalTime"
                                            className="mb-3"
                                        >
                                            <Form.Label>Arrival Time</Form.Label>
                                            <Form.Control
                                                type="time"
                                                placeholder="Enter arrival time"
                                                required
                                                defaultValue={selectedBus.arrivalTime}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="reservedSeats"
                                            className="mb-3"
                                        >
                                            <Form.Label>Reserved Seats</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter reserved seats"
                                                required
                                                defaultValue={selectedBus.reservedSeats}
                                            />
                                        </Form.Group>
                                        <Form.Group
                                            controlId="ticketPrice"
                                            className="mb-3"
                                        >
                                            <Form.Label>Ticket Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                placeholder="Enter ticket price"
                                                required
                                                defaultValue={selectedBus.ticketPrice}
                                            />
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

                <GeminiChatBot />
            </Container>

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
export default BusManagementPage;
