import React, { useState } from 'react';

function Demo2() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});  // Field-wise errors store করার জন্য

  // Input change handler: Value update + error clear
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Type করলে corresponding error clear করুন (UX improvement)
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Submit handler: Fetch API use করে POST + field-wise error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});  // Previous errors clear করুন

    try {
      const response = await fetch('http://localhost:8080/api/public/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {  // 400 Bad Request check
        const errorData = await response.json();  // Backend-এর errors parse করুন
        setErrors(errorData.errors || {});  // Field-wise errors set করুন
        
        // Console-এ log (debug-এর জন্য)
        console.log('Field-wise Errors:', errorData);
        
        // Optional: Global alert
        alert(errorData.message || 'Please fix the errors below');
        return;
      }

      // Success: 200 OK
      const successData = await response.text();  // Response body (string)
      alert(successData);  // "User registered successfully!"
      setFormData({ username: '', email: '', password: '' });  // Form reset
    } catch (error) {
      console.error('Network error:', error);
      alert('Server error: ' + (error.message || 'Something went wrong'));
    }
  };

  return (
    <div className="App">
      <h2>User Registration Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username (letters, numbers, underscores only)"
          />
          {/* Field-wise Error Show: যদি errors.username থাকে, red span show করুন */}
          {errors.username && (
            <span id="usernameError" className="error-message">
              {errors.username}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter valid email"
          />
          {/* Field-wise Error Show */}
          {errors.email && (
            <span id="emailError" className="error-message">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password (min 8 characters)"
          />
          {/* Field-wise Error Show */}
          {errors.password && (
            <span id="passwordError" className="error-message">
              {errors.password}
            </span>
          )}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Demo2;