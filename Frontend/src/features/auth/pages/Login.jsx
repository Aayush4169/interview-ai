import React from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from "react-router";// navigation hook
const Login =()=>{
    // reload problem solve 
    const handleSubmit=(e)=>{
        e.preventDefault()
    }
    return (
        <main>
           <div className="form-container">
            <h1>Login</h1>
            <form  onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="enter email adress"/>
                </div>
                 <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="passwrod" name="password" placeholder="enter password "/>
                </div>
                <button className='button primary-button'>Login</button>
            </form>
            <p>Do not have have an account? <Link to="/Register">Register</Link></p>
           </div>
        </main>
    )
}

export default Login