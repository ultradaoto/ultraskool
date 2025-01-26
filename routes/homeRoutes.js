const express = require('express');
const router = express.Router();

// Redirect /live to home page
router.get('/live', (req, res) => {
    res.redirect('/');
});

router.get('/', (req, res) => {
    res.render('home', {
        title: "Ultra Skool - Ultra Breath Experience",
        description: "Discover the ancient wisdom of Ultra Breath and unlock the healing power of your Microtubules through revolutionary techniques combining ultrasound-enhanced stimulation with ancient Tummo breathing practices.",
        imageUrl: "https://ultraskool.com/images/preview-image.jpg",
        currentUrl: "https://ultraskool.com"
    });
});

router.get('/about', (req, res) => {
    res.render('about', {
        title: "About Ultra Skool - Our Mission & Vision",
        description: "Learn how Vagus Skool is revolutionizing vagus nerve stimulation through accessible, clear, and effective methods. Join our community of practitioners and discover the healing power of VNS.",
        imageUrl: "https://ultraskool.com/images/preview-image.jpg",
        currentUrl: "https://ultraskool.com/about"
    });
});

router.get('/testimonials', (req, res) => {
    res.render('testimonials', {
        title: "Ultra Skool Success Stories - Transformative Experiences",
        description: "Read and watch real testimonials from people who have transformed their lives through Vagus Skool's revolutionary vagus nerve stimulation techniques and breathing practices.",
        imageUrl: "https://ultraskool.com/images/preview-image.jpg",
        currentUrl: "https://ultraskool.com/testimonials"
    });
});

router.get('/courses', (req, res) => {
    res.render('courses', {
        title: "Ultra Skool Courses - Comprehensive Learning Paths",
        description: "Explore our comprehensive course catalog covering everything from basic vagus nerve stimulation to advanced techniques in breathing, ultrasound therapy, and electrical stimulation.",
        imageUrl: "https://ultraskool.com/images/preview-image.jpg",
        currentUrl: "https://ultraskool.com/courses"
    });
});

router.get('/join', (req, res) => {
    res.render('join', {
        title: "Ultra Microtubule Workshop - Join Us Live!",
        description: "Join the Ultra Skool for Live Ultrasound Stimulation Workshop. Experience live guidance and community practice in our interactive Zoom session.",
        imageUrl: "https://ultraskool.com/images/preview-image.jpg",
        currentUrl: "https://ultraskool.com/join"
    });
});

// 404 page - This should be the last route
router.use((req, res) => {
    res.status(404).render('404', {
        title: "404 - Page Not Found | Ultra Skool",
        description: "The page you're looking for doesn't exist in our quantum realm.",
        imageUrl: "https://ultraskool.com/images/preview-image.jpg",
        currentUrl: req.originalUrl
    });
});

module.exports = router; 