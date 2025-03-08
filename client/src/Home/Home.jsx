import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [products,setProducts]=useState([])
  const {user}=useContext(AuthContext)
  const navigate=useNavigate()
  useEffect(()=>{
    fetchProducts();
  },[])
  async function fetchProducts(){
    await axios.get("http://localhost:5000/api/product")
      .then((res)=>{
        console.log(res)
        setProducts(res.data)
      })
      .catch((err)=>{
        console.log("Error from home at fetching products",err)
      })
  }
  async function addCart(productId){
    console.log(productId)
    if(!user || !user.token){
      alert("Please log in first")
      return 
    }
    try{
      await axios.post("http://localhost:5000/api/cart/add",{productId},{
        headers:{Authorization:`Bearer ${user.token}`}
      })
        .then((res)=>{
          alert("Product added to cart")
          navigate("/cart")
        })
    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div>
      <h2>Products</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
        {
          products.map((productItem)=>(
            <div key={productItem._id} style={{boxShadow:"0px 1px 4px black",padding:"10px"}}>
              <h3>{productItem.name}</h3>
              <p>Price:{productItem.price}</p>
              <p>Description:{productItem.description}</p>
              <p>Stock:{productItem.stock}</p>
              <p>Category:{productItem.category}</p>
              <p>
                <img width="30%" src={productItem.imageUrl} alt={productItem.name} />
              </p>
              {user && user.role==="user"&&(
                <button onClick={()=>addCart(productItem._id)}>Add to cart</button>
              )}
            </div>
          ))
        }
      </div>
    </div>
  )
}