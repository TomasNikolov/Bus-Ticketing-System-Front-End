import React, { useState, useEffect, useRef } from "react";
import { Container, Button, Modal, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import GeminiChatBot from './GeminiChatBot';

function UserManagementPage() {
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const accept = (user) => {
        handleDelete(user);
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected to delete a user!', life: 5000 });
    }

    const confirmDeleteUser = (user) => {
        confirmDialog({
            message: 'Do you want delete this user?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(user),
            reject
        });
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setMessage('');
            setSuccessMessage('');
            setLoading(true);
            try {
                const response = await axios.get(process.env.REACT_APP_BACK_END_ENDPOINT + "/admin/users",
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        }
                    }
                );

                console.log("RESPONSE: ", JSON.stringify(response?.data));

                if (response?.data) {
                    setUsers(response.data);
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
        fetchUsers();
    }, []);

    const handleEditClose = () => setShowEditModal(false);
    const handleEditShow = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const formData = event.target.elements;
        const updatedUser = {
            id: selectedUser.id,
            username: formData.username.value,
            firstName: formData.firstName.value,
            lastName: formData.lastName.value,
            enabled: formData.enabled.value,
            role: formData.role.value
        };

        console.log('UPDATED USER: ', JSON.stringify(updatedUser));

        try {
            const response = await axios.put(process.env.REACT_APP_BACK_END_ENDPOINT + "/admin/users",
                JSON.stringify(updatedUser),
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
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'User has been successfully updated!', life: 5000 });
                setTimeout(() => {
                    window.location.reload();
                    setLoading(false);
                    setSelectedUser(null);
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

    const handleDelete = async (user) => {
        setLoading(true);
        try {
            const response = await axios.delete(process.env.REACT_APP_BACK_END_ENDPOINT + `/admin/users?id=${user.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }
            );

            console.log("RESPONSE: ", JSON.stringify(response));

            if (response?.status === 204) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'User has been successfully deleted!', life: 5000 });
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>User Management</h1>
                </div>
                {users.length === 0 ? (
                    <div className="alert alert-info">
                        <p>Currently, there are no users registered in the system. Please check back later.</p>
                    </div>) : (
                    <DataTable
                        value={users}
                        tableStyle={{ minWidth: '50rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}
                        paginator
                        showGridlines
                        rows={10}
                        dataKey="id"
                        className="styled-table"
                    >
                        <Column field="username"
                            header="Username"
                            className="table-column"
                            filter
                            filterPlaceholder="Search by Username"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="firstName"
                            header="First Name"
                            sortable
                            filter
                            filterPlaceholder="Search by First Name"
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="lastName"
                            header="Last Name"
                            sortable
                            filter
                            filterPlaceholder="Search by Last Name"
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="email"
                            header="Email"
                            sortable
                            filter
                            filterPlaceholder="Search by Email"
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="role"
                            header="Role"
                            sortable
                            filter
                            filterPlaceholder="Search by Role"
                            className="table-column"
                            headerStyle={{ backgroundColor: '#e0e7ff', color: '#2c3e50', fontWeight: 'bold' }}
                        ></Column>
                        <Column field="status"
                            header="Status"
                            sortable
                            filter
                            filterPlaceholder="Search by Status"
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
                                        onClick={() => confirmDeleteUser(rowData)}
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

                {selectedUser && (
                    <Modal show={showEditModal} onHide={handleEditClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {successMessage && <div className="alert alert-success mt-2">{successMessage}</div>}
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" defaultValue={selectedUser.username} required />
                                </Form.Group>
                                <Form.Group controlId="firstName" className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter first name" defaultValue={selectedUser.firstName} required />
                                </Form.Group>
                                <Form.Group controlId="lastName" className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter last name" defaultValue={selectedUser.lastName} required />
                                </Form.Group>
                                <Form.Group controlId="enabled" className="mb-3">
                                    <Form.Label>Enabled</Form.Label>
                                    <Form.Control as="select" defaultValue="True" required>
                                        <option>True</option>
                                        <option>False</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="role" className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control as="select" defaultValue={selectedUser.role} required>
                                        <option>USER</option>
                                        <option>ADMIN</option>
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                )}

                <GeminiChatBot />
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
export default UserManagementPage;
