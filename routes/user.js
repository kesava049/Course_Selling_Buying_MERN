const { Router } = require("express");
const jwt = require("jsonwebtoken");
const router = Router();
const userMiddleware = require("../middleware/user");
const {JWT_SECRET} = require("../config");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username,
        password
    })
    res.status(200).json({
        msg : "User successfully Created!!"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({
        username,
        password
    })
    if(!user){
        res.status(411).json({
            msg:"Incorrect email or pass"
        })
    }else{
        const token = jwt.sign({
            username
        },JWT_SECRET);

        res.json({
            token
        })
    }
});

router.get('/courses', async (req, res) => {
    const response = await Course.find({})
    res.json({
        courses: response
    })
});

router.post('/courses/:courseId', async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    await User.updateOne({
        username : username
    },{
        '$push': {
            purchasedCourses: courseId
        }
    })
    res.json({
        msg: "Purchase Complete!"
    })
});

router.get('/purchasedCourses', async(req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    })
    const courses = await Course.find({
        _id: {
            '$in': user.purchasedCourses
        }
    });
    res.json({
        courses: courses
    })
});

module.exports = router