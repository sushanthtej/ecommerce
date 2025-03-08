import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
export default function Navigation() {
    const { user,logout } = useContext(AuthContext)
    return (
        <div style={{display:"flex",gap:"20px", padding:"10px"}}>
            <Link to="/">Home</Link>
            {
                user?(
                    <>
                        {user&& user.role==="user" && <Link to="/cart">Cart</Link>}
                        {user&& user.role==="admin" && <Link to="/add-product">Add Product</Link>}
                        <Link onClick={logout}>Logout</Link>
                    </>
                ):(
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )
            }
        </div>
    )
}
