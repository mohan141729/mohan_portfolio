import React, { useEffect, useState, useRef } from 'react';
import * as FaIcons from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { buildApiUrl, ENDPOINTS } from '../config/api';

const AdminAITools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [formData, setFormData] = useState({ name: '', iconImage: null });
  const [iconImagePreview, setIconImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const fileInputRef = useRef();
  const dropZoneRef = useRef();

  useEffect(() => { fetchTools(); }, []);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl(ENDPOINTS.AI_TOOLS));
      const data = await res.json();
      setTools(Array.isArray(data) ? data : []);
    } catch {
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, files } = e.target;
    if (name === 'iconImage') {
      const file = files[0];
      handleFileSelect(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, GIF, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    setFormData((prev) => ({ ...prev, iconImage: file }));
    setIconImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openForm = (tool = null) => {
    setEditingTool(tool);
    setFormData(tool ? { name: tool.name, iconImage: null } : { name: '', iconImage: null });
    setIconImagePreview(tool && tool.iconImage ? tool.iconImage : null);
    setShowForm(true);
    setError('');
    setSuccess('');
    setIsDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTool(null);
    setFormData({ name: '', iconImage: null });
    setIconImagePreview(null);
    setError('');
    setSuccess('');
    setIsDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const method = editingTool ? 'PUT' : 'POST';
      const url = editingTool
        ? buildApiUrl(`${ENDPOINTS.AI_TOOLS}/${editingTool._id}`)
        : buildApiUrl(ENDPOINTS.AI_TOOLS);
      const form = new FormData();
      form.append('name', formData.name);
      if (formData.iconImage) form.append('iconImage', formData.iconImage);
      if (editingTool && editingTool.order !== undefined) form.append('order', editingTool.order);
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        credentials: 'include',
        body: form,
      });
      if (!res.ok) throw new Error('Failed to save');
      await fetchTools();
      setSuccess('Saved!');
      closeForm();
    } catch {
      setError('Failed to save AI tool');
    }
  };

  const handleDelete = async (tool) => {
    if (!window.confirm('Delete this tool?')) return;
    try {
      const res = await fetch(buildApiUrl(`${ENDPOINTS.AI_TOOLS}/${tool._id}`), {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchTools();
    } catch {
      setError('Failed to delete AI tool');
    }
  };

  const moveTool = async (idx, direction) => {
    const newOrder = [...tools];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newOrder.length) return;
    // Swap order values
    const temp = newOrder[idx].order;
    newOrder[idx].order = newOrder[swapIdx].order;
    newOrder[swapIdx].order = temp;
    // Sort and send new order to backend
    newOrder.sort((a, b) => a.order - b.order);
    await fetch(buildApiUrl(ENDPOINTS.AI_TOOLS), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      credentials: 'include',
      body: JSON.stringify({ order: newOrder.map((t, i) => ({ _id: t._id, order: i })) }),
    });
    await fetchTools();
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-3 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 border border-blue-100">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-blue-800 text-center">AI Tools Management</h1>
        <button
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-5 py-2 rounded-lg mb-4 sm:mb-6 flex items-center gap-2 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md mx-auto text-sm sm:text-base"
          onClick={() => openForm()}
        >
          {FaIcons.FaPlus && <FaIcons.FaPlus />} Add Tool
        </button>
        {loading ? (
          <div className="text-center text-blue-700 py-10">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden bg-white min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-900">
                  <th className="p-2 sm:p-3 text-xs sm:text-sm">Order</th>
                  <th className="p-2 sm:p-3 text-xs sm:text-sm">Icon</th>
                  <th className="p-2 sm:p-3 text-xs sm:text-sm">Name</th>
                  <th className="p-2 sm:p-3 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool, idx) => (
                  <tr key={tool._id} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="p-2 sm:p-3 text-center font-semibold text-blue-700 text-xs sm:text-sm">{idx + 1}</td>
                    <td className="p-2 sm:p-3 text-center">
                      {tool.iconImage && (
                        <img src={tool.iconImage} alt="icon" className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full mx-auto border border-blue-200 bg-white" />
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-blue-900 font-medium text-xs sm:text-sm">{tool.name}</td>
                    <td className="p-2 sm:p-3 flex gap-1 sm:gap-2 justify-center">
                      <button onClick={() => moveTool(idx, 'up')} disabled={idx === 0} className="p-1 rounded hover:bg-blue-100 disabled:opacity-50"><FaIcons.FaArrowUp className="text-blue-700 text-xs sm:text-sm" /></button>
                      <button onClick={() => moveTool(idx, 'down')} disabled={idx === tools.length - 1} className="p-1 rounded hover:bg-blue-100 disabled:opacity-50"><FaIcons.FaArrowDown className="text-blue-700 text-xs sm:text-sm" /></button>
                      <button onClick={() => openForm(tool)} className="p-1 rounded hover:bg-yellow-100"><FaIcons.FaEdit className="text-yellow-600 text-xs sm:text-sm" /></button>
                      <button onClick={() => handleDelete(tool)} className="p-1 rounded hover:bg-red-100"><FaIcons.FaTrash className="text-red-600 text-xs sm:text-sm" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal for Add/Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-0 w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl border border-blue-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-lg sm:text-xl font-bold text-white">{editingTool ? 'Edit' : 'Add'} AI Tool</h2>
              <button className="text-white hover:text-gray-200 p-1" onClick={closeForm}>{FaIcons.FaTimes && <FaIcons.FaTimes className="text-lg" />}</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-4 sm:px-6 py-4 sm:py-6" encType="multipart/form-data">
              <div>
                <label className="block font-semibold mb-1 text-blue-800 text-sm sm:text-base">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base" 
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-blue-800 text-sm sm:text-base">Upload Icon Image</label>
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
                    isDragOver 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {FaIcons.FaCloudUploadAlt && <FaIcons.FaCloudUploadAlt className="text-2xl sm:text-3xl text-gray-400" />}
                    <p className="text-xs sm:text-sm text-gray-600">
                      {isDragOver ? 'Drop your image here' : 'Drag & drop an image here, or click to browse'}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
                    >
                      Browse Files
                    </button>
                  </div>
                  <input
                    type="file"
                    name="iconImage"
                    accept="image/*"
                    onChange={handleInputChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
                {iconImagePreview && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img src={iconImagePreview} alt="Preview" className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg border border-gray-200 bg-white mx-auto" />
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                <button 
                  type="button" 
                  onClick={closeForm} 
                  className="bg-gray-100 px-3 sm:px-4 py-2 rounded hover:bg-gray-200 text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded hover:from-blue-600 hover:to-indigo-700 text-sm sm:text-base order-1 sm:order-2"
                >
                  {editingTool ? 'Update' : 'Add'}
                </button>
              </div>
              {error && <div className="text-red-500 text-xs sm:text-sm mt-2">{error}</div>}
              {success && <div className="text-green-600 text-xs sm:text-sm mt-2">{success}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAITools; 