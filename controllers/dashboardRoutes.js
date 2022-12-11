const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require("../utils/auth");


// get all posts for dashboard
router.get('/', withAuth,(req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        include: [User, {
            model: Comment,
            include: User,
        }],
    })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true, username: req.session.username });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: { id: req.params.id },
        include: [User, {
            model: Comment,
            include: User,
        }],
    })
        .then(dbPostData => {
            if (dbPostData) {
                const post = dbPostData.get({ plain: true });

                res.render('edit-post', {
                    post,
                    loggedIn: true,
                    username: req.session.username
                });
            } else {
                res.status(404).end();
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.get('/new', withAuth, (req,res)=>{
    res.render('create-post');
})


module.exports = router;