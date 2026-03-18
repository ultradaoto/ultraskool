const express = require('express');
const router = express.Router();

const {
    createPost,
    generateExcerpt,
    generateSlug,
    generateUniqueSlug,
    readPosts,
    writePosts
} = require('../../lib/posts');

const BASE_URL = process.env.BASE_URL || 'https://ultraskool.com';
const DEFAULT_ALLOWED_ORIGINS = [
    'https://clickup.sterlingcooley.com'
];
const allowedOrigins = (
    process.env.BLOG_API_ALLOWED_ORIGINS
        ? process.env.BLOG_API_ALLOWED_ORIGINS.split(',')
        : DEFAULT_ALLOWED_ORIGINS
).map((origin) => origin.trim()).filter(Boolean);
const apiKey = process.env.BLOG_API_KEY || '';

function applyCors(req, res) {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
    }

    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Blog-Api-Key');
}

function getProvidedApiKey(req) {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7).trim()
        : '';

    return req.headers['x-blog-api-key'] || bearerToken;
}

function requireApiKey(req, res, next) {
    if (!apiKey) {
        return next();
    }

    if (getProvidedApiKey(req) !== apiKey) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Provide a valid API key.'
        });
    }

    return next();
}

router.use((req, res, next) => {
    applyCors(req, res);

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    return next();
});

router.post('/publish', requireApiKey, (req, res) => {
    const blogData = req.body.blogData || req.body;
    const posts = readPosts();

    if (!blogData.title || !blogData.content) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: title and content are required.'
        });
    }

    const existingIndex = blogData.blog_post_id
        ? posts.findIndex((post) => post.id === blogData.blog_post_id)
        : -1;

    if (blogData.blog_post_id && existingIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Post not found.'
        });
    }

    const existingPost = existingIndex >= 0 ? posts[existingIndex] : null;
    const requestedSlug = generateSlug(blogData.existing_slug || blogData.slug || blogData.title);
    const finalSlug = generateUniqueSlug(requestedSlug, posts, existingPost?.id);

    const nextPost = createPost({
        ...blogData,
        slug: finalSlug,
        excerpt: blogData.excerpt || generateExcerpt(blogData.content),
        meta_title: blogData.meta_title || blogData.title,
        meta_description: blogData.meta_description || generateExcerpt(blogData.content),
        author: blogData.author || blogData.author_email || existingPost?.author || 'Ultra Skool',
        status: blogData.status || 'published',
        published: blogData.status ? blogData.status === 'published' : true
    }, existingPost);

    if (existingIndex >= 0) {
        if (blogData.preserve_date) {
            nextPost.createdAt = existingPost.createdAt;
        }
        posts[existingIndex] = nextPost;
    } else {
        posts.push(nextPost);
    }

    if (!writePosts(posts)) {
        return res.status(500).json({
            success: false,
            message: 'Failed to save blog post.'
        });
    }

    return res.status(existingIndex >= 0 ? 200 : 201).json({
        success: true,
        message: 'Blog post published successfully',
        post: {
            id: nextPost.id,
            title: nextPost.title,
            slug: nextPost.slug,
            url: `${BASE_URL}/blog/${nextPost.slug}`,
            featured_image: nextPost.featured_image || null
        }
    });
});

router.delete('/posts/:postId', requireApiKey, (req, res) => {
    const posts = readPosts();
    const filteredPosts = posts.filter((post) => post.id !== req.params.postId);

    if (filteredPosts.length === posts.length) {
        return res.status(404).json({
            success: false,
            message: 'Post not found.'
        });
    }

    if (!writePosts(filteredPosts)) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete post.'
        });
    }

    return res.json({
        success: true,
        message: 'Post deleted successfully.'
    });
});

router.get('/destinations', (req, res) => {
    res.json({
        destinations: [
            {
                id: 'ultraskool-blog',
                name: 'Ultra Skool Blog',
                url: `${BASE_URL}/blog`,
                categories: [
                    { name: 'Consciousness Engineering', slug: 'consciousness-engineering' },
                    { name: 'Ultra Breath', slug: 'ultra-breath' },
                    { name: 'Quantum Biology', slug: 'quantum-biology' },
                    { name: 'Ultrasound Research', slug: 'ultrasound-research' }
                ]
            }
        ]
    });
});

module.exports = router;
