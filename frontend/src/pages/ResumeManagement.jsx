import { useState, useEffect } from 'react'
import { fetchAllResumes, createResume, updateResume, deleteResume } from '../lib/api'

function ResumeForm({ resume, onSave, onCancel, isOpen }) {
  const [formData, setFormData] = useState({
    title: '',
    fileName: '',
    file: null,
    fileSize: 0,
    mimeType: '',
    isActive: true
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const [filePreview, setFilePreview] = useState('')

  useEffect(() => {
    if (resume) {
      setFormData({
        title: resume.title || resume.filename || '',
        fileName: resume.fileName || resume.filename || '',
        file: null, // File object not available for existing resumes
        fileSize: resume.fileSize || resume.size || 0,
        mimeType: resume.mimeType || resume.content_type || '',
        isActive: resume.isActive !== undefined ? resume.isActive : true
      })
      setFilePreview('') // No preview for existing files
    } else {
      setFormData({
        title: '',
        fileName: '',
        file: null,
        fileSize: 0,
        mimeType: '',
        isActive: true
      })
      setFilePreview('')
    }
  }, [resume])

  const handleFileUpload = async (file) => {
    // Check file type (only PDF and DOC files)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please select a PDF or Word document file')
    }

    // Check file size (limit to 5MB to avoid payload issues)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Please select a file smaller than 5MB.')
    }

    // Store file for upload (no base64 conversion needed)
    return {
      file: file,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const fileData = await handleFileUpload(file)
        setFormData({ ...formData, ...fileData })
        setFilePreview(fileData.fileName) // Show filename instead of URL
      } catch (error) {
        alert(`File upload failed: ${error.message}`)
        e.target.value = ''
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      try {
        const fileData = await handleFileUpload(file)
        setFormData({ ...formData, ...fileData })
        setFilePreview(fileData.fileName) // Show filename instead of URL
      } catch (error) {
        alert(`File upload failed: ${error.message}`)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a resume title')
      return
    }
    if (!formData.file) {
      alert('Please upload a resume file')
      return
    }
    
    try {
      if (resume && (resume._id || resume.id)) {
        console.log('Updating resume')
        await updateResume(resume._id || resume.id, formData.file)
      } else {
        console.log('Creating new resume')
        await createResume(formData.file)
      }
      onSave()
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Error saving resume: ' + error.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {resume ? 'Edit Resume' : 'Add New Resume'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Resume Information
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Software Engineer Resume"
                  />
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Resume File
              </h3>
              
              <div className="space-y-4">
                {/* Drag and Drop Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {filePreview || formData.fileName ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">{filePreview || formData.fileName}</p>
                        <p className="text-sm text-gray-600">
                          {formData.fileSize > 0 ? (formData.fileSize / 1024 / 1024).toFixed(2) + ' MB' : ''}
                        </p>
                        <p className="text-sm text-gray-500">Click or drag to change file</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">Upload Resume File</p>
                        <p className="text-sm text-gray-600">
                          Drag and drop a PDF or Word document here, or click to select
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported formats: PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Settings
              </h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (available for download)
                </label>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {resume ? 'Update Resume' : 'Create Resume'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function ResumeManagement() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResume, setEditingResume] = useState(null)

  const loadResumes = async () => {
    try {
      setLoading(true)
      const data = await fetchAllResumes()
      console.log('Fetched resumes:', data)
      console.log('Data type:', typeof data)
      console.log('Is array:', Array.isArray(data))
      
      // Handle both array and object responses
      if (Array.isArray(data)) {
        console.log('Setting resumes as array:', data)
        setResumes(data)
      } else if (data && Array.isArray(data.resumes)) {
        console.log('Setting resumes from data.resumes:', data.resumes)
        setResumes(data.resumes)
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('Setting resumes from data.data:', data.data)
        setResumes(data.data)
      } else if (data && typeof data === 'object') {
        // If it's a single resume object, wrap it in an array
        console.log('Wrapping single resume object in array:', data)
        setResumes([data])
      } else {
        console.log('Setting empty array')
        setResumes([])
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
      console.error('Error details:', error.message)
      setResumes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResumes()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id)
        await loadResumes()
      } catch (error) {
        console.error('Error deleting resume:', error)
        alert('Error deleting resume: ' + error.message)
      }
    }
  }

  const handleEdit = (resume) => {
    console.log('Editing resume:', resume)
    setEditingResume(resume)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingResume(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingResume(null)
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingResume(null)
    loadResumes()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading resumes...</div>
      </div>
    )
  }

  // Ensure resumes is always an array
  const safeResumes = Array.isArray(resumes) ? resumes : []

  return (
    <div className="space-y-8 p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Resume Management</h2>
          <p className="text-gray-600 mt-2 text-lg">Manage your resume files for download</p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Resume
        </button>
      </div>

      {/* Resumes Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeResumes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 sm:px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                      <p className="text-gray-500 mb-4">Get started by uploading your first resume</p>
                      <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Resume
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                safeResumes.map((resume) => (
                  <tr key={resume._id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-300 group">
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                        {resume.title || resume.filename || 'Resume'}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{resume.fileName || resume.filename}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{formatFileSize(resume.fileSize || resume.size)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{resume.downloadCount || 0}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 ${
                          resume.isActive !== false
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {resume.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/public/resume/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 hover:text-green-800 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleEdit(resume)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(resume._id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 hover:text-red-800 transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ResumeForm
        resume={editingResume}
        onSave={handleFormSave}
        onCancel={handleFormClose}
        isOpen={showForm}
      />
    </div>
  )
}

export default ResumeManagement