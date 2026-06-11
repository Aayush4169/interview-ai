import React,{useState} from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from "react-router";// navigation hook
import {useAuth} from '../hooks/useAuth'

const Login =()=>{
    const{loading,handleLogin} = useAuth()
    const navigate =  useNavigate()
   const [email,setEmail]= useState("")
   const[password,setPassword] = useState("")
    // reload problem solve 
    const handleSubmit= async(e)=>{
        e.preventDefault()
       await handleLogin({email,password})
       navigate('/')

    }
    if(loading){
        return (<main><h1>Loading......</h1></main>)
    }
    return (
        <main>
           <div className="form-container">
            <h1>Login</h1>
            <form  onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                    onChange={(e)=>{setEmail(e.target.value)}}
                     type="email" id="email" name="email" placeholder="enter email adress"/>
                </div>
                 <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    onChange={(e)=>{setPassword(e.target.value)}}
                     type="password" id="passwrod" name="password" placeholder="enter password "/>
                </div>
                <button className='button primary-button'>Login</button>
            </form>
            <p>Do not have have an account? <Link to="/Register">Register</Link></p>
           </div>
        </main>
    )
}

export default Login