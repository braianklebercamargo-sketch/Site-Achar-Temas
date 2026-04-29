import fs from 'fs';
import path from 'path';
import https from 'https';

const categories = JSON.parse(fs.readFileSync('./src/data/categories.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('./src/data/posts.json', 'utf8'));
const comments = JSON.parse(fs.readFileSync('./src/data/comments.json', 'utf8'));

// Generate WXR (WordPress eXtended RSS)
let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
  <title>Achar Temas Export</title>
  <link>https://achartemas.com</link>
  <description>Exported from JSON</description>
  <pubDate>Thu, 01 Jan 2026 00:00:00 +0000</pubDate>
  <language>pt-BR</language>
  <wp:wxr_version>1.2</wp:wxr_version>
`;

categories.forEach(cat => {
  xml += `
  <wp:category>
    <wp:term_id>${cat.id}</wp:term_id>
    <wp:category_nicename>${cat.slug}</wp:category_nicename>
    <wp:category_parent></wp:category_parent>
    <wp:cat_name><![CDATA[${cat.name}]]></wp:cat_name>
  </wp:category>`;
});

posts.forEach(post => {
  xml += `
  <item>
    <title><![CDATA[${post.title.rendered}]]></title>
    <link>https://achartemas.com/?p=${post.id}</link>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <dc:creator><![CDATA[admin]]></dc:creator>
    <guid isPermaLink="false">https://achartemas.com/?p=${post.id}</guid>
    <description></description>
    <content:encoded><![CDATA[${post.content.rendered}]]></content:encoded>
    <excerpt:encoded><![CDATA[${post.excerpt.rendered}]]></excerpt:encoded>
    <wp:post_id>${post.id}</wp:post_id>
    <wp:post_date><![CDATA[${post.date.replace('T', ' ')}]]></wp:post_date>
    <wp:post_date_gmt><![CDATA[${post.date.replace('T', ' ')}]]></wp:post_date_gmt>
    <wp:post_type><![CDATA[post]]></wp:post_type>
    <wp:status><![CDATA[publish]]></wp:status>
  `;

  // categories
  post.categories.forEach(catId => {
    const cat = categories.find(c => c.id === catId);
    if(cat) {
      xml += `    <category domain="category" nicename="${cat.slug}"><![CDATA[${cat.name}]]></category>\n`;
    }
  });

  // comments
  const postComments = comments.filter(c => c.post === post.id);
  postComments.forEach(comment => {
    xml += `
    <wp:comment>
      <wp:comment_id>${comment.id}</wp:comment_id>
      <wp:comment_author><![CDATA[${comment.author_name}]]></wp:comment_author>
      <wp:comment_author_email></wp:comment_author_email>
      <wp:comment_author_url></wp:comment_author_url>
      <wp:comment_author_IP></wp:comment_author_IP>
      <wp:comment_date><![CDATA[${comment.date.replace('T', ' ')}]]></wp:comment_date>
      <wp:comment_date_gmt><![CDATA[${comment.date.replace('T', ' ')}]]></wp:comment_date_gmt>
      <wp:comment_content><![CDATA[${comment.content.rendered}]]></wp:comment_content>
      <wp:comment_approved><![CDATA[1]]></wp:comment_approved>
      <wp:comment_type><![CDATA[comment]]></wp:comment_type>
      <wp:comment_parent>0</wp:comment_parent>
    </wp:comment>`;
  });

  xml += `
  </item>`;
});

xml += `
</channel>
</rss>`;

fs.writeFileSync('wp_export.xml', xml);
console.log('Saved wp_export.xml');
