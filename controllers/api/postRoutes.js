// const express = require('express');
// const router = express.Router();
// const { Post, User, Comment } = require('../../models');
// const withAuth = require('../../utils/auth');


// router.get('/', async(req,res)=>{
//     try{
//         const postData = await Post.findAll();
//         res.json(postData);
//     }catch(err){
//         res.json({message:err.message})
//     }
// });

// router.get('/:id', async(req,res)=>{
//     try{
//         const postsData = await Post.findByPk(req.params.id);
//         res.json(postsData);
//     }catch(err){
//         res.json({message:err.message})
//     }
// })

// router.post('/',withAuth, async(req,res)=>{
//     try{
//         const postData = await Post.create({
//             title:req.body.title,
//             body:req.body.body,
//             user_id: req.session.user_id
//         });
//         res.status(201).json(postData);
//     }catch(err){
//         res.status(500).json({message:err.message})
//     }
// })

// router.put('/:id',withAuth, async(req,res)=>{
//     try{
//         const update =  await Post.update(req.body, {
//             where:{
//                 id:req.params.id,
//                 user_id:req.session.user_id
//             }
//         });
//         if (!update){
//             return res.status(401).json({message:"no post exist"})
//         }
//         return res.json(update);
//     }catch(err){
//         res.status(500).json({message:err.message})
//     }
// })

// router.delete('/:id',withAuth, async(req,res)=>{
//     try{
//         const deleteData = await Post.destroy({where:{id:req.params.id, UserId:req.session.user_id}})
//         res.json(deleteData)
//     }catch(err){
//         res.json({message:err.message})
//     }
// })

// module.exports = router;

const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
            attributes: ['id',
                'title',
                'content',
                'created_at'
            ],
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        })
        .then(dbPostData => res.json(dbPostData.reverse()))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});
router.get('/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
                'content',
                'title',
                'created_at'
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', withAuth, (req, res) => {
    Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update({
            title: req.body.title,
            content: req.body.content
        }, {
            where: {
                id: req.params.id
            }
        }).then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;