import React, { useState } from 'react';
import Navbar from './tempelate/Navbar';

import axios from 'axios';

const Appointment = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        appointmentDate: '',
        docname:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/appointments', formData);
            console.log('Appointment submitted:', response.data);
            // Optionally reset form
            setFormData({ name: '', email: '', appointmentDate: '', docname:'' });
        } catch (error) {
            console.error('Error submitting appointment:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Appointment Booking</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="text" name="docname" value={formData.docname} onChange={handleChange} required />
                </div>
                <div>
                    <label>Appointment Date:</label>
                    <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Appointment;
