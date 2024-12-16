import './App.css';
import React, { useState, useEffect } from "react";

function App() {
    const baseURL = "http://localhost:8000"; // Base URL for the server

    const [data, setData] = useState([]); // State for storing fetched data
    const [selectedBranch, setSelectedBranch] = useState("1"); // Default branch

    // Fetch data when the app loads or branch changes
    useEffect(() => {
        fetch(`${baseURL}/result/${selectedBranch}`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data);
                setData(data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [selectedBranch]);

    return (
        <div className="App">
            <header>
                <h1>Video4Ever Database</h1>
                <p>Select a Branch to View Movie Data</p>
                {/* Dropdown to select branch */}
                <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                    <option value="1">Branch 1</option>
                    <option value="2">Branch 2</option>
                    <option value="3">Branch 3</option>
                </select>
            </header>

            {/* Table to display fetched data */}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Director First</th>
                        <th>Director Last</th>
                        <th>Movies On Hand</th>
                        <th>Studio</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                            <td>{row.Title}</td>
                            <td>${row.Price}</td>
                            <td>{row.DirectorFirst}</td>
                            <td>{row.DirectorLast}</td>
                            <td>{row.OnHand}</td>
                            <td>{row.StudioName || "N/A"}</td> {/* Handle null values */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;