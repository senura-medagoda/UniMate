// SM - Study Material Admin Dashboard
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaFileUpload, FaComments, FaExclamationTriangle, FaChartBar, FaCog, FaTrash, FaEye, FaCheck, FaTimes, FaSearch, FaUser, FaBook, FaArrowUp, FaArrowDown, FaDownload, FaHeart, FaStar, FaFilePdf, FaSignOutAlt, FaUniversity, FaPlus, FaEdit, FaSave, FaTimes as FaClose, FaCalendar, FaChartLine, FaChevronDown, FaFileExcel, FaFileCsv, FaPrint } from "react-icons/fa";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const SMAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMaterials: 0,
    totalPosts: 0,
    totalComplaints: 0,
    pendingApprovals: 0
  });
  const [materials, setMaterials] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showComplaintDetail, setShowComplaintDetail] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Student Messages states
  const [studentMessages, setStudentMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  
  // System Management states
  const [systemLoading, setSystemLoading] = useState(false);
  
  // System data states
  const [systemData, setSystemData] = useState({
    campuses: [],
    courses: [],
    years: [],
    semesters: [],
    subjects: []
  });
  const [activeSystemTab, setActiveSystemTab] = useState('campuses');
  
  // Form states for Years and Semesters
  const [yearForm, setYearForm] = useState({ year: '', name: '' });
  const [semesterForm, setSemesterForm] = useState({ semester: '', name: '' });
  
  // Edit states for all system data
  const [editingCampus, setEditingCampus] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  
  // Edit form states
  const [editCampusName, setEditCampusName] = useState('');
  const [editCourseName, setEditCourseName] = useState('');
  const [editYearForm, setEditYearForm] = useState({ year: '', name: '' });
  const [editSemesterForm, setEditSemesterForm] = useState({ semester: '', name: '' });
  const [editSubjectName, setEditSubjectName] = useState('');
  
  // Chart data states
  const [chartData, setChartData] = useState({
    campusData: [],
    subjectData: [],
    monthlyData: [],
    ratingData: [],
    userActivityData: []
  });

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('smAdminToken');
    const admin = localStorage.getItem('smAdminData');
    
    if (!token || !admin) {
      navigate('/SMAdminLogin', { replace: true });
      return;
    }
    
    try {
      setAdminData(JSON.parse(admin));
    } catch (error) {
      console.error('Error parsing admin data:', error);
      localStorage.removeItem('smAdminToken');
      localStorage.removeItem('smAdminData');
      navigate('/SMAdminLogin', { replace: true });
    }
  }, [navigate]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "overview") {
        fetchDashboardData();
        prepareChartData();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [activeTab]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('smAdminToken');
    localStorage.removeItem('smAdminData');
    navigate('/SMAdminLogin', { replace: true });
  };


  // System Data Management Functions
  const fetchSystemData = async () => {
    setSystemLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/system-data/all');
      const data = await response.json();
      if (data.success) {
        setSystemData(data.data);
      }
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const addCampus = async (name) => {
    if (!name.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/system-data/campuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      
      if (response.ok) {
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error adding campus:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const addCourse = async (name) => {
    if (!name.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/system-data/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      
      if (response.ok) {
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error adding course:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const addYear = async () => {
    if (!yearForm.year || !yearForm.name.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/system-data/years', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year: parseInt(yearForm.year), name: yearForm.name.trim() }),
      });
      
      if (response.ok) {
        setYearForm({ year: '', name: '' });
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error adding year:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const addSemester = async () => {
    if (!semesterForm.semester || !semesterForm.name.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/system-data/semesters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semester: parseInt(semesterForm.semester), name: semesterForm.name.trim() }),
      });
      
      if (response.ok) {
        setSemesterForm({ semester: '', name: '' });
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error adding semester:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  // Edit functions
  const startEditCampus = (campus) => {
    setEditingCampus(campus._id);
    setEditCampusName(campus.name);
  };

  const startEditCourse = (course) => {
    setEditingCourse(course._id);
    setEditCourseName(course.name);
  };

  const startEditYear = (year) => {
    setEditingYear(year._id);
    setEditYearForm({ year: year.year.toString(), name: year.name });
  };

  const startEditSemester = (semester) => {
    setEditingSemester(semester._id);
    setEditSemesterForm({ semester: semester.semester.toString(), name: semester.name });
  };

  // Update functions
  const updateCampus = async () => {
    if (!editCampusName.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/campuses/${editingCampus}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editCampusName.trim() }),
      });
      
      if (response.ok) {
        setEditingCampus(null);
        setEditCampusName('');
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error updating campus:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const updateCourse = async () => {
    if (!editCourseName.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/courses/${editingCourse}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editCourseName.trim() }),
      });
      
      if (response.ok) {
        setEditingCourse(null);
        setEditCourseName('');
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error updating course:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const updateYear = async () => {
    if (!editYearForm.year || !editYearForm.name.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/years/${editingYear}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year: parseInt(editYearForm.year), name: editYearForm.name.trim() }),
      });
      
      if (response.ok) {
        setEditingYear(null);
        setEditYearForm({ year: '', name: '' });
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error updating year:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const updateSemester = async () => {
    if (!editSemesterForm.semester || !editSemesterForm.name.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/semesters/${editingSemester}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semester: parseInt(editSemesterForm.semester), name: editSemesterForm.name.trim() }),
      });
      
      if (response.ok) {
        setEditingSemester(null);
        setEditSemesterForm({ semester: '', name: '' });
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error updating semester:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  // Delete functions
  const deleteCampus = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campus?')) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/campuses/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error deleting campus:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/courses/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const deleteYear = async (id) => {
    if (!window.confirm('Are you sure you want to delete this year?')) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/years/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error deleting year:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const deleteSemester = async (id) => {
    if (!window.confirm('Are you sure you want to delete this semester?')) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/semesters/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error deleting semester:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  // Cancel edit functions
  const cancelEditCampus = () => {
    setEditingCampus(null);
    setEditCampusName('');
  };

  const cancelEditCourse = () => {
    setEditingCourse(null);
    setEditCourseName('');
  };

  const cancelEditYear = () => {
    setEditingYear(null);
    setEditYearForm({ year: '', name: '' });
  };

  const cancelEditSemester = () => {
    setEditingSemester(null);
    setEditSemesterForm({ semester: '', name: '' });
  };

  // Subject management functions
  const addSubject = async (name) => {
    if (!name.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/system-data/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      
      if (response.ok) {
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const startEditSubject = (subject) => {
    setEditingSubject(subject._id);
    setEditSubjectName(subject.name);
  };

  const updateSubject = async () => {
    if (!editSubjectName.trim()) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/subjects/${editingSubject}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editSubjectName.trim() }),
      });
      
      if (response.ok) {
        setEditingSubject(null);
        setEditSubjectName('');
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error updating subject:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    
    setSystemLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/system-data/subjects/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchSystemData();
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    } finally {
      setSystemLoading(false);
    }
  };

  const cancelEditSubject = () => {
    setEditingSubject(null);
    setEditSubjectName('');
  };

  // Enhanced chart data preparation with better analytics
  const prepareChartData = () => {
    // Campus data for pie chart with enhanced colors and statistics
    const campusCounts = {};
    const campusDownloads = {};
    const campusRatings = {};
    
    materials.forEach(material => {
      const campus = material.campus || 'Unknown';
      campusCounts[campus] = (campusCounts[campus] || 0) + 1;
      campusDownloads[campus] = (campusDownloads[campus] || 0) + (material.downloadCount || 0);
      campusRatings[campus] = (campusRatings[campus] || 0) + (material.rating || 0);
    });
    
    const campusData = Object.entries(campusCounts).map(([campus, count]) => ({
      name: campus,
      value: count,
      downloads: campusDownloads[campus] || 0,
      avgRating: (campusRatings[campus] || 0) / count,
      fill: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'][Object.keys(campusCounts).indexOf(campus) % 8]
    }));

    // Enhanced subject data with more metrics
    const subjectCounts = {};
    const subjectDownloads = {};
    const subjectLikes = {};
    
    materials.forEach(material => {
      const subject = material.subject || 'Unknown';
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      subjectDownloads[subject] = (subjectDownloads[subject] || 0) + (material.downloadCount || 0);
      subjectLikes[subject] = (subjectLikes[subject] || 0) + (material.likeCount || 0);
    });
    
    const subjectData = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([subject, count]) => ({
        subject: subject.length > 15 ? subject.substring(0, 15) + '...' : subject,
        materials: count,
        downloads: subjectDownloads[subject] || 0,
        likes: subjectLikes[subject] || 0,
        engagement: ((subjectLikes[subject] || 0) + (subjectDownloads[subject] || 0)) / count
      }));

    // Enhanced monthly data with trends and predictions
    const monthlyCounts = {};
    const monthlyDownloads = {};
    const monthlyLikes = {};
    
    materials.forEach(material => {
      const date = new Date(material.createdAt);
      const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      monthlyDownloads[month] = (monthlyDownloads[month] || 0) + (material.downloadCount || 0);
      monthlyLikes[month] = (monthlyLikes[month] || 0) + (material.likeCount || 0);
    });
    
    const monthlyData = Object.entries(monthlyCounts)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([month, count]) => ({
        month,
        uploads: count,
        downloads: monthlyDownloads[month] || 0,
        likes: monthlyLikes[month] || 0,
        engagement: ((monthlyLikes[month] || 0) + (monthlyDownloads[month] || 0)) / count
      }));

    // Enhanced rating distribution with more granular data
    const ratingRanges = [
      { range: '0-1', min: 0, max: 1, count: 0, color: '#FF6B6B' },
      { range: '1-2', min: 1, max: 2, count: 0, color: '#FFB347' },
      { range: '2-3', min: 2, max: 3, count: 0, color: '#FFEAA7' },
      { range: '3-4', min: 3, max: 4, count: 0, color: '#45B7D1' },
      { range: '4-5', min: 4, max: 5, count: 0, color: '#4ECDC4' }
    ];
    
    materials.forEach(material => {
      const rating = material.rating || 0;
      const range = ratingRanges.find(r => rating >= r.min && rating < r.max);
      if (range) range.count++;
    });
    
    const ratingData = ratingRanges.map(range => ({
      range: range.range,
      count: range.count,
      percentage: materials.length > 0 ? ((range.count / materials.length) * 100).toFixed(1) : 0,
      fill: range.color
    }));

    // Enhanced user activity data with more metrics
    const userActivityData = users
      .map(user => ({
        name: (user.name || user.email.split('@')[0]).substring(0, 12),
        materials: user.materialsCount || 0,
        posts: user.postsCount || 0,
        downloads: user.totalDownloads || 0,
        likes: user.totalLikes || 0,
        rating: user.averageRating || 0,
        engagement: ((user.totalDownloads || 0) + (user.totalLikes || 0)) / Math.max(user.materialsCount || 1, 1)
      }))
      .sort((a, b) => (b.materials + b.posts) - (a.materials + a.posts))
      .slice(0, 10);

    // Add trend analysis
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    const currentMonthUploads = monthlyCounts[currentMonth] || 0;
    const lastMonthUploads = monthlyCounts[lastMonth] || 0;
    const uploadTrend = lastMonthUploads > 0 ? ((currentMonthUploads - lastMonthUploads) / lastMonthUploads * 100).toFixed(1) : 0;

    setChartData({
      campusData,
      subjectData,
      monthlyData,
      ratingData,
      userActivityData,
      trends: {
        uploadTrend: parseFloat(uploadTrend),
        totalEngagement: materials.reduce((sum, m) => sum + (m.likeCount || 0) + (m.downloadCount || 0), 0),
        avgRating: materials.length > 0 ? materials.reduce((sum, m) => sum + (m.rating || 0), 0) / materials.length : 0
      }
    });
  };

  // Function to capture chart as image
  const captureChartAsImage = async (chartElementId) => {
    try {
      const element = document.getElementById(chartElementId);
      if (!element) return null;
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing chart:', error);
      return null;
    }
  };

  // Generate PDF Report - Simplified and Fixed
  const generatePDFReport = async () => {
    setPdfLoading(true);
    setExportProgress(0);
    setShowExportModal(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Simple header
      setExportProgress(10);
      pdf.setFillColor(255, 140, 0);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Study Material Admin Dashboard Report', pageWidth / 2, 20, { align: 'center' });
      
      // Date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });
      
      setExportProgress(20);
      let yPosition = 50;
      
      // Executive Summary
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Executive Summary', 20, yPosition);
      yPosition += 10;
      
      const totalDownloads = materials.reduce((sum, m) => sum + (m.downloadCount || 0), 0);
      const avgRating = materials.length > 0 ? materials.reduce((sum, m) => sum + (m.rating || 0), 0) / materials.length : 0;
      
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Total Materials: ${materials.length}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Total Downloads: ${totalDownloads}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Average Rating: ${avgRating.toFixed(1)}/5.0`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Active Users: ${users.length}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Forum Posts: ${forumPosts.length}`, 20, yPosition);
      yPosition += 15;
      setExportProgress(40);
      
      // Campus Distribution
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Materials by Campus', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      const campusCounts = {};
      materials.forEach(material => {
        campusCounts[material.campus] = (campusCounts[material.campus] || 0) + 1;
      });
      
      Object.entries(campusCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([campus, count]) => {
          const percentage = ((count / materials.length) * 100).toFixed(1);
          pdf.text(`${campus}: ${count} materials (${percentage}%)`, 20, yPosition);
          yPosition += 8;
        });
      yPosition += 10;
      setExportProgress(60);
      
      // Top Subjects
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Top Subjects', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      const subjectCounts = {};
      materials.forEach(material => {
        subjectCounts[material.subject] = (subjectCounts[material.subject] || 0) + 1;
      });
      
      Object.entries(subjectCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .forEach(([subject, count], index) => {
          pdf.text(`${index + 1}. ${subject}: ${count} materials`, 20, yPosition);
          yPosition += 8;
        });
      yPosition += 15;
      
      // Top Rated Materials
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Top Rated Materials', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      materials
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 8)
        .forEach((material, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(`${index + 1}. ${material.title}`, 20, yPosition);
          pdf.text(`   Rating: ${material.rating?.toFixed(1) || 0}/5.0 | Downloads: ${material.downloadCount || 0}`, 20, yPosition + 6);
          yPosition += 12;
        });
      yPosition += 15;
      
      // Top Contributing Users
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Top Contributing Users', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      users
        .sort((a, b) => (b.materialsCount || 0) - (a.materialsCount || 0))
        .slice(0, 8)
        .forEach((user, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(`${index + 1}. ${user.name || user.email}`, 20, yPosition);
          pdf.text(`   Materials: ${user.materialsCount || 0} | Posts: ${user.postsCount || 0}`, 20, yPosition + 6);
          yPosition += 12;
        });
      yPosition += 15;
      
      // Recommendations
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Recommendations', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      
      const recommendations = [];
      if (materials.length < 10) recommendations.push('• Encourage more material uploads');
      if (totalDownloads < 50) recommendations.push('• Promote the platform to increase engagement');
      if (forumPosts.length < 5) recommendations.push('• Create discussion topics to boost activity');
      if (complaints.length > 5) recommendations.push('• Review and address user complaints');
      if (avgRating < 3.0) recommendations.push('• Focus on improving material quality');
      
      if (recommendations.length === 0) {
        recommendations.push('• System is performing well, continue current strategies');
      }
      
      recommendations.forEach(rec => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(rec, 20, yPosition);
        yPosition += 8;
      });
      
      // Add simple footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
      
      setExportProgress(90);
      
      // Save the PDF
      const fileName = `SM_Admin_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      setExportProgress(100);
      setTimeout(() => {
        setShowExportModal(false);
        setExportProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  // Generate Excel Report
  const generateExcelReport = async () => {
    try {
      // Create Excel-like data structure
      const excelData = {
        'Executive Summary': [
          ['Metric', 'Value'],
          ['Total Materials', materials.length],
          ['Total Downloads', materials.reduce((sum, m) => sum + (m.downloadCount || 0), 0)],
          ['Average Rating', materials.length > 0 ? (materials.reduce((sum, m) => sum + (m.rating || 0), 0) / materials.length).toFixed(1) : 0],
          ['Active Users', users.length],
          ['Forum Posts', forumPosts.length]
        ],
        'Materials by Campus': [
          ['Campus', 'Count', 'Percentage'],
          ...Object.entries(
            materials.reduce((acc, material) => {
              acc[material.campus] = (acc[material.campus] || 0) + 1;
              return acc;
            }, {})
          )
          .sort(([,a], [,b]) => b - a)
          .map(([campus, count]) => [campus, count, `${((count / materials.length) * 100).toFixed(1)}%`])
        ],
        'Top Materials': [
          ['Rank', 'Title', 'Subject', 'Campus', 'Rating', 'Downloads'],
          ...materials
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 20)
            .map((material, index) => [
              index + 1,
              material.title,
              material.subject,
              material.campus,
              material.rating?.toFixed(1) || 0,
              material.downloadCount || 0
            ])
        ],
        'User Activity': [
          ['Name', 'Email', 'Materials Count', 'Posts Count', 'Average Rating', 'Campus'],
          ...users
            .sort((a, b) => (b.materialsCount || 0) - (a.materialsCount || 0))
            .slice(0, 20)
            .map(user => [
              user.name || 'N/A',
              user.email,
              user.materialsCount || 0,
              user.postsCount || 0,
              user.averageRating?.toFixed(1) || 0,
              user.campus || 'N/A'
            ])
        ]
      };

      // Convert to CSV format and download
      const csvContent = Object.entries(excelData)
        .map(([sheetName, data]) => {
          const sheetContent = [
            `=== ${sheetName} ===`,
            ...data.map(row => row.join(',')),
            ''
          ].join('\n');
          return sheetContent;
        }).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `SM_Admin_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating Excel report:', error);
      alert('Error generating Excel report. Please try again.');
    }
  };

  // Generate CSV Report
  const generateCSVReport = async () => {
    try {
      const csvData = [
        ['Type', 'Name', 'Subject', 'Campus', 'Rating', 'Downloads', 'Date'],
        ...materials.map(material => [
          'Material',
          material.title,
          material.subject,
          material.campus,
          material.rating?.toFixed(1) || 0,
          material.downloadCount || 0,
          new Date(material.createdAt).toLocaleDateString()
        ]),
        ...users.map(user => [
          'User',
          user.name || user.email,
          'N/A',
          user.campus || 'N/A',
          user.averageRating?.toFixed(1) || 0,
          user.materialsCount || 0,
          new Date(user.createdAt).toLocaleDateString()
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `SM_Data_Export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating CSV report:', error);
      alert('Error generating CSV report. Please try again.');
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch materials for moderation
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/study-materials/all');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch forum posts for moderation
  const fetchForumPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/forum/posts');
      const data = await response.json();
      setForumPosts(data);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === "materials") fetchMaterials();
    if (activeTab === "forum") fetchForumPosts();
    if (activeTab === "complaints") fetchComplaints();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "reports") {
      fetchMaterials();
      fetchForumPosts();
      fetchUsers();
    }
    if (activeTab === "system") {
      fetchSystemData();
    }
  }, [activeTab]);

  // Prepare chart data when materials, users, or forum posts change
  useEffect(() => {
    if (materials.length > 0 || users.length > 0 || forumPosts.length > 0) {
      prepareChartData();
    }
  }, [materials, users, forumPosts]);

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/admin/materials/${materialId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchMaterials();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/admin/forum/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchForumPosts();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleResolveComplaint = async (complaintId, status) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchComplaints();
        fetchStats();
      }
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/ban`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  // Fetch complaint details (material or user)
  const fetchComplaintDetails = async (complaint) => {
    setDetailLoading(true);
    setSelectedComplaint(complaint);
    setShowComplaintDetail(true);
    
    try {
      let details = null;
      
      if (complaint.type === 'material' && complaint.againstMaterial) {
        // Fetch material details
        const response = await fetch(`http://localhost:5001/api/study-materials/${complaint.againstMaterial}`);
        if (response.ok) {
          details = await response.json();
        }
      } else if (complaint.type === 'user' && complaint.againstUser) {
        // Fetch user details
        const response = await fetch(`http://localhost:5001/api/admin/users/${complaint.againstUser}`);
        if (response.ok) {
          details = await response.json();
        }
      } else if (complaint.type === 'forum_post' && complaint.againstPost) {
        // Fetch forum post details
        const response = await fetch(`http://localhost:5001/api/forum/posts/${complaint.againstPost}`);
        if (response.ok) {
          details = await response.json();
        }
      }
      
      setComplaintDetails(details);
    } catch (error) {
      console.error('Error fetching complaint details:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Student Messages Functions
  const loadStudentMessages = async () => {
    setMessagesLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/student-messages/admin/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('smAdminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudentMessages(data.data || []);
      } else {
        console.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const acceptMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/student-messages/admin/accept/${messageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('smAdminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        loadStudentMessages(); // Reload messages
      } else {
        console.error('Failed to accept message');
      }
    } catch (error) {
      console.error('Error accepting message:', error);
    }
  };

  const rejectMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/student-messages/admin/reject/${messageId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('smAdminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        loadStudentMessages(); // Reload messages
      } else {
        console.error('Failed to reject message');
      }
    } catch (error) {
      console.error('Error rejecting message:', error);
    }
  };


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 min-w-0">
      {/* Sidebar */}
      <div className="w-1/6 bg-gray-800 text-white p-4 flex-shrink-0 fixed h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
          <FaCog className="mr-2" />
          Admin Dashboard
        </h2>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Logout"
          >
            <FaSignOutAlt className="text-lg" />
          </button>
        </div>
        
        {/* Admin Info */}
        {adminData && (
          <div className="mb-6 p-3 bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-300">Logged in as:</p>
            <p className="text-white font-medium">{adminData.name || adminData.email}</p>
          </div>
        )}
        
        <nav className="space-y-2">
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "overview" ? "bg-orange-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartBar className="mr-2" />
            Overview
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "materials" ? "bg-orange-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("materials")}
          >
            <FaFileUpload className="mr-2" />
            Materials Moderation
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "forum" ? "bg-orange-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("forum")}
          >
            <FaComments className="mr-2" />
            Forum Moderation
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "complaints" ? "bg-orange-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("complaints")}
          >
            <FaExclamationTriangle className="mr-2" />
            Complaints
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "users" ? "bg-orange-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers className="mr-2" />
            User Management
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "reports" ? "bg-orange-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("reports")}
          >
            <FaChartBar className="mr-2" />
            Reports
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "system" ? "bg-orange-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("system")}
          >
            <FaUniversity className="mr-2" />
            System Management
          </button>
          
          <button
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center ${
              activeTab === "messages" ? "bg-orange-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            <FaComments className="mr-2" />
            Student Messages
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden min-w-0" style={{marginLeft: '16.666667%'}}>
        {/* Overview Dashboard */}
        {activeTab === "overview" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Dashboard Overview</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleString()}
                </div>
                <button
                  onClick={async () => {
                    setRefreshing(true);
                    try {
                      await fetchDashboardData();
                      prepareChartData();
                      setLastUpdated(new Date());
                    } finally {
                      setRefreshing(false);
                    }
                  }}
                  disabled={refreshing}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {refreshing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <FaChartBar className="mr-2" />
                      Refresh Data
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    <div className="flex items-center mt-2 text-blue-100">
                      <FaArrowUp className="mr-1 text-xs" />
                      <span className="text-sm">+5% this month</span>
                    </div>
                  </div>
                  <FaUsers className="text-4xl text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Materials</p>
                    <p className="text-3xl font-bold">{stats.totalMaterials}</p>
                    <div className="flex items-center mt-2 text-green-100">
                      <FaArrowUp className="mr-1 text-xs" />
                      <span className="text-sm">+12% this month</span>
                    </div>
                  </div>
                  <FaFileUpload className="text-4xl text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Forum Posts</p>
                    <p className="text-3xl font-bold">{stats.totalPosts}</p>
                    <div className="flex items-center mt-2 text-purple-100">
                      <FaArrowUp className="mr-1 text-xs" />
                      <span className="text-sm">+15% this month</span>
                    </div>
                  </div>
                  <FaComments className="text-4xl text-purple-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Complaints</p>
                    <p className="text-3xl font-bold">{stats.totalComplaints}</p>
                    <div className="flex items-center mt-2 text-red-100">
                      <FaArrowDown className="mr-1 text-xs" />
                      <span className="text-sm">-8% this month</span>
                    </div>
                  </div>
                  <FaExclamationTriangle className="text-4xl text-red-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Pending Approvals</p>
                    <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                    <div className="flex items-center mt-2 text-orange-100">
                      <FaArrowUp className="mr-1 text-xs" />
                      <span className="text-sm">+3% this month</span>
                    </div>
                  </div>
                  <FaCog className="text-4xl text-orange-200" />
                </div>
              </div>
            </div>

            {/* Enhanced Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Campus Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaBook className="mr-2 text-blue-500" />
                  Materials by Campus
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.campusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.campusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subject Analytics */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaChartBar className="mr-2 text-green-500" />
                  Top Subjects by Materials
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.subjectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="subject" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="materials" fill="#4ECDC4" name="Materials" />
                      <Bar dataKey="downloads" fill="#45B7D1" name="Downloads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Upload Trends */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaArrowUp className="mr-2 text-purple-500" />
                  Monthly Upload Trends
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="uploads" 
                        stackId="1" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        name="Uploads"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="downloads" 
                        stackId="2" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        name="Downloads"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaStar className="mr-2 text-yellow-500" />
                  Rating Distribution
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.ratingData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="range" type="category" width={60} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FF6B6B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Engagement Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Engagement Over Time */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaChartLine className="mr-2 text-indigo-500" />
                  Engagement Trends
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="#8884d8" 
                        strokeWidth={3}
                        name="Engagement Score"
                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="likes" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Likes"
                        dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Campus Performance Comparison */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaUniversity className="mr-2 text-teal-500" />
                  Campus Performance
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.campusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4ECDC4" name="Materials" />
                      <Bar dataKey="downloads" fill="#45B7D1" name="Downloads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Materials Performance */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaHeart className="mr-2 text-red-500" />
                  Top Performing Materials
                </h3>
                <div className="space-y-4">
                  {materials
                    .sort((a, b) => ((b.downloadCount || 0) + (b.likeCount || 0)) - ((a.downloadCount || 0) + (a.likeCount || 0)))
                    .slice(0, 5)
                    .map((material, index) => (
                    <div key={material._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{material.title.length > 30 ? material.title.substring(0, 30) + '...' : material.title}</p>
                          <p className="text-xs text-gray-500">{material.subject} • {material.campus}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-500 text-sm">
                          <FaDownload className="mr-1" />
                          <span className="font-bold">{material.downloadCount || 0}</span>
                        </div>
                        <div className="flex items-center text-red-500 text-sm">
                          <FaHeart className="mr-1" />
                          <span>{material.likeCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Engagement Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaUsers className="mr-2 text-indigo-500" />
                  Top Active Users
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={10}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="materials" fill="#4ECDC4" name="Materials" />
                      <Bar dataKey="posts" fill="#45B7D1" name="Posts" />
                      <Bar dataKey="downloads" fill="#96CEB4" name="Downloads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* System Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">System Health</p>
                    <p className="text-3xl font-bold">98.5%</p>
                    <div className="flex items-center mt-2 text-emerald-100">
                      <FaArrowUp className="mr-1 text-xs" />
                      <span className="text-sm">+2.1% this week</span>
                    </div>
                  </div>
                  <FaChartLine className="text-4xl text-emerald-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm font-medium">Avg. Response Time</p>
                    <p className="text-3xl font-bold">1.2s</p>
                    <div className="flex items-center mt-2 text-cyan-100">
                      <FaArrowDown className="mr-1 text-xs" />
                      <span className="text-sm">-0.3s this week</span>
                    </div>
                  </div>
                  <FaCog className="text-4xl text-cyan-200" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-100 text-sm font-medium">User Satisfaction</p>
                    <p className="text-3xl font-bold">4.7/5</p>
                    <div className="flex items-center mt-2 text-violet-100">
                      <FaStar className="mr-1 text-xs" />
                      <span className="text-sm">Based on {materials.length} reviews</span>
                    </div>
                  </div>
                  <FaStar className="text-4xl text-violet-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg border">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab("materials")}
                  className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaFileUpload className="text-3xl mx-auto mb-3" />
                  <p className="text-sm font-medium">Moderate Materials</p>
                </button>
                
                <button
                  onClick={() => setActiveTab("forum")}
                  className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaComments className="text-3xl mx-auto mb-3" />
                  <p className="text-sm font-medium">Moderate Forum</p>
                </button>
                
                <button
                  onClick={() => setActiveTab("complaints")}
                  className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaExclamationTriangle className="text-3xl mx-auto mb-3" />
                  <p className="text-sm font-medium">Handle Complaints</p>
                </button>
                
                <button
                  onClick={() => setActiveTab("reports")}
                  className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <FaChartBar className="text-3xl mx-auto mb-3" />
                  <p className="text-sm font-medium">Generate Reports</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Materials Moderation */}
        {activeTab === "materials" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Materials Moderation</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4">Loading materials...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <div key={material._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{material.title}</h3>
                        <p className="text-gray-600 mb-3">{material.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>By {material.uploadedBy}</span>
                          <span>{formatDate(material.createdAt)}</span>
                          <span>{material.campus} | {material.course}</span>
                          <span>Year {material.year} | Sem {material.semester}</span>
                          <span>{material.subject}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>👍 {material.likeCount || 0}</span>
                          <span>👎 {material.unlikeCount || 0}</span>
                          <span>⭐ {material.rating?.toFixed(1) || 0}</span>
                          <span>📥 {material.downloadCount || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button className="text-orange-500 hover:text-orange-700">
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleDeleteMaterial(material._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Forum Moderation */}
        {activeTab === "forum" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Forum Moderation</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4">Loading forum posts...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-3">{post.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>By {post.author}</span>
                          <span>{formatDate(post.createdAt)}</span>
                          <span>{post.campus} | {post.course}</span>
                          <span>Year {post.year} | Sem {post.semester}</span>
                          <span>{post.subject}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>👍 {post.likes || 0}</span>
                          <span>👎 {post.dislikes || 0}</span>
                          <span>💬 {post.commentCount || 0}</span>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag, index) => (
                              <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button className="text-orange-500 hover:text-orange-700">
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Complaints Management */}
        {activeTab === "complaints" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Complaints Management</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4">Loading complaints...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-bold text-gray-800">{complaint.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{complaint.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>Reported by: {complaint.reportedBy}</span>
                          <span>Against: {complaint.againstUser || complaint.againstMaterial}</span>
                          <span>{formatDate(complaint.createdAt)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p><strong>Type:</strong> {complaint.type}</p>
                          <p><strong>Category:</strong> {complaint.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button 
                          onClick={() => fetchComplaintDetails(complaint)}
                          className="text-orange-500 hover:text-orange-700"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleResolveComplaint(complaint._id, 'resolved')}
                          className="text-green-500 hover:text-green-700"
                          title="Resolve"
                        >
                          <FaCheck />
                        </button>
                        <button 
                          onClick={() => handleResolveComplaint(complaint._id, 'rejected')}
                          className="text-red-500 hover:text-red-700"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-3xl font-bold mb-6">User Management</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-4">Loading users...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{user.name || user.email}</h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>Email: {user.email}</span>
                          <span>Role: {user.role}</span>
                          <span>Status: {user.status}</span>
                          <span>Joined: {formatDate(user.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📁 Materials: {user.materialsCount || 0}</span>
                          <span>💬 Posts: {user.postsCount || 0}</span>
                          <span>⭐ Rating: {user.averageRating?.toFixed(1) || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <button className="text-orange-500 hover:text-orange-700">
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleBanUser(user._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reports */}
        {activeTab === "reports" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold flex items-center">
                <FaChartBar className="mr-3 text-orange-500" />
                Reports & Analytics
              </h2>
              
              {/* Modern Export Options */}
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <button
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaDownload className="mr-2" />
                    Export Data
                    <FaChevronDown className="ml-2 text-xs" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={generatePDFReport}
                        disabled={pdfLoading}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      >
                        {pdfLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500 mr-3"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <FaFilePdf className="mr-3 text-red-500" />
                            PDF Report
                          </>
                        )}
                      </button>
                      <button
                        onClick={generateExcelReport}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      >
                        <FaFileExcel className="mr-3 text-green-500" />
                        Excel Spreadsheet
                      </button>
                      <button
                        onClick={generateCSVReport}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                      >
                        <FaFileCsv className="mr-3 text-blue-500" />
                        CSV Data
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <button
                  onClick={() => window.print()}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-lg"
                >
                  <FaPrint className="mr-2" />
                  Print
                </button>
              </div>
            </div>
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                      <div>
                    <p className="text-blue-100 text-sm font-medium">Total Materials</p>
                    <p className="text-3xl font-bold">{materials.length}</p>
                  </div>
                  <FaFileUpload className="text-4xl text-blue-200" />
                </div>
                <div className="mt-4 flex items-center text-blue-100">
                  <FaArrowUp className="mr-1" />
                  <span className="text-sm">+12% this month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Downloads</p>
                    <p className="text-3xl font-bold">
                      {materials.reduce((sum, m) => sum + (m.downloadCount || 0), 0)}
                    </p>
                  </div>
                  <FaDownload className="text-4xl text-green-200" />
                </div>
                <div className="mt-4 flex items-center text-green-100">
                  <FaArrowUp className="mr-1" />
                  <span className="text-sm">+8% this month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Forum Posts</p>
                    <p className="text-3xl font-bold">{forumPosts.length}</p>
                  </div>
                  <FaComments className="text-4xl text-purple-200" />
                </div>
                <div className="mt-4 flex items-center text-purple-100">
                  <FaArrowUp className="mr-1" />
                  <span className="text-sm">+15% this month</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Active Users</p>
                    <p className="text-3xl font-bold">{users.length}</p>
                  </div>
                  <FaUsers className="text-4xl text-orange-200" />
                </div>
                <div className="mt-4 flex items-center text-orange-100">
                  <FaArrowUp className="mr-1" />
                  <span className="text-sm">+5% this month</span>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 min-w-0">
              {/* Campus Distribution Pie Chart */}
              <div id="campus-chart" className="bg-white p-6 rounded-xl shadow-lg border min-w-0">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaBook className="mr-2 text-blue-500" />
                  Materials by Campus
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.campusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.campusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subject Analytics Bar Chart */}
              <div id="subject-chart" className="bg-white p-6 rounded-xl shadow-lg border min-w-0">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaChartBar className="mr-2 text-green-500" />
                  Top Subjects by Materials
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.subjectData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="subject" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="materials" fill="#4ECDC4" name="Materials" />
                      <Bar dataKey="downloads" fill="#45B7D1" name="Downloads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Upload Trends */}
              <div id="monthly-chart" className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaArrowUp className="mr-2 text-purple-500" />
                  Monthly Upload Trends
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="uploads" 
                        stackId="1" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        name="Uploads"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="downloads" 
                        stackId="2" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        name="Downloads"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rating Distribution */}
              <div id="rating-chart" className="bg-white p-6 rounded-xl shadow-lg border">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <FaStar className="mr-2 text-yellow-500" />
                  Rating Distribution
                </h3>
                <div className="h-80 min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.ratingData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="range" type="category" width={60} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FF6B6B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Enhanced Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Materials Table */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <FaHeart className="mr-2 text-red-500" />
                    Top Rated Materials
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                      <FaDownload className="mr-1" />
                      Export
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                      <FaEye className="mr-1" />
                      View All
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {materials
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 8)
                    .map((material, index) => (
                    <div key={material._id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border border-gray-200 hover:border-blue-300">
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate group-hover:text-blue-800 transition-colors">
                            {material.title}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                              {material.subject}
                            </span>
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                              {material.campus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center justify-end text-yellow-500 mb-1">
                          <FaStar className="mr-1 text-sm" />
                          <span className="font-bold text-lg">{material.rating?.toFixed(1) || 0}</span>
                        </div>
                        <div className="flex items-center justify-end text-gray-500 text-sm">
                          <FaDownload className="mr-1 text-xs" />
                          <span>{material.downloadCount || 0}</span>
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((material.downloadCount || 0) / 10 * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View More Button */}
                <div className="mt-4 text-center">
                  <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                    View All Materials →
                  </button>
                </div>
              </div>

              {/* Enhanced User Activity Table */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <FaUsers className="mr-2 text-indigo-500" />
                    Top Active Users
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors">
                      <FaDownload className="mr-1" />
                      Export
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                      <FaEye className="mr-1" />
                      View All
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {users
                    .sort((a, b) => (b.materialsCount || 0) - (a.materialsCount || 0))
                    .slice(0, 8)
                    .map((user, index) => (
                    <div key={user._id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-indigo-50 hover:to-indigo-100 transition-all duration-200 border border-gray-200 hover:border-indigo-300">
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate group-hover:text-indigo-800 transition-colors">
                            {user.name || user.email}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">
                              {user.campus || 'N/A'}
                            </span>
                            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                              {user.role || 'Student'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center justify-end text-indigo-500 mb-1">
                          <FaBook className="mr-1 text-sm" />
                          <span className="font-bold text-lg">{user.materialsCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-end text-gray-500 text-sm">
                          <FaComments className="mr-1 text-xs" />
                          <span>{user.postsCount || 0}</span>
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((user.materialsCount || 0) / 5 * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View More Button */}
                <div className="mt-4 text-center">
                  <button className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
                    View All Users →
                  </button>
                </div>
              </div>
            </div>

            {/* Comprehensive Data Tables */}
            <div className="grid grid-cols-1 gap-8">
              {/* Detailed Materials Table */}
              <div className="bg-white p-6 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <FaBook className="mr-2 text-blue-500" />
                    Materials Overview
                  </h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <FaSearch className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search materials..." 
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                      <FaDownload className="mr-1" />
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">#</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Title</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Subject</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Campus</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Rating</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Downloads</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 10)
                        .map((material, index) => (
                        <tr key={material._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold text-gray-800">{material.title}</p>
                              <p className="text-sm text-gray-500">{material.description?.substring(0, 50)}...</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                              {material.subject}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                              {material.campus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span className="font-semibold">{material.rating?.toFixed(1) || 0}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <FaDownload className="text-gray-400 mr-1" />
                              <span>{material.downloadCount || 0}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {new Date(material.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                <FaEye className="text-sm" />
                              </button>
                              <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                                <FaDownload className="text-sm" />
                              </button>
                              <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                                <FaTrash className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing 1-10 of {materials.length} materials
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                      1
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Complaint Detail Modal */}
      {showComplaintDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Complaint Details
                </h2>
                <button
                  onClick={() => {
                    setShowComplaintDetail(false);
                    setSelectedComplaint(null);
                    setComplaintDetails(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {selectedComplaint && (
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-bold mb-2">{selectedComplaint.title}</h3>
                    <p className="text-gray-600 mb-3">{selectedComplaint.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Type:</strong> {selectedComplaint.type}</p>
                        <p><strong>Category:</strong> {selectedComplaint.category}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            selectedComplaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedComplaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedComplaint.status}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p><strong>Reported by:</strong> {selectedComplaint.reportedBy}</p>
                        <p><strong>Date:</strong> {formatDate(selectedComplaint.createdAt)}</p>
                        <p><strong>Target ID:</strong> {selectedComplaint.againstMaterial || selectedComplaint.againstUser || selectedComplaint.againstPost}</p>
                      </div>
                    </div>
                  </div>

                  {detailLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="mt-4">Loading details...</p>
                    </div>
                  ) : complaintDetails ? (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        {selectedComplaint.type === 'material' && <FaBook className="mr-2" />}
                        {selectedComplaint.type === 'user' && <FaUser className="mr-2" />}
                        {selectedComplaint.type === 'forum_post' && <FaComments className="mr-2" />}
                        {selectedComplaint.type === 'material' ? 'Material Details' : 
                         selectedComplaint.type === 'user' ? 'User Details' : 'Forum Post Details'}
                      </h3>

                      {selectedComplaint.type === 'material' && (
                        <div className="bg-white border rounded-lg p-6">
                          <h4 className="text-lg font-bold mb-3">{complaintDetails.title}</h4>
                          <p className="text-gray-600 mb-4">{complaintDetails.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p><strong>Uploaded by:</strong> {complaintDetails.uploadedBy}</p>
                              <p><strong>Campus:</strong> {complaintDetails.campus}</p>
                              <p><strong>Course:</strong> {complaintDetails.course}</p>
                            </div>
                            <div>
                              <p><strong>Year:</strong> {complaintDetails.year}</p>
                              <p><strong>Semester:</strong> {complaintDetails.semester}</p>
                              <p><strong>Subject:</strong> {complaintDetails.subject}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span>👍 {complaintDetails.likeCount || 0} likes</span>
                            <span>👎 {complaintDetails.unlikeCount || 0} dislikes</span>
                            <span>⭐ {complaintDetails.rating?.toFixed(1) || 0} rating</span>
                            <span>📥 {complaintDetails.downloadCount || 0} downloads</span>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            <p><strong>Uploaded:</strong> {formatDate(complaintDetails.createdAt)}</p>
                            <p><strong>File:</strong> {complaintDetails.fileName}</p>
                          </div>
                        </div>
                      )}

                      {selectedComplaint.type === 'user' && (
                        <div className="bg-white border rounded-lg p-6">
                          <h4 className="text-lg font-bold mb-3">{complaintDetails.name || complaintDetails.email}</h4>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p><strong>Email:</strong> {complaintDetails.email}</p>
                              <p><strong>Role:</strong> {complaintDetails.role}</p>
                              <p><strong>Status:</strong> {complaintDetails.status}</p>
                            </div>
                            <div>
                              <p><strong>Campus:</strong> {complaintDetails.campus}</p>
                              <p><strong>Course:</strong> {complaintDetails.course}</p>
                              <p><strong>Joined:</strong> {formatDate(complaintDetails.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span>📁 {complaintDetails.materialsCount || 0} materials</span>
                            <span>💬 {complaintDetails.postsCount || 0} posts</span>
                            <span>⭐ {complaintDetails.averageRating?.toFixed(1) || 0} avg rating</span>
                          </div>
                          
                          {complaintDetails.bio && (
                            <div className="text-sm text-gray-600">
                              <p><strong>Bio:</strong> {complaintDetails.bio}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedComplaint.type === 'forum_post' && (
                        <div className="bg-white border rounded-lg p-6">
                          <h4 className="text-lg font-bold mb-3">{complaintDetails.title}</h4>
                          <p className="text-gray-600 mb-4">{complaintDetails.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p><strong>Author:</strong> {complaintDetails.author}</p>
                              <p><strong>Campus:</strong> {complaintDetails.campus}</p>
                              <p><strong>Course:</strong> {complaintDetails.course}</p>
                            </div>
                            <div>
                              <p><strong>Year:</strong> {complaintDetails.year}</p>
                              <p><strong>Semester:</strong> {complaintDetails.semester}</p>
                              <p><strong>Subject:</strong> {complaintDetails.subject}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <span>👍 {complaintDetails.likes || 0} likes</span>
                            <span>👎 {complaintDetails.dislikes || 0} dislikes</span>
                            <span>💬 {complaintDetails.commentCount || 0} comments</span>
                          </div>
                          
                          {complaintDetails.tags && complaintDetails.tags.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Tags:</p>
                              <div className="flex flex-wrap gap-2">
                                {complaintDetails.tags.map((tag, index) => (
                                  <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="text-sm text-gray-500">
                            <p><strong>Posted:</strong> {formatDate(complaintDetails.createdAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FaSearch className="text-4xl mx-auto mb-4 text-gray-300" />
                      <p>No details available for this complaint</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* System Management */}
      {activeTab === "system" && (
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <FaUniversity className="mr-3 text-orange-500" />
            System Management
          </h2>
          
          {/* System Management Tabs */}
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSystemTab === 'campuses' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSystemTab('campuses')}
              >
                Campuses
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSystemTab === 'courses' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSystemTab('courses')}
              >
                Courses
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSystemTab === 'years' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSystemTab('years')}
              >
                Years
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSystemTab === 'semesters' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSystemTab('semesters')}
              >
                Semesters
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSystemTab === 'subjects' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSystemTab('subjects')}
              >
                Subjects
              </button>
            </div>
    </div>
              
          
          {/* Campus Management */}
          {activeSystemTab === 'campuses' && (
            <div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <FaUniversity className="mr-2 text-blue-500" />
                  Campus Management
                </h3>
                <p className="text-gray-600">Manage campus locations for student forms</p>
              </div>
              
              {/* Add Campus Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter campus name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addCampus(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input[type="text"]');
                      if (input && input.value.trim()) {
                        addCampus(input.value);
                        input.value = '';
                      }
                    }}
                    disabled={systemLoading}
                    className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Add Campus
                  </button>
                </div>
              </div>
              
              {/* Campuses List */}
                <div className="space-y-3">
                {systemLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading campuses...</p>
                      </div>
                ) : systemData.campuses && systemData.campuses.length > 0 ? (
                  systemData.campuses.map((campus) => (
                    <div key={campus._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      {editingCampus === campus._id ? (
                        <div className="flex items-center gap-3 flex-1">
                          <FaUniversity className="mr-3 text-blue-500" />
                          <input
                            type="text"
                            value={editCampusName}
                            onChange={(e) => setEditCampusName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter campus name"
                          />
                          <button
                            onClick={updateCampus}
                            disabled={systemLoading || !editCampusName.trim()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={cancelEditCampus}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <FaTimes />
                          </button>
                </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <FaUniversity className="mr-3 text-blue-500" />
                            <span className="font-medium">{campus.name}</span>
              </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditCampus(campus)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteCampus(campus._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaUniversity className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p>No campuses found. Add your first campus above.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Course Management */}
          {activeSystemTab === 'courses' && (
            <div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <FaBook className="mr-2 text-green-500" />
                  Course Management
                </h3>
                <p className="text-gray-600">Manage course programs for student forms</p>
              </div>
              
              {/* Add Course Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Enter course name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addCourse(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input[type="text"]');
                      if (input && input.value.trim()) {
                        addCourse(input.value);
                        input.value = '';
                      }
                    }}
                    disabled={systemLoading}
                    className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Add Course
                  </button>
                </div>
              </div>
              
              {/* Courses List */}
                <div className="space-y-3">
                {systemLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading courses...</p>
                      </div>
                ) : systemData.courses && systemData.courses.length > 0 ? (
                  systemData.courses.map((course) => (
                    <div key={course._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      {editingCourse === course._id ? (
                        <div className="flex items-center gap-3 flex-1">
                          <FaBook className="mr-3 text-green-500" />
                          <input
                            type="text"
                            value={editCourseName}
                            onChange={(e) => setEditCourseName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter course name"
                          />
                          <button
                            onClick={updateCourse}
                            disabled={systemLoading || !editCourseName.trim()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={cancelEditCourse}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <FaTimes />
                          </button>
                </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <FaBook className="mr-3 text-green-500" />
                            <span className="font-medium">{course.name}</span>
              </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditCourse(course)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteCourse(course._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaBook className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p>No courses found. Add your first course above.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Year Management */}
          {activeSystemTab === 'years' && (
            <div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <FaCalendar className="mr-2 text-purple-500" />
                  Year Management
                </h3>
                <p className="text-gray-600">Manage academic years for student forms</p>
              </div>
              
              {/* Add Year Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Year number (e.g., 1)"
                    value={yearForm.year}
                    onChange={(e) => setYearForm(prev => ({ ...prev, year: e.target.value }))}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Year name (e.g., First Year)"
                    value={yearForm.name}
                    onChange={(e) => setYearForm(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={addYear}
                    disabled={systemLoading || !yearForm.year || !yearForm.name.trim()}
                    className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Add Year
                  </button>
                </div>
              </div>
              
              {/* Years List */}
                <div className="space-y-3">
                {systemLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading years...</p>
                  </div>
                ) : systemData.years && systemData.years.length > 0 ? (
                  systemData.years.map((year) => (
                    <div key={year._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      {editingYear === year._id ? (
                        <div className="flex items-center gap-3 flex-1">
                          <FaCalendar className="mr-3 text-purple-500" />
                          <input
                            type="number"
                            value={editYearForm.year}
                            onChange={(e) => setEditYearForm(prev => ({ ...prev, year: e.target.value }))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Year"
                          />
                          <input
                            type="text"
                            value={editYearForm.name}
                            onChange={(e) => setEditYearForm(prev => ({ ...prev, name: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Year name"
                          />
                          <button
                            onClick={updateYear}
                            disabled={systemLoading || !editYearForm.year || !editYearForm.name.trim()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={cancelEditYear}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <FaTimes />
                          </button>
                  </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <FaCalendar className="mr-3 text-purple-500" />
                            <span className="font-medium">{year.name} (Year {year.year})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditYear(year)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteYear(year._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaCalendar className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p>No years found. Add your first year above.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Semester Management */}
          {activeSystemTab === 'semesters' && (
            <div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <FaCalendar className="mr-2 text-indigo-500" />
                  Semester Management
                </h3>
                <p className="text-gray-600">Manage academic semesters for student forms</p>
              </div>
              
              {/* Add Semester Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Semester number (e.g., 1)"
                    value={semesterForm.semester}
                    onChange={(e) => setSemesterForm(prev => ({ ...prev, semester: e.target.value }))}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Semester name (e.g., First Semester)"
                    value={semesterForm.name}
                    onChange={(e) => setSemesterForm(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={addSemester}
                    disabled={systemLoading || !semesterForm.semester || !semesterForm.name.trim()}
                    className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Add Semester
                  </button>
                </div>
              </div>
              
              {/* Semesters List */}
              <div className="space-y-3">
                {systemLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading semesters...</p>
                  </div>
                ) : systemData.semesters && systemData.semesters.length > 0 ? (
                  systemData.semesters.map((semester) => (
                    <div key={semester._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      {editingSemester === semester._id ? (
                        <div className="flex items-center gap-3 flex-1">
                          <FaCalendar className="mr-3 text-indigo-500" />
                          <input
                            type="number"
                            value={editSemesterForm.semester}
                            onChange={(e) => setEditSemesterForm(prev => ({ ...prev, semester: e.target.value }))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Semester"
                          />
                          <input
                            type="text"
                            value={editSemesterForm.name}
                            onChange={(e) => setEditSemesterForm(prev => ({ ...prev, name: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Semester name"
                          />
                          <button
                            onClick={updateSemester}
                            disabled={systemLoading || !editSemesterForm.semester || !editSemesterForm.name.trim()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={cancelEditSemester}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <FaCalendar className="mr-3 text-indigo-500" />
                            <span className="font-medium">{semester.name} (Semester {semester.semester})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditSemester(semester)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteSemester(semester._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaCalendar className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p>No semesters found. Add your first semester above.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Subject Management */}
          {activeSystemTab === 'subjects' && (
            <div className="bg-white rounded-xl shadow-lg border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <FaBook className="mr-2 text-purple-500" />
                  Subject Management
                </h3>
                <p className="text-gray-600">Manage subjects for student forms</p>
              </div>
              
              {/* Add Subject Form */}
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Enter subject name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSubject(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.parentElement.querySelector('input[type="text"]');
                    if (input && input.value.trim()) {
                      addSubject(input.value);
                      input.value = '';
                    }
                  }}
                  disabled={systemLoading}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <FaPlus />
                  Add Subject
                </button>
              </div>
              
              {/* Subjects List */}
              <div className="space-y-3">
                {systemData.subjects && systemData.subjects.length > 0 ? (
                  systemData.subjects.map((subject) => (
                    <div key={subject._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      {editingSubject === subject._id ? (
                        <div className="flex items-center gap-3 flex-1">
                          <FaBook className="mr-3 text-purple-500" />
                          <input
                            type="text"
                            value={editSubjectName}
                            onChange={(e) => setEditSubjectName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Subject name"
                          />
                          <button
                            onClick={updateSubject}
                            disabled={systemLoading || !editSubjectName.trim()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={cancelEditSubject}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <FaBook className="mr-3 text-purple-500" />
                            <span className="font-medium">{subject.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditSubject(subject)}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteSubject(subject._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaBook className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p>No subjects found. Add your first subject above.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
      )}

      {/* Student Messages */}
      {activeTab === "messages" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold flex items-center">
              <FaComments className="mr-3 text-orange-500" />
              Student Messages
            </h2>
            <button
              onClick={loadStudentMessages}
              disabled={messagesLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {messagesLoading ? 'Loading...' : 'Load Messages'}
            </button>
          </div>
          
          {messagesLoading ? (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : studentMessages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center py-8 text-gray-500">
                <FaComments className="text-4xl mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No Messages</p>
                <p>No student messages found. Click "Load Messages" to refresh.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {studentMessages.map((message) => (
                <div key={message._id} className="bg-white rounded-lg shadow-sm border p-6 min-w-0">
                  <div className="flex justify-between items-start mb-4 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{message.subject}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getPriorityColor(message.priority)}`}>
                          {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusColor(message.status)}`}>
                          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <p><strong>From:</strong> {message.studentName} ({message.studentEmail})</p>
                        <p><strong>Sent:</strong> {formatDate(message.createdAt)}</p>
                </div>
              </div>
                    <div className="flex space-x-2 flex-shrink-0">
                      {message.status === 'pending' && (
                        <>
                          <button
                            onClick={() => acceptMessage(message._id)}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors whitespace-nowrap"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectMessage(message._id)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                          >
                            Reject
                          </button>
                        </>
                      )}
            </div>
          </div>
                  
                  <div className="mb-4 min-w-0">
                    <p className="text-gray-700 break-words">{message.message}</p>
                  </div>

                  {message.adminAction && (
                    <div className="bg-gray-50 border-l-4 border-orange-500 p-3 rounded-r-lg mb-4 min-w-0">
                      <p className="font-semibold text-gray-800 mb-1 break-words">
                        Admin Action: {message.adminAction === 'accept' ? '✅ Accepted' : '❌ Rejected'}
                      </p>
                      {message.actionAt && (
                        <p className="text-xs text-gray-500 mt-2 break-words">
                          Action taken on {formatDate(message.actionAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Export Progress Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaDownload className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Generating Report</h3>
                <p className="text-gray-600 mb-6">Please wait while we prepare your data...</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Progress</span>
                  <span>{exportProgress}%</span>
                </div>
                
                {exportProgress === 100 && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                    <FaCheck className="inline mr-2" />
                    Report generated successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMAdminDashboard;
