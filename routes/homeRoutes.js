const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/testimonials', (req, res) => {
    res.render('testimonials');
});

router.get('/courses', (req, res) => {
    res.render('courses');
});

module.exports = router; 