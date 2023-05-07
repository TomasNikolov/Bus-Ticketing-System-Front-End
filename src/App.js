import React from 'react';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import BookingPage from './components/BookingPage';
import TicketPreview from './components/TicketPreview';
import PaymentPage from './components/PaymentPage';
import MyBookingsPage from './components/MyBookingsPage';
import EmailConfirmationPage from './components/EmailConfirmationPage';
import ConfirmationPage from './components/ConfirmationPage';
import AdminDashboard from './components/AdminDashboard';
import BusManagementPage from './components/BusManagmentPage';
import UserManagementPage from './components/UserManagmentPage';
import BookingManagementPage from './components/BookingManagementPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/admin/home' element={<AdminDashboard />} />
          <Route path='/admin/buses' element={<BusManagementPage />} />
          <Route path='/admin/users' element={<UserManagementPage />} />
          <Route path='/admin/bookings' element={<BookingManagementPage />} />
          <Route path='/home' element={<DashboardPage />} />
          <Route path='/booking' element={<BookingPage />} />
          <Route path='/booking/ticket-preview' element={<TicketPreview />} />
          <Route path='/booking/payment' element={<PaymentPage />} />
          <Route path='/my_bookings' element={<MyBookingsPage />} />
          <Route path='/confirmation' element={<EmailConfirmationPage />} />
          <Route path='/confirm-account' element={<ConfirmationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
