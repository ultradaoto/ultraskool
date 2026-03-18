const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '..', 'data');
const postsFilePath = path.join(dataDir, 'posts.json');

function ensureStorage() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(postsFilePath)) {
        fs.writeFileSync(postsFilePath, '[]', 'utf8');
    }
}

function readPosts() {
    ensureStorage();

    try {
        const data = fs.readFileSync(postsFilePath, 'utf8');
        const posts = JSON.parse(data);
        return Array.isArray(posts) ? posts : [];
    } catch (error) {
        console.error('Error reading blog posts:', error);
        return [];
    }
}

function writePosts(posts) {
    ensureStorage();

    try {
        fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving blog posts:', error);
        return false;
    }
}

function generateSlug(title = '') {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 70) || 'untitled-post';
}

function generateUniqueSlug(baseSlug, posts, ignorePostId) {
    const normalizedBase = baseSlug || 'untitled-post';
    let candidate = normalizedBase;
    let suffix = 2;

    while (posts.some((post) => post.slug === candidate && post.id !== ignorePostId)) {
        candidate = `${normalizedBase}-${suffix}`;
        suffix += 1;
    }

    return candidate;
}

function stripHtml(html = '') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function generateExcerpt(content = '', fallback = '') {
    const text = stripHtml(content || fallback);
    if (!text) return '';
    return text.length > 200 ? `${text.substring(0, 200).trim()}...` : text;
}

function calculateReadTime(content = '') {
    const wordCount = stripHtml(content).split(/\s+/).filter(Boolean).length;
    return wordCount > 0 ? Math.ceil(wordCount / 200) : 1;
}

function normalizeTags(tags) {
    if (Array.isArray(tags)) {
        return tags
            .map((tag) => String(tag).trim().toLowerCase())
            .filter(Boolean);
    }

    if (typeof tags === 'string') {
        return tags
            .split(',')
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);
    }

    return [];
}

function collectTags(posts) {
    return [...new Set(posts.flatMap((post) => Array.isArray(post.tags) ? post.tags : []))].sort();
}

function createPost(input, existingPost) {
    const now = new Date().toISOString();
    const baseSlug = generateSlug(input.existing_slug || input.slug || input.title || existingPost?.title || '');

    return {
        id: existingPost?.id || input.blog_post_id || crypto.randomUUID(),
        slug: baseSlug,
        title: (input.title || existingPost?.title || 'Untitled Post').trim(),
        subtitle: (input.subtitle || existingPost?.subtitle || '').trim(),
        excerpt: (input.excerpt || '').trim(),
        content: input.content || existingPost?.content || '',
        featured_image: (input.featured_image || existingPost?.featured_image || '').trim(),
        meta_title: (input.meta_title || '').trim(),
        meta_description: (input.meta_description || '').trim(),
        author: (input.author || input.author_email || existingPost?.author || 'Ultra Skool').trim(),
        tags: normalizeTags(input.tags ?? existingPost?.tags),
        published: input.status ? input.status === 'published' : Boolean(input.published ?? existingPost?.published),
        read_time_minutes: calculateReadTime(input.content || existingPost?.content || ''),
        createdAt: existingPost?.createdAt || now,
        updatedAt: now,
        socialLinks: {
            twitter: (input.twitter || input.socialLinks?.twitter || existingPost?.socialLinks?.twitter || '').trim(),
            youtube: (input.youtube || input.socialLinks?.youtube || existingPost?.socialLinks?.youtube || '').trim()
        }
    };
}

module.exports = {
    postsFilePath,
    readPosts,
    writePosts,
    generateSlug,
    generateUniqueSlug,
    generateExcerpt,
    calculateReadTime,
    normalizeTags,
    collectTags,
    createPost
};
