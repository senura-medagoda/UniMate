import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import axios from 'axios';
import { useHMAuth } from '@/context/HMAuthContext';
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  X, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  FileText,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Building2,
  Globe,
  Award,
  BookOpen,
  Lightbulb,
  Shield
} from 'lucide-react'

function HM_HeroNewjob({ user }) {
  const navigate = useNavigate();
  const { hm, token, makeAuthenticatedRequest } = useHMAuth();
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    jobType: '',
    location: '',
    pay: '',
    applicationDeadline: '',
    description: '',
    requirements: '',
    responsibilities: '',
    qualifications: '',
    benefits: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!hm) {
      alert('Please log in to create a job posting.');
      return;
    }

    setLoading(true);
    
    try {
      // Map frontend field names to backend field names
      const jobData = {
        title: formData.title,
        department: formData.department,
        jobtype: formData.jobType, // Map jobType to jobtype
        location: formData.location,
        compensation: formData.pay, // Map pay to compensation
        deadline: formData.applicationDeadline, // Map applicationDeadline to deadline
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities,
        benefits: formData.benefits
        // postedby will be set by the backend from the authenticated user
      };

      console.log('Submitting job data:', jobData);
      console.log('HM token available:', !!token);
      console.log('HM data:', hm);

      const response = await makeAuthenticatedRequest('http://localhost:5001/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const result = await response.json();
      console.log('Response result:', result);

      if (response.status === 201 && result.success) {
        alert('Job position created successfully!');
        navigate('/myjobs');
      } else {
        console.error('Job creation failed:', result);
        throw new Error(result.message || 'Failed to create job posting');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      console.error('Error details:', error.message);
      
      let errorMessage = 'Failed to create job posting. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/hmdash');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const jobTypes = [
    { value: 'On-Campus', label: 'On-Campus', icon: <Building2 className="w-4 h-4" /> },
    { value: 'Internship', label: 'Internship', icon: <BookOpen className="w-4 h-4" /> },
    { value: 'Part-Time', label: 'Part-Time', icon: <Clock className="w-4 h-4" /> },
    { value: 'Work-Study', label: 'Work-Study', icon: <Award className="w-4 h-4" /> },
    { value: 'Research', label: 'Research', icon: <Lightbulb className="w-4 h-4" /> },
    { value: 'Remote', label: 'Remote', icon: <Globe className="w-4 h-4" /> }
  ];

  const stepTitles = [
    'Basic Information',
    'Job Description',
    'Requirements & Responsibilities',
    'Review & Submit'
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
            currentStep > index + 1 
              ? 'bg-green-500 text-white' 
              : currentStep === index + 1 
              ? 'text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}
          style={{
            background: currentStep === index + 1 
              ? 'linear-gradient(to right, #fc944c, #f97316)' 
              : currentStep > index + 1 
              ? '#10b981' 
              : '#e5e7eb'
          }}>
            {currentStep > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Job Title *
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Software Developer Intern"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Department *
                  </span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Computer Science Department"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Job Type *</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {jobTypes.map((type) => (
                    <label key={type.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="jobType"
                        value={type.value}
                        checked={formData.jobType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                        formData.jobType === type.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        {type.icon}
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location *
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Main Campus, Science Building"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Compensation *
                  </span>
                </label>
                <input
                  type="text"
                  name="pay"
                  value={formData.pay}
                  onChange={handleInputChange}
                  className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., $15/hr, Stipend + Housing, Course Credit"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Application Deadline *
                  </span>
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="input input-bordered w-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">Cannot select past dates</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Position Overview *
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-32 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe the role, its purpose, and how it contributes to your department..."
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Key Responsibilities *
                </span>
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-32 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="List the main duties and responsibilities for this position..."
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Benefits & Perks
                </span>
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-24 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="List any benefits, perks, or additional opportunities..."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Required Qualifications *
                </span>
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-32 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="List the required skills, education, experience, and qualifications..."
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Preferred Qualifications
                </span>
              </label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full h-32 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="List any preferred skills or qualifications that would be nice to have..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Review Your Job Posting</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Job Title</label>
                    <p className="text-gray-900">{formData.title || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Department</label>
                    <p className="text-gray-900">{formData.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Job Type</label>
                    <p className="text-gray-900">{formData.jobType || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Location</label>
                    <p className="text-gray-900">{formData.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Compensation</label>
                    <p className="text-gray-900">{formData.pay || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Deadline</label>
                    <p className="text-gray-900">{formData.applicationDeadline || 'Not specified'}</p>
                  </div>
                </div>
                
                {formData.description && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Description</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.description}</p>
                  </div>
                )}
                
                {formData.responsibilities && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Responsibilities</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.responsibilities}</p>
                  </div>
                )}
                
                {formData.requirements && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Requirements</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.requirements}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button 
            onClick={handleBack}
            className="mr-6 p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </motion.button>
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Create <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(to right, #fc944c, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>New Job</span>
            </h1>
            <p className="text-lg text-gray-600 mt-2">Post a new job opportunity for students</p>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {renderStepIndicator()}
        </motion.div>

        {/* Form Container */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Step Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                {currentStep}
              </div>
              {stepTitles[currentStep - 1]}
            </h2>
            <p className="text-orange-100 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {renderStepContent()}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
                whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <div className="flex gap-3">
                {currentStep < totalSteps ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                    style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next Step
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-8 py-3 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ background: 'linear-gradient(to right, #fc944c, #f97316)' }}
                    whileHover={!loading ? { scale: 1.05 } : {}}
                    whileTap={!loading ? { scale: 0.95 } : {}}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Create Job Posting
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HM_HeroNewjob;