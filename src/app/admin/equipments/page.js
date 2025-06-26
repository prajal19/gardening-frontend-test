"use client";

import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiCalendar,
    FiAlertCircle,
    FiEdit,
    FiTrash2,
    FiCheck,
    FiX,
    FiCamera,
    FiArrowLeft,
    FiSave,
    FiEye,
    FiRefreshCw,
    FiImage
} from 'react-icons/fi';

const EquipmentManagementSystem = () => {
    // Main state
    const [view, setView] = useState('dashboard'); // 'dashboard', 'assignment', 'mobileCheck', 'edit'
    const [equipment, setEquipment] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [scannedId, setScannedId] = useState('');
    const [editingEquipment, setEditingEquipment] = useState(null);

    // Mock data initialization
    useEffect(() => {
        const mockEquipment = [
            {
                id: 1,
                name: 'Lawn Mower Pro 2000',
                type: 'Mower',
                status: 'available',
                nextMaintenance: '2025-07-15',
                assignedTo: 'Crew A',
                purchaseDate: '2024-01-15',
                maintenanceInterval: 30,
                lastMaintenance: '2025-05-15',
                serialNumber: 'LM2000-001',
                location: 'Warehouse A',
                quantity: 5,
                minQuantity: 2,
                imageUrl: 'https://images.unsplash.com/photo-1618254488700-8c50836e90bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FyZGVuaW5nJTIwZXF1aXBtcm50fGVufDB8fDB8fHww'
            },
            {
                id: 2,
                name: 'Professional Chainsaw',
                type: 'Tree Care',
                status: 'in-use',
                nextMaintenance: '2025-06-20',
                assignedTo: 'Crew B',
                purchaseDate: '2024-03-20',
                maintenanceInterval: 45,
                lastMaintenance: '2025-04-20',
                serialNumber: 'CS-PRO-002',
                location: 'Field Site 1',
                quantity: 3,
                minQuantity: 1,
                imageUrl: 'https://plus.unsplash.com/premium_photo-1678382345841-eac58a12414e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGdhcmRlbmluZyUyMGVxdWlwbXJudHxlbnwwfHwwfHx8MA%3D%3D'
            },
            {
                id: 3,
                name: 'Heavy Duty Leaf Blower',
                type: 'Cleanup',
                status: 'maintenance',
                nextMaintenance: '2025-06-10',
                assignedTo: '-',
                purchaseDate: '2024-02-10',
                maintenanceInterval: 60,
                lastMaintenance: '2025-04-10',
                serialNumber: 'LB-HD-003',
                location: 'Maintenance Shop',
                quantity: 1,
                minQuantity: 2,
                imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=150&h=150&fit=crop&crop=center'
            },
        ];
        setEquipment(mockEquipment);

        const mockAppointment = {
            id: 101,
            date: '2025-06-25',
            service: 'Lawn Maintenance',
            crew: 'Crew A',
            assignedEquipment: []
        };
        setCurrentAppointment(mockAppointment);
    }, []);

    // Filter equipment based on search and status
    const filteredEquipment = equipment.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // Add new equipment
    const handleAddEquipment = (newEquipment) => {
        const newId = Math.max(...equipment.map(e => e.id), 0) + 1;
        const nextMaintenance = new Date();
        nextMaintenance.setDate(nextMaintenance.getDate() + parseInt(newEquipment.maintenanceInterval));

        setEquipment([...equipment, {
            id: newId,
            status: 'available',
            assignedTo: '-',
            nextMaintenance: nextMaintenance.toISOString().split('T')[0],
            lastMaintenance: newEquipment.purchaseDate || new Date().toISOString().split('T')[0],
            serialNumber: `${newEquipment.type.substring(0, 2).toUpperCase()}-${newId.toString().padStart(3, '0')}`,
            location: 'Warehouse A',
            quantity: parseInt(newEquipment.quantity) || 1,
            minQuantity: parseInt(newEquipment.minQuantity) || 1,
            ...newEquipment
        }]);
        setShowAddModal(false);
    };

    // Update equipment
    const handleUpdateEquipment = (updatedEquipment) => {
        setEquipment(equipment.map(item =>
            item.id === updatedEquipment.id ? updatedEquipment : item
        ));
        setView('dashboard');
        setEditingEquipment(null);
    };

    // Delete equipment
    const handleDeleteEquipment = (id) => {
        if (window.confirm('Are you sure you want to delete this equipment?')) {
            setEquipment(equipment.filter(item => item.id !== id));
        }
    };

    // Open edit view
    const handleEditEquipment = (equipmentItem) => {
        setEditingEquipment(equipmentItem);
        setView('edit');
    };

    // Render different views
    const renderView = () => {
        switch (view) {
            case 'assignment':
                return <AssignmentView
                    appointment={currentAppointment}
                    equipment={equipment}
                    setEquipment={setEquipment}
                    onBack={() => setView('dashboard')}
                />;
            case 'mobileCheck':
                return <MobileCheckView
                    onBack={() => setView('dashboard')}
                    scannedId={scannedId}
                    setScannedId={setScannedId}
                    equipment={equipment}
                    setEquipment={setEquipment}
                />;
            case 'edit':
                return <EditEquipmentView
                    equipment={editingEquipment}
                    onBack={() => setView('dashboard')}
                    onSubmit={handleUpdateEquipment}
                />;
            default:
                return <DashboardView
                    equipment={filteredEquipment}
                    onAdd={() => setShowAddModal(true)}
                    onDelete={handleDeleteEquipment}
                    onEdit={handleEditEquipment}
                    onNavigate={setView}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />;
        }
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
            {showAddModal && (
                <AddEquipmentModal
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddEquipment}
                />
            )}
            {renderView()}
        </div>
    );
};

// Dashboard View Component
const DashboardView = ({
    equipment,
    onAdd,
    onDelete,
    onEdit,
    onNavigate,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus
}) => {
    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Equipment Management</h1>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => onNavigate('mobileCheck')}
                        className="sm:hidden flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
                    >
                        <FiCamera className="mr-1" /> Scan
                    </button>
                    <button
                        onClick={() => onNavigate('assignment')}
                        className="flex items-center bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                    >
                        <FiCheck className="mr-1 sm:mr-2" /> Assign
                    </button>
                    <button
                        onClick={onAdd}
                        className="flex items-center bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                        <FiPlus className="mr-1 sm:mr-2" /> Add Equipment
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search equipment, type, or serial..."
                        className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="in-use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>

            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
                {equipment.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-start mb-3 gap-3">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-16 w-16 rounded-md object-cover border border-gray-200"
                                    src={item.imageUrl || 'https://via.placeholder.com/64?text=No+Image'}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/64?text=No+Image'
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.type} • {item.serialNumber}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                                        item.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                                <span className="text-gray-500">Quantity:</span>
                                <p className={`font-medium ${item.quantity <= item.minQuantity ? 'text-red-600' : 'text-gray-900'}`}>
                                    {item.quantity}
                                    {item.quantity <= item.minQuantity && (
                                        <FiAlertCircle className="inline ml-1 text-red-500" />
                                    )}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Assigned to:</span>
                                <p className="font-medium">{item.assignedTo}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-500">
                                <FiCalendar className="mr-1" />
                                {item.nextMaintenance}
                                {new Date(item.nextMaintenance) < new Date() && (
                                    <FiAlertCircle className="ml-1 text-red-500" />
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onEdit(item)}
                                    className="text-blue-600 hover:text-blue-900 p-1"
                                    title="Edit"
                                >
                                    <FiEdit />
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="text-red-600 hover:text-red-900 p-1"
                                    title="Delete"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR.NO.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {equipment.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    {/* Serial Number */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>

                                    {/* Equipment Image */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img
                                                className="h-10 w-10 rounded-md object-cover border border-gray-200"
                                                src={item.imageUrl || 'https://via.placeholder.com/40?text=No+Image'}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/40?text=No+Image'
                                                }}
                                            />
                                        </div>
                                    </td>

                                    {/* Equipment Details */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            <div className="text-sm text-gray-500">{item.type} • {item.serialNumber}</div>
                                        </div>
                                    </td>

                                    {/* Quantity */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`font-medium ${item.quantity <= item.minQuantity ? 'text-red-600' : 'text-gray-900'}`}>
                                                {item.quantity}
                                            </span>
                                            {item.quantity <= item.minQuantity && (
                                                <FiAlertCircle className="ml-1 text-red-500" title="Low stock" />
                                            )}
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                                            item.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
                                                item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Assignment */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.assignedTo || 'Unassigned'}
                                    </td>

                                    {/* Maintenance */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-2 text-gray-400" />
                                            {item.nextMaintenance ? new Date(item.nextMaintenance).toLocaleDateString() : 'N/A'}
                                            {item.nextMaintenance && new Date(item.nextMaintenance) < new Date() && (
                                                <FiAlertCircle className="ml-2 text-red-500" title="Maintenance overdue" />
                                            )}
                                        </div>
                                    </td>

                                    {/* Location */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.location || 'N/A'}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <FiEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {equipment.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No equipment found matching your criteria.</p>
                </div>
            )}
        </AdminLayout>
    );
};

