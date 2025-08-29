import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // Mock blog post data - replace with API call
    const mockPost = {
      id: parseInt(id),
      title: 'The Future of Mobile App Development in 2024',
      content: `
        <p>Mobile app development continues to evolve at a rapid pace, with new technologies and frameworks emerging regularly. As we move through 2024, several key trends are shaping the future of mobile development.</p>
        
        <h2>1. Cross-Platform Development Dominance</h2>
        <p>Cross-platform frameworks like React Native and Flutter are becoming increasingly popular among developers and businesses alike. These frameworks allow developers to write code once and deploy it across multiple platforms, significantly reducing development time and costs.</p>
        
        <h2>2. AI and Machine Learning Integration</h2>
        <p>Artificial Intelligence and Machine Learning are no longer just buzzwords in mobile development. From personalized user experiences to predictive analytics, AI is becoming an integral part of modern mobile applications.</p>
        
        <h2>3. 5G Technology Impact</h2>
        <p>The widespread adoption of 5G networks is opening up new possibilities for mobile applications. Faster data speeds and lower latency are enabling more sophisticated features and real-time interactions.</p>
        
        <h2>4. Enhanced Security Measures</h2>
        <p>With increasing concerns about data privacy and security, mobile app developers are implementing more robust security measures, including biometric authentication and end-to-end encryption.</p>
        
        <h2>Conclusion</h2>
        <p>The future of mobile app development looks promising, with exciting technologies and frameworks continuing to emerge. Developers who stay updated with these trends will be well-positioned to create innovative and successful mobile applications.</p>
      `,
      author: 'John Smith',
      date: '2024-01-15',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
      category: 'Technology',
      readTime: '5 min read',
      tags: ['Mobile Development', 'Technology', 'Trends', '2024']
    };
    
    setPost(mockPost);

    // Mock related posts
    const mockRelatedPosts = [
      {
        id: 2,
        title: 'React Native vs Flutter: Which Should You Choose?',
        excerpt: 'A comprehensive comparison of the two leading cross-platform development frameworks.',
        image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
        date: '2024-01-12'
      },
      {
        id: 3,
        title: 'Building Scalable E-commerce Mobile Apps',
        excerpt: 'Best practices for creating mobile commerce applications that can handle growth.',
        image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg',
        date: '2024-01-10'
      }
    ];
    
    setRelatedPosts(mockRelatedPosts);
  }, [id]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (!post) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden mb-8">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          
          <div className="p-8">
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/30 mr-4">
                {post.category}
              </span>
              <User className="h-4 w-4 mr-1" />
              <span className="mr-4">{post.author}</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">{new Date(post.date).toLocaleDateString()}</span>
              <span>{post.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {post.title}
            </h1>
            
            {/* Share Buttons */}
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-white/10">
              <span className="text-gray-400 text-sm">Share:</span>
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-lg transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 bg-blue-700/20 hover:bg-blue-700/30 text-blue-400 rounded-lg transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </button>
            </div>
            
            {/* Article Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                color: '#d1d5db',
                lineHeight: '1.8'
              }}
            />
            
            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-white font-semibold mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-lg border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="flex bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
                >
                  <img 
                    src={relatedPost.image} 
                    alt={relatedPost.title}
                    className="w-24 h-24 object-cover flex-shrink-0"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="text-white font-medium mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(relatedPost.date).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;