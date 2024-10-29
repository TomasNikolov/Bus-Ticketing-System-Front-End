import React from "react";
import ChatBot from "react-chatbotify";
import { GoogleGenerativeAI } from '@google/generative-ai';

function GeminiChatBot() {

    let apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    const modelType = "gemini-pro";
    let hasError = false;

    const gemini_stream = async (params) => {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelType });
            const result = await model.generateContentStream(params.userInput);

            let text = "";
            let offset = 0;
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
                for (let i = offset; i < chunkText.length; i++) {
                    await params.streamMessage(text.slice(0, i + 1));
                    await new Promise(resolve => setTimeout(resolve, 30));
                }
                offset += chunkText.length;
            }

            for (let i = offset; i < text.length; i++) {
                await params.streamMessage(text.slice(0, i + 1));
                await new Promise(resolve => setTimeout(resolve, 30));
            }
            await params.streamMessage(text);

            await params.endStreamMessage();
        } catch (error) {
            await params.injectMessage("Unable to load model, is your API Key valid?");
            hasError = true;
        }
    }

    const flow = {
        start: {
            message: "Hello! I’m Gemini, your virtual assistant. How can I assist you today?",
            path: "loop",
        },
        loop: {
            message: async (params) => {
                await gemini_stream(params);
            },
            path: () => {
                if (hasError) {
                    return "start"
                }
                return "loop"
            }
        }
    }

    const settings = {
        voice: { disabled: true },
        audio: { disabled: true },
        botBubble: { simStream: true },
        chatHistory: { storageKey: "floating_chatbot" },
        tooltip: {
            mode: 'START',
            text: 'Hello! I’m Gemini, your virtual assistant. How can I assist you today?',
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
                    Gemini
                </div>
            ),
        }
    }

    return (
        <ChatBot settings={settings} flow={flow}/>
    );
};

export default GeminiChatBot;