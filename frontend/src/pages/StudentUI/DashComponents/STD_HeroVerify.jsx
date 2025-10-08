import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  GraduationCap, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  IdCard,
  BookOpen,
  Building
} from 'lucide-react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

const STD_HeroVerify = ({ user, setUser }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    s_fname: '',
    s_lname: '',
    s_uni: '',
    s_faculty: '',
    s_studyprogram: '',
    s_uniID: '',
    s_NIC: '',
    s_gender: '',
    s_phone: '',
    s_dob: '',
    s_homeaddress: ''
  })
  const [universityIdFile, setUniversityIdFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get current user email from session/localStorage
  const currentUserEmail = user?.email || user?.s_email || localStorage.getItem('studentEmail') || ''

  // Fetch complete student data from API
  useEffect(() => {
    const fetchStudentData = async () => {
      console.log('User object:', user)
      console.log('Current user email:', currentUserEmail)
      
      if (!currentUserEmail) {
        console.log('No user email found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('Fetching student data for email:', currentUserEmail)
        const response = await api.get(`/students/email/${encodeURIComponent(currentUserEmail)}`)
        console.log('API response:', response.data)
        setStudentData(response.data)
        
        // Pre-fill form with fetched student data
        if (response.data) {
          console.log('Setting form data with:', response.data)
          setFormData(prev => ({
            ...prev,
            s_fname: response.data.s_fname || '',
            s_lname: response.data.s_lname || '',
            s_uni: response.data.s_uni || '',
            s_uniID: response.data.s_uniID || '',
            s_phone: response.data.s_phone || '',
            s_NIC: response.data.s_NIC || '',
            s_faculty: response.data.s_faculty || '',
            s_studyprogram: response.data.s_studyprogram || '',
            s_gender: response.data.s_gender || '',
            s_dob: response.data.s_dob ? new Date(response.data.s_dob).toISOString().split('T')[0] : '',
            s_homeaddress: response.data.s_homeaddress || ''
          }))
        }
      } catch (err) {
        console.error('Error fetching student data:', err)
        console.error('Error response:', err.response?.data)
        toast.error(`Failed to load student data: ${err.response?.data?.message || err.message}`)
        
        // Fallback: Use user data from localStorage if API fails
        if (user) {
          console.log('Using fallback user data:', user)
          setFormData(prev => ({
            ...prev,
            s_fname: user.s_fname || user.fname || '',
            s_lname: user.s_lname || user.lname || '',
            s_uni: user.s_uni || '',
            s_uniID: user.s_uniID || user.uid || '',
            s_phone: user.s_phone || '',
            s_NIC: user.s_NIC || '',
            s_faculty: user.s_faculty || '',
            s_studyprogram: user.s_studyprogram || '',
            s_gender: user.s_gender || '',
            s_dob: user.s_dob ? new Date(user.s_dob).toISOString().split('T')[0] : '',
            s_homeaddress: user.s_homeaddress || ''
          }))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [currentUserEmail, user])

  // Trigger validation check when form data changes
  useEffect(() => {
    console.log('Form data changed, checking validation...')
    console.log('Current form data:', formData)
    console.log('File uploaded:', !!universityIdFile)
    console.log('Is form valid:', isFormValid())
  }, [formData, universityIdFile])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid file (JPG, PNG, or PDF)')
        return
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setUniversityIdFile(file)
    }
  }

  // Validation functions
  const validatePhone = (phone) => {
    if (!phone) return false
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
  }

  const validateNIC = (nic) => {
    if (!nic) return false
    // NIC validation: accept 10 or 12 character strings (alphanumeric)
    const nicRegex = /^[A-Za-z0-9]{10}$|^[A-Za-z0-9]{12}$/
    return nicRegex.test(nic)
  }

  const validateDateOfBirth = (dob) => {
    if (!dob) return false
    const today = new Date()
    const birthDate = new Date(dob)
    const age = today.getFullYear() - birthDate.getFullYear()
    return age >= 16 && age <= 100 // Reasonable age range for students
  }

  // Check if form is valid for submit button state
  const isFormValid = () => {
    // Check if all required fields are filled
    const allFieldsFilled = (
      formData.s_fname &&
      formData.s_lname &&
      formData.s_uni &&
      formData.s_faculty &&
      formData.s_studyprogram &&
      formData.s_uniID &&
      formData.s_NIC &&
      formData.s_gender &&
      formData.s_phone &&
      formData.s_dob &&
      formData.s_homeaddress &&
      universityIdFile
    )

    // Debug logging - show all form data
    console.log('Form validation check:', {
      formData,
      universityIdFile: !!universityIdFile,
      allFieldsFilled,
      phoneValid: validatePhone(formData.s_phone),
      nicValid: validateNIC(formData.s_NIC),
      dobValid: validateDateOfBirth(formData.s_dob),
      phone: formData.s_phone,
      nic: formData.s_NIC,
      dob: formData.s_dob
    })

    // For now, just check if all fields are filled - format validation will happen on submit
    return allFieldsFilled
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Comprehensive validation
    const newErrors = {}
    if (!formData.s_fname) newErrors.s_fname = 'First name is required'
    if (!formData.s_lname) newErrors.s_lname = 'Last name is required'
    if (!formData.s_uni) newErrors.s_uni = 'University is required'
    if (!formData.s_faculty) newErrors.s_faculty = 'Faculty is required'
    if (!formData.s_studyprogram) newErrors.s_studyprogram = 'Study program is required'
    if (!formData.s_uniID) newErrors.s_uniID = 'University ID is required'
    if (!formData.s_NIC) newErrors.s_NIC = 'NIC is required'
    if (!formData.s_gender) newErrors.s_gender = 'Gender is required'
    if (!formData.s_phone) newErrors.s_phone = 'Phone number is required'
    if (!formData.s_dob) newErrors.s_dob = 'Date of birth is required'
    if (!formData.s_homeaddress) newErrors.s_homeaddress = 'Home address is required'
    if (!universityIdFile) newErrors.universityIdFile = 'University ID document is required'

    // Additional validation
    if (formData.s_phone && !validatePhone(formData.s_phone)) {
      newErrors.s_phone = 'Please enter a valid 10-digit phone number'
    }
    if (formData.s_NIC && !validateNIC(formData.s_NIC)) {
      newErrors.s_NIC = 'Please enter a valid NIC number'
    }
    if (formData.s_dob && !validateDateOfBirth(formData.s_dob)) {
      newErrors.s_dob = 'Please enter a valid date of birth (age 16-100)'
    }

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      try {
        // Upload file first if provided
        let fileUrl = null
        if (universityIdFile) {
          const formDataFile = new FormData()
          formDataFile.append('file', universityIdFile)
          
          const uploadResponse = await api.post('/upload/image', formDataFile, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          
          if (uploadResponse.data.success) {
            fileUrl = uploadResponse.data.url || uploadResponse.data.secure_url
          } else {
            throw new Error('File upload failed')
          }
        }

        // Prepare data for student update
        const updateData = {
          ...formData,
          s_id_document: fileUrl
        }

        // Submit to backend
        const response = await api.put('/students/update', updateData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('studentToken')}`
          }
        })

        if (response.data.message === 'Student updated successfully') {
          toast.success('Profile verification submitted successfully! Your status is now Pending.')
          
          // Update user data in localStorage and state
          if (response.data.student) {
            const updatedUser = { ...user, ...response.data.student }
            setUser(updatedUser)
            localStorage.setItem('studentUser', JSON.stringify(updatedUser))
          }
          
          // Redirect to profile page after a short delay
          setTimeout(() => {
            navigate('/std-profile')
          }, 1500)
        } else {
          throw new Error(response.data.message || 'Update failed')
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error('Error submitting form. Please try again.')
        }
      }
    }
    
    setIsSubmitting(false)
  }

  const universities = [
    'University of Colombo',
    'University of Peradeniya',
    'University of Moratuwa',
    'University of Kelaniya',
    'University of Sri Jayewardenepura',
    'University of Ruhuna',
    'University of Jaffna',
    'University of Rajarata',
    'University of Sabaragamuwa',
    'University of Wayamba',
    'University of Uva Wellassa',
    'University of the Visual & Performing Arts',
    'Open University of Sri Lanka'
  ]

  const faculties = [
    'Faculty of Engineering',
    'Faculty of Science',
    'Faculty of Medicine',
    'Faculty of Arts',
    'Faculty of Management',
    'Faculty of Law',
    'Faculty of Agriculture',
    'Faculty of Veterinary Medicine',
    'Faculty of Education',
    'Faculty of Information Technology'
  ]

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CheckCircle className="w-4 h-4" />
              Profile Verification
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Verify Your
              <span className="text-primary block">Student Profile</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Complete your profile verification to access all platform features. 
              Provide your academic details and supporting documents for verification.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Verification Form */}
      <div className="container mx-auto px-4 pb-20">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Form</h2>
              <p className="text-gray-600">Please fill in all required information accurately</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="s_fname"
                      value={formData.s_fname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                        errors.s_fname ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.s_fname && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.s_fname}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="s_lname"
                      value={formData.s_lname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                        errors.s_lname ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.s_lname && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.s_lname}
                      </p>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gender *
                  </label>
                  <div className="flex gap-6">
                    {['Male', 'Female', 'Other'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="s_gender"
                          value={option}
                          checked={formData.s_gender === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.s_gender && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.s_gender}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="s_dob"
                    value={formData.s_dob}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.s_dob ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.s_dob && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.s_dob}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="s_phone"
                    value={formData.s_phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.s_phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.s_phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.s_phone}
                    </p>
                  )}
                </div>

                {/* NIC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National Identity Card (NIC) *
                  </label>
                  <input
                    type="text"
                    name="s_NIC"
                    value={formData.s_NIC}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.s_NIC ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your NIC number"
                  />
                  {errors.s_NIC && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.s_NIC}
                    </p>
                  )}
                </div>

                {/* Home Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Address *
                  </label>
                  <textarea
                    name="s_homeaddress"
                    value={formData.s_homeaddress}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none ${
                      errors.s_homeaddress ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete home address"
                  />
                  {errors.s_homeaddress && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.s_homeaddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Academic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* University */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University *
                    </label>
                    <select
                      name="s_uni"
                      value={formData.s_uni}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                        errors.s_uni ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your university</option>
                      {universities.map((uni) => (
                        <option key={uni} value={uni}>{uni}</option>
                      ))}
                    </select>
                    {errors.s_uni && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.s_uni}
                      </p>
                    )}
                  </div>

                  {/* Faculty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Faculty *
                    </label>
                    <select
                      name="s_faculty"
                      value={formData.s_faculty}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                        errors.s_faculty ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your faculty</option>
                      {faculties.map((faculty) => (
                        <option key={faculty} value={faculty}>{faculty}</option>
                      ))}
                    </select>
                    {errors.s_faculty && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.s_faculty}
                      </p>
                    )}
                  </div>
                </div>

                {/* Study Program */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Program *
                  </label>
                  <input
                    type="text"
                    name="s_studyprogram"
                    value={formData.s_studyprogram}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.s_studyprogram ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Computer Science, Engineering, Medicine"
                  />
                  {errors.s_studyprogram && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.s_studyprogram}
                    </p>
                  )}
                </div>

                {/* University ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University ID *
                  </label>
                  <input
                    type="text"
                    name="s_uniID"
                    value={formData.s_uniID}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.s_uniID ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your university student ID"
                  />
                  {errors.s_uniID && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.s_uniID}
                    </p>
                  )}
                </div>

                {/* University ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University ID Document *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-300">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload your University ID card or document</p>
                    <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, PDF (Max 5MB)</p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="universityIdFile"
                    />
                    <label
                      htmlFor="universityIdFile"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </label>
                    {universityIdFile && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {universityIdFile.name}
                      </p>
                    )}
                  </div>
                  {errors.universityIdFile && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.universityIdFile}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Status */}
              <div className="pt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Form Status</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Required Fields: {Object.values(formData).filter(v => v).length}/11</div>
                    <div>File Upload: {universityIdFile ? '✓ Uploaded' : '✗ Required'}</div>
                    <div>Form Valid: {isFormValid() ? '✓ Ready to Submit' : '✗ Please fill all fields'}</div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  whileHover={{ scale: isSubmitting || !isFormValid() ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting || !isFormValid() ? 1 : 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit for Verification
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default STD_HeroVerify