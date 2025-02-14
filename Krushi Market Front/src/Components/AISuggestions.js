import React, { useState, useEffect } from 'react';
import './AISuggestions.css';

function KrushiMarketContent() {
    const [topic, setTopic] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generatedText, setGeneratedText] = useState([]); // Array to store generated text line by line
    const YOUR_API_KEY = ''; // Replace with your actual API key

    const generateContent = async () => {
        setLoading(true);
        setResponse(null);
        setGeneratedText([]); // Clear previous text
        if (!topic) {
            alert("Please enter a topic related to farming");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${YOUR_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: `${topic} in 100 words only` }],
                            },
                        ],
                    }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(`API request failed with status ${res.status}: ${errorData?.error?.message || res.statusText}`);
            }

            const data = await res.json();
            setResponse(data);

            // Process the response to display text line by line
            if (data.candidates && data.candidates.length > 0) {
                const fullText = data.candidates[0].content.parts[0].text;
                const textArray = fullText.split('\n'); // Split by newline characters
                setGeneratedText(textArray);


            }

        } catch (error) {
            console.error('Error generating content:', error);
            setResponse({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-generator-container">
            <h1>AI-Powered Farming Helper</h1>
            <div className="input-area">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic related to Krushi Market"
                    className="topic-input"
                />
                <button onClick={generateContent} disabled={loading} className="generate-button">
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {response && (
                <div className="response-area">
                    {response.error && <p className="error-message">Error: {response.error}</p>}
                    {generatedText.length > 0 && ( // Display line by line
                        <div className="content-block">
                            {generatedText.map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default KrushiMarketContent;
