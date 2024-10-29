import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatBot from "react-chatbotify";

const ChatAssistant = () => {
    const [form, setForm] = useState({});
    const [busData, setBusData] = useState([]);
    const [busOptions, setBusOptions] = useState([]);
    const [formattedDate, setFormattedDate] = useState('');
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$/;
    const navigate = useNavigate();

    const formStyle = {
        marginTop: 10,
        marginLeft: 20,
        border: "1px solid #491d8d",
        padding: 10,
        borderRadius: 5,
        maxWidth: 300
    }

    const flow = {
        start: {
            message: "Hello! I'm your virtual assistant here to help you with ticket reservations. Would you like assistance with booking a ticket?",
            options: ["Yes", "No"],
            chatDisabled: true,
            function: (params) => setForm({ ...form, assist: params.userInput }),
            path: async (params) => {
                if (params.userInput === 'Yes') {
                    return "start_destination";
                }
                return "end";
            }
        },
        start_destination: {
            message: "Great! Where will you be starting your journey?",
            function: (params) => setForm({ ...form, from: params.userInput }),
            path: "end_destination"
        },
        end_destination: {
            message: "Awesome! What’s your final destination?",
            function: (params) => setForm({ ...form, to: params.userInput }),
            path: "departure_date"
        },
        departure_date: {
            message: "Please enter your departure date in the format DD.MM.YYYY (e.g., 15.10.2024).",
            function: (params) => setForm({ ...form, departureDate: params.userInput }),
            path: async (params) => {
                if (!dateRegex.test(params.userInput)) {
                    await params.injectMessage("Date must be in this format DD.MM.YYYY");
                    return;
                }

                const [day, month, year] = params.userInput.split('.');
                const isoFormattedDate = `${year}-${month}-${day}`;
                setFormattedDate(isoFormattedDate);
                return "max_price";
            }
        },
        max_price: {
            message: "What’s the highest ticket price you’re willing to pay for your journey?",
            function: (params) => setForm({ ...form, maxTicketPrice: params.userInput }),
            path: async (params) => {
                if (isNaN(Number(params.userInput))) {
                    await params.injectMessage("Ticket price must be a number!");
                    return;
                }

                setBusData([]);

                if (!form.from.trim()) {
                    await params.injectMessage("Start Destination cannot be blank");
                    return;
                }

                if (!form.to.trim()) {
                    await params.injectMessage("End Destination cannot be blank");
                    return;
                }

                try {
                    const response = await axios.get(process.env.REACT_APP_BACK_END_ENDPOINT + `/buses?start=${form.from}&end=${form.to}&date=${formattedDate}&maxTicketPrice=${params.userInput}`,
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    console.log("RESPONSE: ", JSON.stringify(response));

                    if (response?.data) {
                        const buses = response.data;
                        setBusData(buses);

                        const options = buses.map((bus, index) => ({
                            label: `Option ${index + 1}: ${bus.name}`,
                            bus: bus,
                        }));

                        options.push({ label: "None of these options work for me" });

                        setBusOptions(options);
                    }
                } catch (err) {
                    if (!err?.response) {
                        await params.injectMessage('No Server Response');
                        return "repeat";
                    } else if (err.response?.status === 403) {
                        console.log(JSON.stringify(err.response));
                        await params.injectMessage("Access Denied. You don't have permission to access this resource. Please contact the system administrator if you believe you should have access.");
                        return "repeat";
                    } else if (err.response?.status === 404) {
                        console.log(JSON.stringify(err.response?.data?.message[0]));
                        await params.injectMessage(err.response?.data?.message[0]);
                        return "repeat";
                    } else {
                        await params.injectMessage("Internal server error");
                        return "repeat";
                    }
                }

                return "bus_list";
            }
        },
        bus_list: {
            message: "Here are the best options for you based on your preferences. Which bus would you like to book?",
            component: (
                <div>
                    {busData.length === 0 ? (
                        <p>Unfortunately, there are no buses available based on your criteria.</p>
                    ) : (
                        busData.map((bus) => (
                            <div key={bus.id} style={formStyle}>
                                <p>Bus Name: {bus.name}</p>
                                <p>From: {bus.startDestination}</p>
                                <p>To: {bus.endDestination}</p>
                                <p>Departure Time: {bus.departureTime}</p>
                                <p>Arrival Time: {bus.arrivalTime}</p>
                                <p>Ticket Price: ${bus.ticketPrice}</p>
                            </div>
                        ))
                    )}
                </div>
            ),
            options: busOptions.map(option => option.label),
            function: async (params) => {
                if (params.userInput === 'None of these options work for me') {
                    return;
                }
                setTimeout(() => {
                    let bus = busOptions.find(option => option.label === params.userInput).bus;
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
                }, 5000);
            },
            chatDisabled: true,
            path: async (params) => {
                if (params.userInput === 'None of these options work for me') {
                    return "repeat";
                }
                return "succes_end"
            }
        },
        succes_end: {
            message: (params) => `You have chosen ${params.userInput}. Please hold on! I'll take you to the booking page shortly.`,
            chatDisabled: true
        },
        repeat: {
            message: "Would you like to modify your reservation preferences?",
            chatDisabled: true,
            options: ["Yes", "No"],
            path: async (params) => {
                if (params.userInput === 'Yes') {
                    return "start_destination";
                }
                return "end";
            }
        },
        end: {
            message: "Thank you for your interest! I’m here if you need any further assistance.",
            chatDisabled: true,
            options: ["Reserve Ticket"],
            path: "start"
        }
    }

    const settings = {
        voice: { disabled: true },
        audio: { disabled: true },
        botBubble: { simStream: true },
        chatHistory: { storageKey: "floating_chatbot" },
        tooltip: {
            mode: 'START',
            text: 'Need assistance with your ticket booking? Let’s chat! 🎟️😊',
        },
        fileAttachment: { disabled: true },
        footer: {
            text: (
                <div style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "center", columnGap: 3 }}
                >
                    <span key={0}>Powered By </span>
                    <div
                        key={1}
                        style={{
                            borderRadius: "50%",
                            width: 14,
                            height: 14,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "linear-gradient(to right, #42b0c5, #491d8d)",
                        }}
                    >
                    </div>
                    <span key={2} style={{ fontWeight: "bold" }}> React ChatBotify</span>
                </div>
            )
        },
        header: {
            title: (
                <div style={{ cursor: "pointer", margin: 0, fontSize: 20, fontWeight: "bold" }}>
                    Chat GPT
                </div>
            ),
        }
    }

    return (
        <ChatBot settings={settings} flow={flow} />
    );
};

export default ChatAssistant;