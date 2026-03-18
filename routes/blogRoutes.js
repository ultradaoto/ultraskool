const express = require('express');
const router = express.Router();
const { collectTags, readPosts } = require('../lib/posts');

// GET /blog - List all published posts
router.get('/blog', (req, res) => {
    const posts = readPosts();
    const publishedPosts = posts
        .filter(post => post.published)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.render('blog/index', {
        title: 'Blog - Ultra Skool',
        description: 'Explore articles on ultra breath, microtubules, consciousness engineering, and quantum biology.',
        imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
        currentUrl: 'https://ultraskool.com/blog',
        posts: publishedPosts,
        tags: collectTags(posts)
    });
});

// GET /blog/:slug - Single post page
router.get('/blog/:slug', (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.slug === req.params.slug && p.published);
    
    if (!post) {
        return res.status(404).render('404', {
            title: 'Post Not Found - Ultra Skool',
            description: 'The requested blog post could not be found.',
            imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
            currentUrl: `https://ultraskool.com/blog/${req.params.slug}`
        });
    }
    
    // Get related posts (same tags, excluding current)
    const relatedPosts = posts
        .filter(p => p.published && p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
        .slice(0, 3);
    
    res.render('blog/post', {
        title: `${post.title} - Ultra Skool Blog`,
        description: post.excerpt,
        imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
        currentUrl: `https://ultraskool.com/blog/${post.slug}`,
        post: post,
        relatedPosts: relatedPosts
    });
});

// GET /blog/tag/:tag - Filter posts by tag
router.get('/blog/tag/:tag', (req, res) => {
    const posts = readPosts();
    const tag = req.params.tag;
    
    const filteredPosts = posts
        .filter(post => post.published && post.tags.includes(tag))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.render('blog/index', {
        title: `Posts tagged "${tag}" - Ultra Skool Blog`,
        description: `Browse all articles tagged with "${tag}" on ultra breath, microtubules, and consciousness engineering.`,
        imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
        currentUrl: `https://ultraskool.com/blog/tag/${tag}`,
        posts: filteredPosts,
        tags: collectTags(posts),
        currentTag: tag
    });
});

module.exports = router;
