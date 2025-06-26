'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ListFilter, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

// Placeholder data - replace with API calls
const initialLogs = [
  { id: 'log_001', timestamp: '2025-06-05 10:15:30 AM', adminUser: 'super.admin@example.com', action: 'Tenant Created', targetType: 'Tenant', targetId: 'tenant-003', details: 'Created new tenant: Evergreen Solutions', ipAddress: '192.168.1.101' },
  { id: 'log_002', timestamp: '2025-06-05 09:30:00 AM', adminUser: 'super.admin@example.com', action: 'Setting Updated', targetType: 'Global Setting', targetId: 'PlatformTheme', details: 'Changed platform theme to Dark Mode', ipAddress: '192.168.1.101' },
  { id: 'log_003', timestamp: '2025-06-04 05:20:10 PM', adminUser: 'jane.doe@example.com', action: 'Tenant Suspended', targetType: 'Tenant', targetId: 'tenant-002', details: 'Suspended tenant: Bloom & Grow Gardens due to payment failure', ipAddress: '203.0.113.45' },
  { id: 'log_004', timestamp: '2025-06-04 02:00:00 PM', adminUser: 'super.admin@example.com', action: 'Plan Edited', targetType: 'Subscription Plan', targetId: 'plan_pro_monthly', details: 'Updated Pro Monthly plan price to $109', ipAddress: '192.168.1.101' },
  { id: 'log_005', timestamp: '2025-06-03 11:00:00 AM', adminUser: 'john.smith@example.com', action: 'User Login', targetType: 'System', targetId: null, details: 'Admin user logged in successfully', ipAddress: '10.0.0.5' },
  // Add more logs for pagination and filtering testing
  ...
Array(20).fill(null).map((_, i) => ({
    id: `log_00${i + 6}`,
    timestamp: `2025-06-${String(Math.floor(i/5) + 1).padStart(2, '0')} ${String(10 + i%5).padStart(2, '0')}:00:00 AM`,
    adminUser: i % 2 === 0 ? 'super.admin@example.com' : 'jane.doe@example.com',
    action: ['User Login', 'Tenant Updated', 'Setting Changed', 'Report Generated', 'User Logout'][i % 5],
    targetType: ['System', 'Tenant', 'Global Setting', 'Report', 'System'][i % 5],
    targetId: i % 5 === 1 ? `tenant-00${i%3 + 1}` : (i % 5 === 2 ? ['EmailConfig', 'PaymentGateway'][i%2] : null),
    details: `Performed action: ${['User Login', 'Tenant Updated', 'Setting Changed', 'Report Generated', 'User Logout'][i % 5]} on ${['System', 'Tenant', 'Global Setting', 'Report', 'System'][i % 5]}`,
    ipAddress: `192.168.1.${100 + i}`,
}))
].flat();

const ITEMS_PER_PAGE = 10;

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [filters, setFilters] = useState({ searchTerm: '', adminUser: '', actionType: '', dateFrom: '', dateTo: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

      return (
        (filters.searchTerm === '' || 
          log.adminUser.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
          log.action.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
          (log.targetId && log.targetId.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
          log.details.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          log.ipAddress.includes(filters.searchTerm)
        ) &&
        (filters.adminUser === '' || log.adminUser.toLowerCase().includes(filters.adminUser.toLowerCase())) &&
        (filters.actionType === '' || log.action === filters.actionType) &&
        (!dateFrom || logDate >= dateFrom) &&
        (!dateTo || logDate <= new Date(dateTo.getTime() + 24 * 60 * 60 * 1000 -1)) // Include the whole 'dateTo' day
      );
    });
  }, [logs, filters]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const uniqueAdminUsers = useMemo(() => [...new Set(logs.map(log => log.adminUser))], [logs]);
  const uniqueActionTypes = useMemo(() => [...new Set(logs.map(log => log.action))], [logs]);

  const handleDownloadLogs = () => {
    // Basic CSV download functionality
    const headers = ['Timestamp', 'Admin User', 'Action', 'Target Type', 'Target ID', 'Details', 'IP Address'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => 
        [log.timestamp, log.adminUser, log.action, log.targetType, log.targetId || '', log.details.replace(/,/g, ';'), log.ipAddress].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `admin_activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    alert('Downloading logs (placeholder for actual download)');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">Admin Activity Logs</h1>
        <button 
          onClick={handleDownloadLogs}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm transition-colors shadow-md hover:shadow-lg"
        >
          <Download size={18} className="mr-2" /> Download Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Logs</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                name="searchTerm" 
                id="searchTerm"
                placeholder="Search by keyword, IP, etc."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label htmlFor="adminUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin User</label>
            <select name="adminUser" id="adminUser" value={filters.adminUser} onChange={handleFilterChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
              <option value="">All Users</option>
              {uniqueAdminUsers.map(user => <option key={user} value={user}>{user}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action Type</label>
            <select name="actionType" id="actionType" value={filters.actionType} onChange={handleFilterChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
              <option value="">All Actions</option>
              {uniqueActionTypes.map(action => <option key={action} value={action}>{action}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
                <input type="date" name="dateFrom" id="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
            </div>
            <div>
                <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
                <input type="date" name="dateTo" id="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" />
            </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Timestamp', 'Admin User', 'Action', 'Target', 'Details', 'IP Address'].map(header => (
                  <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedLogs.length > 0 ? paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.timestamp}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{log.adminUser}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.action}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {log.targetType}{log.targetId && `: ${log.targetId}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate" title={log.details}>{log.details}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{log.ipAddress}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
