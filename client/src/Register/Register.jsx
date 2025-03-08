import React, { useState,useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function Register() {
    const [formData,setFormData]=useState(
        {username:"",email:"",password:"",mobile:""}
    )
    const {setUser}=useContext(AuthContext)
    const navigate=useNavigate()
    function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    function handleSubmit(e){
        e.preventDefault()
        console.log(formData)
        axios.post("http://localhost:5000/api/auth/signup",formData)
            .then((res)=>{
                console.log("response from register",res)
                localStorage.setItem("token",res.data.token)
                setUser({token:res.data.token,role:res.data.role})
                navigate("/")
            })
            .catch((err)=>{
                console.log(err)
            })
    }
    return (
        <div>
            <form>
                <div>
                    <input type="text" placeholder='Name' name="username" onChange={handleChange}/>
                </div>
                <div>
                    <input type="email" placeholder='EmailID' name="email" onChange={handleChange}/>
                </div>
                <div>
                    <input type="password" placeholder='Password' name="password" onChange={handleChange}/>
                </div>
                <div>
                    <input type="text" placeholder='Mobile Number' name="mobile" onChange={handleChange}/>
                </div>
                <button onClick={handleSubmit}>Register</button>
            </form>
        </div>
    )
}