// Edit Equipment View Component
const EditEquipmentView = ({ equipment, onBack, onSubmit }) => {
    const [formData, setFormData] = useState(equipment || {});

    const handleSubmit = (e) => {
        e.preventDefault();

        // Calculate next maintenance date if maintenance interval changed
        if (formData.maintenanceInterval !== equipment.maintenanceInterval) {
            const nextMaintenance = new Date(formData.lastMaintenance);
            nextMaintenance.setDate(nextMaintenance.getDate() + parseInt(formData.maintenanceInterval));
            formData.nextMaintenance = nextMaintenance.toISOString().split('T')[0];
        }

        onSubmit({
            ...formData,
            quantity: parseInt(formData.quantity) || 1,
            minQuantity: parseInt(formData.minQuantity) || 1
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 mr-4 p-2 hover:bg-gray-100 rounded"
                    >
                        <FiArrowLeft className="mr-1" /> Back
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Equipment</h1>
                </div>

                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name*</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.name || ''}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type*</label>
                                    <select
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.type || ''}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="Mower">Lawn Mower</option>
                                        <option value="Tree Care">Tree Care</option>
                                        <option value="Cleanup">Cleanup</option>
                                        <option value="Truck">Service Truck</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.serialNumber || ''}
                                        onChange={(e) => handleChange('serialNumber', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.imageUrl || ''}
                                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity*</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            value={formData.quantity || ''}
                                            onChange={(e) => handleChange('quantity', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Min Quantity*</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            value={formData.minQuantity || ''}
                                            onChange={(e) => handleChange('minQuantity', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Assignment & Maintenance */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Assignment & Maintenance</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status*</label>
                                    <select
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.status || ''}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        required
                                    >
                                        <option value="available">Available</option>
                                        <option value="in-use">In Use</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.assignedTo || ''}
                                        onChange={(e) => handleChange('assignedTo', e.target.value)}
                                        placeholder="e.g., Crew A, John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.location || ''}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        placeholder="e.g., Warehouse A, Field Site 1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.purchaseDate || ''}
                                        onChange={(e) => handleChange('purchaseDate', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Maintenance</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.lastMaintenance || ''}
                                        onChange={(e) => handleChange('lastMaintenance', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Interval (days)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.maintenanceInterval || ''}
                                        onChange={(e) => handleChange('maintenanceInterval', e.target.value)}
                                        placeholder="30"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {formData.imageUrl && (
                            <div className="col-span-1 md:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Image Preview</h3>
                                <div className="flex justify-center">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Equipment preview"
                                        className="max-w-xs h-48 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <FiX className="mr-2" /> Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center justify-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <FiSave className="mr-2" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

// Add Equipment Modal Component
const AddEquipmentModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        maintenanceInterval: '30',
        quantity: '1',
        minQuantity: '1',
        imageUrl: '',
        location: 'Warehouse A'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Add New Equipment</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name*</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="e.g., Lawn Mower Pro 2000"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type*</label>
                            <select
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                                required
                            >
                                <option value="">Select type</option>
                                <option value="Mower">Lawn Mower</option>
                                <option value="Tree Care">Tree Care</option>
                                <option value="Cleanup">Cleanup</option>
                                <option value="Truck">Service Truck</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity*</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={formData.quantity}
                                    onChange={(e) => handleChange('quantity', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Min Quantity*</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={formData.minQuantity}
                                    onChange={(e) => handleChange('minQuantity', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                            <input
                                type="date"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={formData.purchaseDate}
                                onChange={(e) => handleChange('purchaseDate', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Interval (days)</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={formData.maintenanceInterval}
                                onChange={(e) => handleChange('maintenanceInterval', e.target.value)}
                                placeholder="30"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                placeholder="e.g., Warehouse A"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                            <input
                                type="url"
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={formData.imageUrl}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Add Equipment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Assignment View Component
const AssignmentView = ({ appointment, equipment, setEquipment, onBack }) => {
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const availableEquipment = equipment.filter(item =>
        item.status === 'available' &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleEquipment = (equipmentId) => {
        setSelectedEquipment(prev =>
            prev.includes(equipmentId)
                ? prev.filter(id => id !== equipmentId)
                : [...prev, equipmentId]
        );
    };

    const handleAssignEquipment = () => {
        if (selectedEquipment.length === 0) {
            alert('Please select at least one equipment item.');
            return;
        }

        setEquipment(prev => prev.map(item =>
            selectedEquipment.includes(item.id)
                ? { ...item, status: 'in-use', assignedTo: appointment.crew }
                : item
        ));

        alert(`Successfully assigned ${selectedEquipment.length} equipment items to ${appointment.crew}`);
        onBack();
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 mr-4 p-2 hover:bg-gray-100 rounded"
                    >
                        <FiArrowLeft className="mr-1" /> Back
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Equipment Assignment</h1>
                </div>

                {/* Appointment Details */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Assignment Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium">{appointment.date}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Service:</span>
                            <p className="font-medium">{appointment.service}</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Crew:</span>
                            <p className="font-medium">{appointment.crew}</p>
                        </div>
                    </div>
                </div>

                {/* Equipment Selection */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-lg font-semibold text-gray-800">Select Equipment</h2>
                        <div className="relative w-full sm:w-64">
                            <FiSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search equipment..."
                                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Equipment List */}
                    <div className="space-y-3 mb-6">
                        {availableEquipment.map(item => (
                            <div key={item.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    id={`equipment-${item.id}`}
                                    checked={selectedEquipment.includes(item.id)}
                                    onChange={() => handleToggleEquipment(item.id)}
                                    className="mr-4 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <div className="flex items-center flex-1">
                                    <img
                                        src={item.imageUrl || 'https://via.placeholder.com/48?text=No+Image'}
                                        alt={item.name}
                                        className="h-12 w-12 rounded-md object-cover border border-gray-200 mr-4"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.type} • Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {availableEquipment.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {searchTerm ? 'No equipment found matching your search.' : 'No available equipment.'}
                            </div>
                        )}
                    </div>

                    {/* Assignment Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t gap-4">
                        <div className="text-sm text-gray-600">
                            {selectedEquipment.length} equipment item(s) selected
                        </div>
                        <button
                            onClick={handleAssignEquipment}
                            disabled={selectedEquipment.length === 0}
                            className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            <FiCheck className="mr-2" />
                            Assign to {appointment.crew}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// Mobile Check View Component
const MobileCheckView = ({ onBack, scannedId, setScannedId, equipment, setEquipment }) => {
    const [foundEquipment, setFoundEquipment] = useState(null);
    const [checkType, setCheckType] = useState('checkout'); // 'checkout', 'checkin', 'maintenance'
    const [notes, setNotes] = useState('');

    const handleScan = () => {
        if (!scannedId) {
            alert('Please enter an equipment ID');
            return;
        }

        const found = equipment.find(item =>
            item.id.toString() === scannedId ||
            item.serialNumber?.toLowerCase() === scannedId.toLowerCase()
        );

        if (found) {
            setFoundEquipment(found);
        } else {
            alert('Equipment not found');
            setFoundEquipment(null);
        }
    };

    const handleProcessEquipment = () => {
        if (!foundEquipment) return;

        let updatedStatus = foundEquipment.status;
        let updatedAssignment = foundEquipment.assignedTo;

        switch (checkType) {
            case 'checkout':
                updatedStatus = 'in-use';
                updatedAssignment = 'Field Team';
                break;
            case 'checkin':
                updatedStatus = 'available';
                updatedAssignment = '-';
                break;
            case 'maintenance':
                updatedStatus = 'maintenance';
                updatedAssignment = 'Maintenance Team';
                break;
        }

        setEquipment(prev => prev.map(item =>
            item.id === foundEquipment.id
                ? { ...item, status: updatedStatus, assignedTo: updatedAssignment }
                : item
        ));

        alert(`Equipment ${checkType} completed successfully!`);
        setFoundEquipment(null);
        setScannedId('');
        setNotes('');
    };

    return (
        <AdminLayout>
            <div className="max-w-md mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 mr-4 p-2 hover:bg-gray-100 rounded"
                    >
                        <FiArrowLeft className="mr-1" /> Back
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Mobile Check</h1>
                </div>

                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Scan Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Equipment ID or Serial Number
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={scannedId}
                                onChange={(e) => setScannedId(e.target.value)}
                                placeholder="Enter or scan ID"
                            />
                            <button
                                onClick={handleScan}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <FiSearch className="mr-1" /> Find
                            </button>
                        </div>
                    </div>

                    {/* Action Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                        <select
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={checkType}
                            onChange={(e) => setCheckType(e.target.value)}
                        >
                            <option value="checkout">Check Out</option>
                            <option value="checkin">Check In</option>
                            <option value="maintenance">Send to Maintenance</option>
                        </select>
                    </div>

                    {/* Equipment Details */}
                    {foundEquipment && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center mb-3">
                                <img
                                    src={foundEquipment.imageUrl || 'https://via.placeholder.com/64?text=No+Image'}
                                    alt={foundEquipment.name}
                                    className="h-16 w-16 rounded-md object-cover border border-gray-200 mr-4"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                                    }}
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-900">{foundEquipment.name}</h3>
                                    <p className="text-sm text-gray-500">{foundEquipment.type}</p>
                                    <p className="text-sm text-gray-500">Serial: {foundEquipment.serialNumber}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-500">Status:</span>
                                    <p className="font-medium">{foundEquipment.status}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Assigned to:</span>
                                    <p className="font-medium">{foundEquipment.assignedTo}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                        <textarea
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about the equipment condition..."
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleProcessEquipment}
                        disabled={!foundEquipment}
                        className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <FiCheck className="mr-2" />
                        Process {checkType === 'checkout' ? 'Check Out' :
                            checkType === 'checkin' ? 'Check In' : 'Maintenance'}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EquipmentManagementSystem;