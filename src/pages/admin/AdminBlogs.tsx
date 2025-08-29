import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/AdminLayout';

const AdminBlogs = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Mock blog posts data
    const mockBlogs = [
      {
        id: 1,
        title: 'The Future of Mobile App Development in 2024',
        excerpt: 'Explore the latest trends and technologies shaping mobile app development this year.',
        content: 'Full blog post content here...',
        author: 'John Smith',
        date: '2024-01-15',
        image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
        category: 'Technology',
        status: 'published',
        readTime: '5 min read'
      },
      {
        id: 2,
        title: 'React Native vs Flutter: Which Should You Choose?',
        excerpt: 'A comprehensive comparison of the two leading cross-platform development frameworks.',
        content: 'Full blog post content here...',
        author: 'Sarah Johnson',
        date: '2024-01-12',
        image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
        category: 'Development',
        status: 'published',
        readTime: '8 min read'
      },
      {
        id: 3,
        title: 'Building Scalable E-commerce Mobile Apps',
        excerpt: 'Best practices for creating mobile commerce applications that can handle growth.',
        content: 'Full blog post content here...',
        author: 'Mike Davis',
        date: '2024-01-10',
        image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg',
        category: 'E-commerce',
        status: 'draft',
        readTime: '6 min read'
      }
    ];

    setBlogs(mockBlogs);
  }, [isAuthenticated, navigate]);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDelete = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(prev => prev.filter(b => b.id !== blogId));
    }
  };

  const handleAddNew = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
            <p className="text-gray-400">Create and manage your blog posts</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Post
          </button>
        </div>

        {/* Search */}
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Post</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Author</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-white font-medium">{blog.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-1">{blog.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{blog.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{blog.author}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{new Date(blog.date).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      blog.status === 'published' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`/blog/${blog.id}`, '_blank')}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No blog posts found.</p>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      {showModal && (
        <BlogModal
          blog={editingBlog}
          onClose={() => setShowModal(false)}
          onSave={(blogData) => {
            if (editingBlog) {
              setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...blogData } : b));
            } else {
              const newBlog = {
                id: Date.now(),
                ...blogData,
                date: new Date().toISOString().split('T')[0]
              };
              setBlogs(prev => [...prev, newBlog]);
            }
            setShowModal(false);
          }}
        />
      )}
    </AdminLayout>
  );
};

const BlogModal = ({ blog, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    author: blog?.author || '',
    category: blog?.category || 'Technology',
    image: blog?.image || '',
    status: blog?.status || 'draft',
    readTime: blog?.readTime || '5 min read'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            {blog ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              required
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
              >
                <option value="Technology">Technology</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Security">Security</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Read Time</label>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleInputChange}
                placeholder="5 min read"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Featured Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
            >
              {blog ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogs;