const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', async(req,res)=>{
    try{
        const postData = await Post.findAll();
        res.json(postData);
    }catch(err){
        res.json({message:err.message})
    }
});

router.get('/:id', async(req,res)=>{
    try{
        const postsData = await Post.findByPk(req.params.id);
        res.json(postsData);
    }catch(err){
        res.json({message:err.message})
    }
})

router.post('/',withAuth, async(req,res)=>{
    try{
        const postData = await Post.create({
            title:req.body.title,
            body:req.body.body,
            user_id: req.session.user_id
        });
        res.status(201).json(postData);
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.put('/:id',withAuth, async(req,res)=>{
    try{
        const update =  await Post.update(req.body, {
            where:{
                id:req.params.id,
                user_id:req.session.user_id
            }
        });
        if (!update){
            return res.status(401).json({message:"no post exist"})
        }
        return res.json(update);
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.delete('/:id',withAuth, async(req,res)=>{
    try{
        const deleteData = await Post.destroy({where:{id:req.params.id, UserId:req.session.user_id}})
        res.json(deleteData)
    }catch(err){
        res.json({message:err.message})
    }
})

module.exports = router;