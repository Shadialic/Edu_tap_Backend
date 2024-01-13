const UserDb = require("../models/userModel");
const TutorDb=require('../models/tutorModel')
const bycrypt=require('bcrypt');
const jwt = require("jsonwebtoken");

const loadloagin=async (req,res)=>{
    try{
        const {credential,password}=req.body;
        console.log(req.body,'eq.body');
        const exist=await UserDb.findOne({email:credential});
        console.log(exist,'exist');
        if(exist){
            if(exist.is_admin){
                const compared=await bycrypt.hash(password,exist.password);
                if(compared){
                    const admintoken=jwt.sign({
                        adminId:exist._id},
                        process.env.JWT_SECRET_KEY,{
                            expiresIn:'1h'
                        }
                    );
                    res.json({loginData:exist,status:true,admintoken})
                }else{
                    res.json({alert:'Enterd email is wrong!'})
                }
            }else{
                res.json({alert:"Not valid admin"})
            }
        }else{
            res.json({alert:'Email is not existing'})
        }
    }catch(err){
        console.log(err);
    }
}

const loaduser=async(req,res)=>{
    try{
        const userdata = await UserDb.find({ is_admin: false });
        if (userdata) {
          res.json({ userdata, status: true });
        } else {
          res.json({ userdata, status: false });
        }

    }catch(err){
        console.log(err);
    }
}

const loadtutor=async(req,res)=>{
    try{
        const tutordata = await TutorDb.find();
        if (tutordata) {
          res.json({ tutordata, status: true });
        } else {
          res.json({ tutordata, status: false });
        }

    }catch(err){
        console.log(err);
    }
}

const blockuser=async(req,res)=>{
    try{
        let id=req.body._id
        console.log(id,'id');
      const newData=await UserDb.updateOne({_id:id},{$set:{is_Active:false}})
      res.json({
        newData,
        status:true,
        alert:'User Bloked'
      })


    }catch(err){
        console.log(err);
    }
}
module.exports={
    loadloagin,
    loaduser,
    loadtutor,
    blockuser
}