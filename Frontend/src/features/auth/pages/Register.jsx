import React from 'react'
// hook that use for navigate
import { useNavigate, Link } from "react-router";
const Register =()=>{
     // reload problem solve 
    const handleSubmit=(e)=>{
        e.preventDefault()
    }
    return (
          <main>
           <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>

                 <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" placeholder="enter username"/>
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="enter email adress"/>
                </div>
                 <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="passwrod" name="password" placeholder="enter password "/>
                </div>
                <button className='button primary-button'>Register</button>
            </form>
          <p>Already have an account? <Link to="/login">Login</Link></p>
           </div>
        </main>
    )
}

export default Register