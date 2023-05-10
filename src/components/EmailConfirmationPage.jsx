import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function EmailConfirmationPage() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="mt-5">
                        <h3>Check Your Email</h3>
                        <p>A confirmation email has been sent to your email address.</p>
                        <p>Please check your inbox and click on the link to confirm your account.</p>
                        <p>If you do not receive the email within a few minutes, please check your spam folder.</p>
                        <p>If you still cannot find the email, please contact our support team.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailConfirmationPage;