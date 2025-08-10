import React, { useState } from 'react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5176/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage('✅ Registration successful!');
            } else {
                const errorData = await response.json();
                setMessage('❌ ' + (errorData.message || JSON.stringify(errorData)));
            }
        } catch (error) {
            setMessage('❌ Error: ' + error.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <h2>Register</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email"
                       className="form-control mb-3" value={formData.email} onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username"
                       className="form-control mb-3" value={formData.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password"
                       className="form-control mb-3" value={formData.password} onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password"
                       className="form-control mb-3" value={formData.confirmPassword} onChange={handleChange} required />
                <button className="btn btn-primary w-100">Register</button>
            </form>
        </div>
    );
}
