const express = require("express")
const Cart =require("../models/Cart")
const Product = require("../models/Product")
const {authMiddleware} = require("../middleware/authMiddleware")
const router =express.Router()

router.post("/add",authMiddleware,async (req,res)=>{
    console.log("----------------")
    
    try{
        if(req.user.role==="admin"){
            return res.status(403).json({"message":"Unauthorized to add product to cart"})
        }
        const {productId}=req.body
        const product=await Product.findById(productId)
        if(!product){
            return res.status(400).json({"message":"Product not found"})
        }
        console.log(req.user,productId)
        console.log(product)
        let cart =await Cart.findOne({userId:req.user.id})
        if(cart){
            const existingProduct=cart.products.find(p=>p.productId.toString()===productId)
            if(existingProduct)
                existingProduct.quantity+=1
            else{
                cart.products.push({productId})
            }
        }
        else{
            cart =new Cart({userId:req.user.id,products:[{productId}]})
        }
        await cart.save()
        res.status(201).json({"message":"Add to cart successful"})
    }
    catch(err){
        return res.status(500).json({"message":"Server error in cart add"})
    }
})

router.get("/",authMiddleware,async (req,res)=>{
    try{
        const cart=await Cart.findOne({userId:req.user.id}).populate("products.productId")
        console.log(cart)
        if(!cart){
            return res.status(200).json({products:[]})
        }
        return res.json(cart)
    }
    catch(error){
        console.log("Error from cart fetch",error)
        return res.status(500).json({"message":"Server error from cart fetch"})
    }
})

router.delete("/remove/:productId",authMiddleware,async (req,res)=>{
    try{
        let cart=await Cart.findOne({userId:req.user.id})
        if(!cart){
            return res.status(404).json({"message":"cart not fuund that product"})
        }
        cart.products=cart.products.filter(p=>p.productId.toString()!==req.params.productId)
        await cart.save()
        return res.status(200).json({"message":"Item removed successfully"})
    }
    catch(error){
        console.log("Error from cart delete",error)
        return res.status(500).json({"message":"Server error from cart delete"})
    }
})

module.exports=router