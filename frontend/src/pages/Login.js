import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useHistory } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login } = useContext(UserContext);
    const history = useHistory();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', form);
            login(res.data.token);
            history.push('/');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
