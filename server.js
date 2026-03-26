const express = require('express');
const path = require('path');
const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

const blogRoutes = require('./routes/blogRoutes');
app.use('/', blogRoutes);

const blogAdminRoutes = require('./routes/blogAdminRoutes');
app.use('/', blogAdminRoutes);

const blogApiRoutes = require('./routes/api/blogApi');
app.use('/api/blog', blogApiRoutes);

// Tracking proxy - bypasses Safari ITP by making tracking first-party
app.post('/api/tracking/collect', async (req, res) => {
    try {
        const upstream = await fetch('https://ulxcore.com/api/tracking/collect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const data = await upstream.json();
        res.status(upstream.status).json(data);
    } catch (err) {
        res.json({ success: false });
    }
});

// Unsubscribe proxy — branded unsubscribe page on ultraskool.com
app.get('/api/unsubscribe/:token', async (req, res) => {
    try {
        const upstream = await fetch(`https://email.sterlingcooley.com/api/unsubscribe/${req.params.token}`, {
            headers: { 'User-Agent': req.get('User-Agent') || '' }
        });
        if (upstream.ok) {
            return res.render('unsubscribe', { success: true });
        }
        return res.status(upstream.status).render('unsubscribe', {
            success: false,
            error: 'This unsubscribe link may have expired or already been used.'
        });
    } catch (err) {
        return res.status(500).render('unsubscribe', {
            success: false,
            error: 'Unable to connect to our email service. Please try again later.'
        });
    }
});

app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found | Ultra Skool',
        description: "The page you're looking for doesn't exist in our quantum realm.",
        imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
        currentUrl: req.originalUrl
    });
});

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
