import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/Main.css";

// axios.defaults.baseURL = 'http://localhost:5001'; // Set the base URL for Axios

function Register() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';

// handling image data
    if (image) {
      const imageFormData = new FormData();
      imageFormData.append("file", image);
      imageFormData.append("upload_preset", "chatonomy");
      imageFormData.append("cloud_name", "dqtib2zku");
      // console.log(imageFormData);

      try {
        setLoading(true);
        const res = await fetch("https://api.cloudinary.com/v1_1/dqtib2zku/image/upload", {
          method: "post",
          body: imageFormData,
        });

        const data = await res.json();
        // formData.append("image", data.secure_url);
        imageUrl = data.secure_url;
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image: ", error);
        setLoading(false);
      }

    }
    
    // handling form data 
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", imageUrl);

    console.log("Form data: ", formData.get("email"), formData.get("password"), formData.get("image"));

    await axios.post("http://localhost:5000/api/auth/register/", formData)
      .then(result => {
        console.log("Registration result: ", result);
        navigate("/dashboard");
      })
      .catch(err => console.log("Error: ", err));

  }

  return (
    <div className='register'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="text" name='email' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input type="Password" name='password' placeholder='Enter your Password' onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="email">Email</label>
        <input type="file" name='image' onChange={(e) => setImage(e.target.files[0])} />
        <button type='submit' disabled={loading}>{loading ? 'signing up' : "Signup"}</button>
      </form>
      <span><p>Already have an account?</p>
        Click to <Link to="/login">Login</Link>
      </span>
    </div>
  )
}

export default Register