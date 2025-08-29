import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Calendar, DollarSign, User, Package, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/AdminLayout';

const AdminPurchases = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const purchasesPerPage = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    // Mock purchase data
    const mockPurchases = [
      {
        id: 1,
        transactionId: 'TXN_1705312800000',
        productName: 'E-Commerce Mobile App',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        amount: 299,
        paymentMethod: 'PayPal',
        status: 'completed',
        purchaseDate: '2024-01-15T10:30:00Z',
        downloadCount: 3,
        lastDownload: '2024-01-15T11:45:00Z'
      },
      {
        id: 2,
        transactionId: 'TXN_1705226400000',
        productName: 'Food Delivery App',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@company.com',
        amount: 499,
        paymentMethod: 'PayPal',
        status: 'completed',
        purchaseDate: '2024-01-14T14:22:00Z',
        downloadCount: 1,
        lastDownload: '2024-01-14T14:30:00Z'
      },
      {
        id: 3,
        transactionId: 'TXN_1705140000000',
        productName: 'Fitness Tracker App',
        customerName: 'Mike Wilson',
        customerEmail: 'mike.wilson@startup.io',
        amount: 199,
        paymentMethod: 'PayPal',
        status: 'completed',
        purchaseDate: '2024-01-13T09:15:00Z',
        downloadCount: 5,
        lastDownload: '2024-01-13T16:20:00Z'
      },
      {
        id: 4,
        transactionId: 'TXN_1705053600000',
        productName: 'Chat Messenger App',
        customerName: 'Emily Chen',
        customerEmail: 'emily.chen@techcorp.com',
        amount: 399,
        paymentMethod: 'PayPal',
        status: 'pending',
        purchaseDate: '2024-01-12T16:45:00Z',
        downloadCount: 0,
        lastDownload: null
      },
      {
        id: 5,
        transactionId: 'TXN_1704967200000',
        productName: 'Task Management App',
        customerName: 'David Brown',
        customerEmail: 'david@agency.com',
        amount: 249,
        paymentMethod: 'PayPal',
        status: 'completed',
        purchaseDate: '2024-01-11T11:20:00Z',
        downloadCount: 2,
        lastDownload: '2024-01-11T12:15:00Z'
      },
      {
        id: 6,
        transactionId: 'TXN_1704880800000',
        productName: 'Learning Management App',
        customerName: 'Lisa Anderson',
        customerEmail: 'lisa@education.org',
        amount: 599,
        paymentMethod: 'PayPal',
        status: 'refunded',
        purchaseDate: '2024-01-10T08:30:00Z',
        downloadCount: 0,
        lastDownload: null
      }
    ];

    setPurchases(mockPurchases);
  }, [isAuthenticated, navigate]);

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const indexOfLastPurchase = currentPage * purchasesPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
  const currentPurchases = filteredPurchases.slice(indexOfFirstPurchase, indexOfLastPurchase);
  const totalPages = Math.ceil(filteredPurchases.length / purchasesPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'refunded':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'failed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const totalRevenue = purchases
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalSales = purchases.filter(p => p.status === 'completed').length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Purchase Management</h1>
            <p className="text-gray-400">Track and manage customer purchases</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-white">{totalSales}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-white">
                  {purchases.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Downloads</p>
                <p className="text-2xl font-bold text-white">
                  {purchases.reduce((sum, p) => sum + p.downloadCount, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Download className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none"
              >
                <option value="all" className="bg-gray-800">All Status</option>
                <option value="completed" className="bg-gray-800">Completed</option>
                <option value="pending" className="bg-gray-800">Pending</option>
                <option value="refunded" className="bg-gray-800">Refunded</option>
                <option value="failed" className="bg-gray-800">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Transaction</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Product</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-mono text-sm">{purchase.transactionId}</p>
                      <p className="text-gray-400 text-xs">{purchase.paymentMethod}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{purchase.customerName}</p>
                      <p className="text-gray-400 text-sm">{purchase.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{purchase.productName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-bold">${purchase.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300 text-sm">
                      <p>{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                      <p>{new Date(purchase.purchaseDate).toLocaleTimeString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center">
                      <p className="text-white font-bold">{purchase.downloadCount}</p>
                      {purchase.lastDownload && (
                        <p className="text-gray-400 text-xs">
                          Last: {new Date(purchase.lastDownload).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentPurchases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No purchases found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPurchases;