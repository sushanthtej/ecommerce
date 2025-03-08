import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
export default function Cart() {
    const [cart, setCart] = useState([])
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    useEffect(() => {
        fetchCartProducts()
    }, [])
    async function fetchCartProducts() {
        await axios.get("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then((res) => {
                console.log(res.data)
                setCart(res.data.products)
            })
            .catch((err) => {
                console.log("error from cart fetch", err)
            })
    }
    const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.productId.price, 0)
    function handleCheckout(){
        navigate("/checkout",{state:{cart}})
    }
    async function removeFromCart(productId){
        try{
            await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`,{
                headers:{Authorization:`Bearer ${user.token}`}
            })
            .then((res)=>{
                console.log(res.data.cart.products)
                setCart(res.data.cart.products)
            })
            
        }
        catch(err){
            console.log("from cart remove Item",err)
        }
    }
    if (!user) return <p>Please login to view your cart details</p>
    return (
        <div>
            <h2>Your Cart</h2>
            {
                cart.length === 0 ? (
                    <p>No products in cart</p>
                ) : (
                    <div>
                        {
                            cart.map((item) => (
                                <div key={item.productId._id}>
                                    <h3>{item.productId.name}</h3>
                                    <p>Qunatity:{item.quantity}</p>
                                    <p>Price:{item.productId.price}</p>
                                    <p>Description:{item.productId.description}</p>
                                    <p><img src={item.productId.imageUrl} alt={item.productId.name} width="30%" /></p>
                                    <p>Total Price: Rs. {(item.quantity * item.productId.price).toFixed(2)}</p>
                                    <button onClick={() => removeFromCart(item.productId._id)}>Remove Item</button>
                                </div>
                            ))
                        }
                        <h3>Total Price: Rs. {totalPrice.toFixed(2)}</h3>
                        <button onClick={handleCheckout}>Proceed to Pay</button>
                    </div>
                )
            }
        </div>
    )
}