const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../../models');


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

router.post('/', async(req,res)=>{
    if (!req.session.activeUser){
        return res.redirect('/login')
    }
    try{
        const postData = await Post.create({
            title:req.body.title,
            body:req.body.body,
            UserId: req.session.activeUser.id
        });
        res.status(201).json(postData);
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

router.put('/:id', async(req,res)=>{
    if (!req.session.activeUser){
        return res.redirect('/login')
    }
    try{
        const update =  await Post.update(req.body, {
            where:{
                id:req.params.id,
                UserId:req.session.activeUser.id
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

router.delete('/:id', async(req,res)=>{
    if (!req.session.activeUser){
        return res.status(401).json({message: "not logged in"});
    }
    try{
        const deleteData = await Post.destroy({where:{id:req.params.id, UserId:req.session.activeUser.id}})
        res.json(deleteData)
    }catch(err){
        res.json({message:err.message})
    }
})

module.exports = router;