import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate, useLocation } from "react-router-dom";

function ConfirmationPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const sendConfirmationRequest = async () => {
            try {
                const token = new URLSearchParams(location.search).get('token');
                console.log('TOKEN: ', token);
                
                const response = await axios.get(`http://localhost:8080/user/confirm-account?token=${token}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('RESPONSE: ', JSON.stringify(response));

                if (response?.status === 200) {
                    setIsSuccess(true);
                    setIsLoading(false);
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (err) {
                if (!err?.response) {
                    setIsSuccess(false);
                    setIsLoading(false);
                } else if (err.response?.status === 400) {
                    console.log(JSON.stringify(err.response));
                    setIsSuccess(false);
                    setIsLoading(false);
                } else if (err.response?.status === 403) {
                    console.log(JSON.stringify(err.response));
                    setIsSuccess(false);
                    setIsLoading(false);
                } else {
                    setIsSuccess(false);
                    setIsLoading(false);
                }
            }
        };

        sendConfirmationRequest();
    }, []);

    return (
        <div className="d-flex flex-column align-items-center">
            {isLoading && (
                <>
                    <h2 className="my-5">Please wait while we confirm your account...</h2>
                    <Spinner animation="border" role="status" className="my-5">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </>
            )}
            {isSuccess && (
                <>
                    <h2 className="my-5">Your account has been confirmed!</h2>
                    <p className="my-5">You will be redirected to the login page shortly.</p>
                    <Spinner animation="border" role="status" className="my-5">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </>
            )}
        </div>
    );
}

export default ConfirmationPage;