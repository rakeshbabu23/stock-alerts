const userServcie=require('../services/user.service');

const createUser=async(req,res)=>{
    try{
        const userData=req.body;
        const newUser=await userServcie.createUser(userData);
        res.status(201).json({user:newUser});
    }
    catch(err){
        res.status(500).json({error:'Internal Server Error'});
    }
}

module.exports={createUser};