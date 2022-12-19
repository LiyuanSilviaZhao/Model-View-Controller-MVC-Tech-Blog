// const express = require('express');
// const router = express.Router();
// const { Post, User, Comment } = require('../../models');
// const withAuth = require('../../utils/auth');


// router.get('/', async(req,res)=>{
//     try{
//         const commentData = await Comment.findAll();
//         res.json(commentData);
//     }catch(err){
//         res.json({message:err.message})
//     }
// });

// router.get('/:id', async(req,res)=>{
//     try{
//         const commentsData = await Comment.findByPk(req.params.id);
//         res.json(commentsData);
//     }catch(err){
//         res.json({message:err.message})
//     }
// })

// router.post('/',withAuth, async(req,res)=>{
//     try{
//         const commentData = await Comment.create({
//             body:req.body.body,
//             user_id: req.session.user_id,
//             post_id: req.params.id
//         });
//         res.json(commentData);
//     }catch(err){
//         res.json({message:err.message})
//     }
// })

// router.delete('/:id', withAuth, async(req,res)=>{
//     try{
//         const delData = await Comment.destroy({where:{id:req.params.id}})
//         res.json(delData)
//     }catch(err){
//         res.json({message:err.message})
//     }
// })

// module.exports = router;

const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
router.get('/', (req, res) => {
    Comment.findAll({})
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.get('/:id', (req, res) => {
    Comment.findAll({
            where: {
                id: req.params.id
            }
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comment.create({
                comment_text: req.body.comment_text,
                post_id: req.body.post_id,
                user_id: req.session.user_id,
            })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    }
});

router.put('/:id', withAuth, (req, res) => {
    Comment.update({
        comment_text: req.body.comment_text
    }, {
        where: {
            id: req.params.id
        }
    }).then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(dbCommentData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(dbCommentData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
module.exports = router;