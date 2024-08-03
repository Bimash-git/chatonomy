import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import '../styles/Main.css';

function Login() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/api/auth/login", { email, password }
            .then(result => {
                console.log(result);
                if (result.data === "Success") {
                    navigate("/dashboard");
                }
                else {
                    navigate("/register")
                    alert("Not registered, Register now");
                }
            })
            .catch(err => console.log(err))
        )
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log("form submitted with email:", email, "and password: ", password);
    //     navigate("/home");
    // }

    return (
        <div className='login'>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            <span><p>Don't have an account?</p>Click to
            <Link to="/register"> Register</Link></span>
        </div>
    )
}

export default Login