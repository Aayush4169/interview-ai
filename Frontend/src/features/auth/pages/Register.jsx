import React,{useState} from 'react'
// hook that use for navigate
import { useNavigate, Link } from "react-router";
import{useAuth} from "../hooks/useAuth"
const Register =()=>{

    const navigate= useNavigate()
    const[username,setUsername] = useState("")
    const[email,setEmail] = useState("");
    const[password,setPassword]=useState("");
    const{loading,handleRegister} = useAuth()
     // reload problem solve 
    const handleSubmit= async(e)=>{
        e.preventDefault()
        await handleRegister(username ,email,password)
        navigate("/");
    }
    return (
          <main>
           <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>

                 <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input 
                    // two way binding
                    onChange={(e)=>{setUsername(e.target.value)}}
                    type="text" id="username" name="username" placeholder="enter username"/>
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                    // two way binding
                    onChange={(e)=>{setEmail(e.target.value)}}
                     type="email" id="email" name="email" placeholder="enter email adress"/>
                </div>
                 <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    // two way binding
                    onChange={(e)=>{setPassword(e.target.value)}}
                     type="password" id="passwrod" name="password" placeholder="enter password "/>
                </div>
                <button className='button primary-button'>Register</button>
            </form>
          <p>Already have an account? <Link to="/login">Login</Link></p>
           </div>
        </main>
    )
}

export default Register