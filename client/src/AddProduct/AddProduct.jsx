import React, { useContext, useState } from 'react'
import axios from "axios"
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AddProduct() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: "", description: "", price: null, category: "", stock: 0, imageUrl: "" })
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    function addProduct(e) {
        e.preventDefault()
        axios.post("http://localhost:5000/api/product/add", formData, {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then((res) => {
                console.log("response from add product", res)
                alert("Product added")
            })
            .catch((error)=>{
                console.log("error from add product",error)
            })
    }
    return (
        <div>
            <h2>Add Product</h2>
            <form encType='multipart/form-data'>
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder='Enter product name'
                        onChange={handleChange} required />
                </div>
                <div>
                    <input
                        type="text"
                        name="description"
                        placeholder='Enter product description'
                        onChange={handleChange} required />
                </div>
                <div>
                    <input
                        type="number"
                        name="price"
                        placeholder='Enter product price'
                        onChange={handleChange} required />
                </div>
                <div>
                    <input
                        type="number"
                        name="stock"
                        placeholder='Enter products stock'
                        onChange={handleChange} required />
                </div>
                <div>
                    <input
                        type="text"
                        name="category"
                        placeholder='Enter type of product'
                        onChange={handleChange} required />
                </div>
                <div>
                    <input
                        type="text"
                        name="imageUrl"
                        placeholder='Enter product image'
                        onChange={handleChange} required />
                </div>
                <button onClick={addProduct}>Add</button>
            </form>
        </div>
    )
}
