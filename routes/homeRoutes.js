const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', {
        title: "Vagus Skool - Ultra Breath Experience",
        description: "Discover the ancient wisdom of Ultra Breath and unlock the healing power of your vagus nerve through revolutionary techniques combining ultrasound-enhanced stimulation with ancient Tummo breathing practices.",
        imageUrl: "https://vagusskool.com/images/preview-image.jpg",
        currentUrl: "https://vagusskool.com"
    });
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