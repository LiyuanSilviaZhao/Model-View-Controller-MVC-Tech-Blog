const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', async(req,res)=>{
    try{
        const commentData = await Comment.findAll();
        res.json(commentData);
    }catch(err){
        res.json({message:err.message})
    }
});

router.get('/:id', async(req,res)=>{
    try{
        const commentsData = await Comment.findByPk(req.params.id);
        res.json(commentsData);
    }catch(err){
        res.json({message:err.message})
    }
})

router.post('/',withAuth, async(req,res)=>{
    try{
        const commentData = await Comment.create({
            body:req.body.body,
            user_id: req.session.user_id,
            post_id: req.params.id
        });
        res.json(commentData);
    }catch(err){
        res.json({message:err.message})
    }
})

router.delete('/:id', withAuth, async(req,res)=>{
    try{
        const delData = await Comment.destroy({where:{id:req.params.id}})
        res.json(delData)
    }catch(err){
        res.json({message:err.message})
    }
})

module.exports = router;