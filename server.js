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
        const html = await upstream.text();
        if (upstream.ok) {
            return res.type('html').send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Unsubscribed — Ultra Skool</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f0fdf4}.box{background:#fff;padding:40px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1);text-align:center;max-width:420px}h1{color:#16a34a;margin-bottom:16px}p{color:#666;line-height:1.6}a{color:#4f46e5;text-decoration:none}a:hover{text-decoration:underline}</style></head><body><div class="box"><h1>✅ You're Unsubscribed</h1><p>You've been removed from the Ultra Skool mailing list.</p><p>You will no longer receive emails from us.</p><p style="margin-top:24px;font-size:14px"><a href="https://ultraskool.com">← Back to Ultra Skool</a></p></div></body></html>`);
        }
        return res.status(upstream.status).type('html').send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Unsubscribe Error</title><style>body{font-family:system-ui,-apple-system,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#fef2f2}.box{background:#fff;padding:40px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1);text-align:center;max-width:420px}h1{color:#dc2626;margin-bottom:16px}p{color:#666;line-height:1.6}a{color:#4f46e5;text-decoration:none}</style></head><body><div class="box"><h1>⚠️ Something went wrong</h1><p>This unsubscribe link may have expired or already been used.</p><p><a href="mailto:support@ultraskool.com">Contact support</a> if you need help.</p></div></body></html>`);
    } catch (err) {
        return res.status(500).type('html').send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unsubscribe Error</title><style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#fef2f2}.box{background:#fff;padding:40px;border-radius:8px;text-align:center;max-width:420px}h1{color:#dc2626}p{color:#666}</style></head><body><div class="box"><h1>⚠️ Connection Error</h1><p>Unable to process your request. Please try again later.</p></div></body></html>`);
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
