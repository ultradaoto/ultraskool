const express = require('express');
const router = express.Router();
const {
    createPost,
    generateExcerpt,
    generateSlug,
    generateUniqueSlug,
    readPosts,
    writePosts
} = require('../lib/posts');

// GET /admin/blog - List all posts (published + drafts)
router.get('/admin/blog', (req, res) => {
    const posts = readPosts();
    const sortedPosts = posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.render('blog/admin', {
        title: 'Blog Admin - Ultra Skool',
        description: 'Manage blog posts and content.',
        imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
        currentUrl: 'https://ultraskool.com/admin/blog',
        posts: sortedPosts
    });
});

// GET /admin/blog/new - Form to create new post
router.get('/admin/blog/new', (req, res) => {
    res.render('blog/editor', {
        title: 'New Post - Blog Admin',
        description: 'Create a new blog post.',
        imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
        currentUrl: 'https://ultraskool.com/admin/blog/new',
        post: null,
        isNew: true
    });
});

// POST /admin/blog/new - Create post
router.post('/admin/blog/new', (req, res) => {
    const { title, slug, excerpt, content, author, tags, published, twitter, youtube } = req.body;
    
    const posts = readPosts();
    const requestedSlug = slug?.trim() || generateSlug(title);
    const newPost = createPost({
        title,
        slug: generateUniqueSlug(requestedSlug, posts),
        excerpt: excerpt?.trim() || generateExcerpt(content),
        content,
        author,
        tags,
        published: published === 'on',
        twitter,
        youtube,
        status: published === 'on' ? 'published' : 'draft'
    });

    posts.push(newPost);

    if (writePosts(posts)) {
        res.redirect('/admin/blog');
    } else {
        res.status(500).render('blog/editor', {
            title: 'New Post - Blog Admin',
            description: 'Create a new blog post.',
            imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
            currentUrl: 'https://ultraskool.com/admin/blog/new',
            post: req.body,
            isNew: true,
            error: 'Failed to save post. Please try again.'
        });
    }
});

// GET /admin/blog/edit/:id - Edit form pre-filled
router.get('/admin/blog/edit/:id', (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === req.params.id);
    
    if (!post) {
        return res.status(404).redirect('/admin/blog');
    }
    
    res.render('blog/editor', {
        title: 'Edit Post - Blog Admin',
        description: 'Edit blog post.',
        imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
        currentUrl: `https://ultraskool.com/admin/blog/edit/${post.id}`,
        post: post,
        isNew: false
    });
});

// POST /admin/blog/edit/:id - Update post
router.post('/admin/blog/edit/:id', (req, res) => {
    const { title, slug, excerpt, content, author, tags, published, twitter, youtube } = req.body;
    
    const posts = readPosts();
    const postIndex = posts.findIndex(p => p.id === req.params.id);
    
    if (postIndex === -1) {
        return res.status(404).redirect('/admin/blog');
    }
    
    const existingPost = posts[postIndex];
    const requestedSlug = slug?.trim() || existingPost.slug || generateSlug(title);
    posts[postIndex] = createPost({
        ...req.body,
        slug: generateUniqueSlug(requestedSlug, posts, req.params.id),
        excerpt: excerpt?.trim() || generateExcerpt(content, existingPost.excerpt),
        published: published === 'on',
        status: published === 'on' ? 'published' : 'draft'
    }, existingPost);

    if (writePosts(posts)) {
        res.redirect('/admin/blog');
    } else {
        res.status(500).render('blog/editor', {
            title: 'Edit Post - Blog Admin',
            description: 'Edit blog post.',
            imageUrl: 'https://ultraskool.com/images/preview-image.jpg',
            currentUrl: `https://ultraskool.com/admin/blog/edit/${req.params.id}`,
            post: { ...req.body, id: req.params.id },
            isNew: false,
            error: 'Failed to save post. Please try again.'
        });
    }
});

// POST /admin/blog/delete/:id - Delete post
router.post('/admin/blog/delete/:id', (req, res) => {
    const posts = readPosts();
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    
    if (filteredPosts.length === posts.length) {
        return res.status(404).redirect('/admin/blog');
    }
    
    if (writePosts(filteredPosts)) {
        res.redirect('/admin/blog');
    } else {
        res.status(500).send('Failed to delete post');
    }
});

module.exports = router;
