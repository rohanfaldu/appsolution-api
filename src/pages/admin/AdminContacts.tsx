import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mail, Phone, Calendar, Eye, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/AdminLayout';

const AdminContacts = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Mock contact data
    const mockContacts = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'I am interested in your e-commerce mobile app solution. Can you provide more details about customization options and pricing for enterprise clients?',
        captcha: '7',
        date: '2024-01-15T10:30:00Z',
        status: 'unread'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        message: 'Hello, we are looking for a food delivery app for our restaurant chain. Do you offer white-label solutions?',
        captcha: '12',
        date: '2024-01-14T14:22:00Z',
        status: 'read'
      },
      {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@startup.io',
        message: 'We need a fitness tracking app with custom branding. What is the timeline for customization and deployment?',
        captcha: '9',
        date: '2024-01-13T09:15:00Z',
        status: 'replied'
      },
      {
        id: 4,
        name: 'Emily Chen',
        email: 'emily.chen@techcorp.com',
        message: 'Can you provide a demo of your chat messenger app? We are evaluating solutions for internal communication.',
        captcha: '15',
        date: '2024-01-12T16:45:00Z',
        status: 'unread'
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david@agency.com',
        message: 'Interested in bulk licensing for multiple clients. Do you offer reseller programs?',
        captcha: '6',
        date: '2024-01-11T11:20:00Z',
        status: 'read'
      }
    ];

    setContacts(mockContacts);
  }, [isAuthenticated, navigate]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    
    // Mark as read if it was unread
    if (contact.status === 'unread') {
      setContacts(prev => prev.map(c => 
        c.id === contact.id ? { ...c, status: 'read' } : c
      ));
    }
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(c => c.id !== contactId));
    }
  };

  const handleMarkAsReplied = (contactId) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, status: 'replied' } : c
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'read':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'replied':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contact Management</h1>
            <p className="text-gray-400">Manage customer inquiries and messages</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Total: {contacts.length} | Unread: {contacts.filter(c => c.status === 'unread').length}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Contact</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Message Preview</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="text-white font-medium">{contact.name}</h3>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {contact.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-300 line-clamp-2 max-w-md">
                      {contact.message}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(contact.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewContact(contact)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {contact.status !== 'replied' && (
                        <button
                          onClick={() => handleMarkAsReplied(contact.id)}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Mark as Replied"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
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

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No contacts found.</p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <ContactModal
          contact={selectedContact}
          onClose={() => {
            setShowModal(false);
            setSelectedContact(null);
          }}
          onMarkAsReplied={() => {
            handleMarkAsReplied(selectedContact.id);
            setShowModal(false);
            setSelectedContact(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

const ContactModal = ({ contact, onClose, onMarkAsReplied }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Contact Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-400 w-20">Name:</span>
                <span className="text-white font-medium">{contact.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-20">Email:</span>
                <span className="text-white">{contact.email}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-20">Date:</span>
                <span className="text-white">{new Date(contact.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-20">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  contact.status === 'unread' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  contact.status === 'read' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-green-500/20 text-green-400 border-green-500/30'
                }`}>
                  {contact.status}
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Message</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {contact.message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <a
              href={`mailto:${contact.email}?subject=Re: Your inquiry&body=Hi ${contact.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0ABest regards,%0D%0AAppSolutions Team`}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 text-center"
            >
              Reply via Email
            </a>
            {contact.status !== 'replied' && (
              <button
                onClick={onMarkAsReplied}
                className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg font-medium transition-colors"
              >
                Mark as Replied
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts;