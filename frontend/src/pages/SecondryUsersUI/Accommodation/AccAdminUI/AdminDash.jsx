import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, getFirstImage } from '../../../../utils/imageUtils';
import AdminNavbar from './AdminNavbar';
import AdminImageGallery from './components/AdminImageGallery';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const AdminDash = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected, removed
  const [selectedListing, setSelectedListing] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [removalReason, setRemovalReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [detailsListing, setDetailsListing] = useState(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [owners, setOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');
  const [reportData, setReportData] = useState({
    owners: [],
    bookings: [],
    properties: [],
    dateRange: { 
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      end: new Date().toISOString().split('T')[0] 
    }
  });
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    fetchListings();
    fetchOwners(); // Also fetch owners to show count
  }, [navigate]);

  // Auto-generate reports when reports tab is opened (only once)
  useEffect(() => {
    if (activeTab === 'reports' && owners.length > 0 && listings.length > 0 && reportData.owners.length === 0) {
      generateReports();
    }
  }, [activeTab, owners.length, listings.length]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      
      const response = await axios.get('http://localhost:5001/api/boarding-places/admin/all', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const sorted = (response.data || []).slice().sort((a, b) => {
        const ad = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bd = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bd - ad; // newest first
      });
      setListings(sorted);
    } catch (error) {
      console.error('Error fetching listings:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field, value) => {
    console.log('Date range changing:', field, value);
    setReportData(prev => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value }
    }));
  };

  const generateReports = async () => {
    try {
      setReportsLoading(true);
      console.log('Generating reports with date range:', reportData.dateRange);
      
      // Get current date range from state
      const startDate = new Date(reportData.dateRange.start);
      const endDate = new Date(reportData.dateRange.end);
      
      // Set end date to end of day to include the full day
      endDate.setHours(23, 59, 59, 999);
      
      console.log('Filtering dates:', { startDate, endDate });
      
      // Filter owners by date range
      const filteredOwners = owners.filter(owner => {
        const ownerDate = new Date(owner.joinedDate || owner.createdAt || owner._id);
        const isInRange = ownerDate >= startDate && ownerDate <= endDate;
        console.log('Owner filtering:', {
          owner: owner.fullName,
          ownerDate: ownerDate.toISOString(),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          isInRange
        });
        return isInRange;
      });
      
      // Filter properties by date range
      const filteredProperties = listings.filter(property => {
        const propertyDate = new Date(property.createdAt || property._id);
        const isInRange = propertyDate >= startDate && propertyDate <= endDate;
        console.log('Property filtering:', {
          property: property.title,
          propertyDate: propertyDate.toISOString(),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          isInRange
        });
        return isInRange;
      });
      
      // For status distributions, we want to show ALL data but with filtered counts
      // So we'll keep the original data but add filtered counts
      
      console.log('Filtered data:', {
        totalOwners: owners.length,
        filteredOwners: filteredOwners.length,
        totalProperties: listings.length,
        filteredProperties: filteredProperties.length,
        dateRange: { start: startDate.toISOString().split('T')[0], end: endDate.toISOString().split('T')[0] }
      });
      
      setReportData({
        owners: filteredOwners,
        totalOwners: owners, // Keep total owners for percentage calculations
        bookings: [], // Will be fetched from API
        properties: filteredProperties,
        totalProperties: listings, // Keep total properties for percentage calculations
        dateRange: { 
          start: startDate.toISOString().split('T')[0], 
          end: endDate.toISOString().split('T')[0] 
        }
      });
      
      console.log('Reports generated successfully');
    } catch (error) {
      console.error('Error generating reports:', error);
      alert('Error generating reports. Please try again.');
    } finally {
      setReportsLoading(false);
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Set up orange color scheme
      const headerColor = [249, 115, 22]; // Orange
      const accentColor = [251, 146, 60]; // Light orange
      const textColor = [55, 65, 81]; // Dark gray
      const lightGrayColor = [255, 247, 237]; // Very light orange
      
      // Add formal header
      doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.rect(0, 0, 210, 35, 'F');
      
      // Add title with white text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('ACCOMMODATION SUMMARY REPORT', 20, 22);
      
      // Add subtitle
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('University Management System', 20, 30);
      
      // Reset text color
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      
      // Add report information section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORT INFORMATION', 20, 50);
      
      // Add horizontal line
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setLineWidth(0.5);
      doc.line(20, 55, 190, 55);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Report Period: ${reportData.dateRange.start} to ${reportData.dateRange.end}`, 20, 65);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, 72);
      doc.text(`Total Records: ${reportData.owners.length} owners, ${reportData.properties.length} properties`, 20, 79);
      
      // Add summary statistics section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('SUMMARY STATISTICS', 20, 95);
      
      // Add horizontal line
      doc.line(20, 100, 190, 100);
      
      // Create formal summary table
      const summaryData = [
        ['Metric', 'Count', 'Percentage'],
        ['Total Properties', reportData.properties.length, '100.0%'],
        ['Total Owners', reportData.owners.length, '100.0%'],
        ['Active Owners', reportData.owners.filter(o => o.status === 'active').length, 
         reportData.owners.length > 0 ? ((reportData.owners.filter(o => o.status === 'active').length / reportData.owners.length) * 100).toFixed(1) + '%' : '0.0%'],
        ['Pending Owners', reportData.owners.filter(o => o.status === 'pending').length,
         reportData.owners.length > 0 ? ((reportData.owners.filter(o => o.status === 'pending').length / reportData.owners.length) * 100).toFixed(1) + '%' : '0.0%']
      ];
      
      autoTable(doc, {
        startY: 105,
        head: [summaryData[0]],
        body: summaryData.slice(1),
        theme: 'plain',
        headStyles: { 
          fillColor: headerColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
          cellPadding: 6
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 6
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 30, halign: 'center' }
        },
        margin: { left: 20, right: 20 },
        styles: {
          lineColor: [255, 255, 255],
          lineWidth: 0
        },
        tableLineColor: [255, 255, 255],
        tableLineWidth: 0
      });
      
      // Add owner status distribution section
      const ownerTableY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('OWNER STATUS DISTRIBUTION', 20, ownerTableY);
      
      // Add horizontal line
      doc.line(20, ownerTableY + 5, 190, ownerTableY + 5);
      
      const ownerStatusData = [
        ['Active', reportData.owners.filter(o => o.status === 'active').length, 
         reportData.owners.length > 0 ? ((reportData.owners.filter(o => o.status === 'active').length / reportData.owners.length) * 100).toFixed(1) + '%' : '0.0%'],
        ['Pending', reportData.owners.filter(o => o.status === 'pending').length,
         reportData.owners.length > 0 ? ((reportData.owners.filter(o => o.status === 'pending').length / reportData.owners.length) * 100).toFixed(1) + '%' : '0.0%'],
        ['Inactive', reportData.owners.filter(o => o.status === 'inactive').length,
         reportData.owners.length > 0 ? ((reportData.owners.filter(o => o.status === 'inactive').length / reportData.owners.length) * 100).toFixed(1) + '%' : '0.0%'],
        ['Removed', reportData.owners.filter(o => o.status === 'removed').length,
         reportData.owners.length > 0 ? ((reportData.owners.filter(o => o.status === 'removed').length / reportData.owners.length) * 100).toFixed(1) + '%' : '0.0%']
      ];
      
      autoTable(doc, {
        startY: ownerTableY + 10,
        head: [['Status', 'Count', 'Percentage']],
        body: ownerStatusData,
        theme: 'plain',
        showHead: 'firstPage',
        headStyles: { 
          fillColor: headerColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          cellPadding: 8,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 8,
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 60, halign: 'left' },
          1: { cellWidth: 40, halign: 'center' },
          2: { cellWidth: 50, halign: 'center' }
        },
        margin: { left: 20, right: 20 },
        styles: {
          lineColor: [255, 255, 255],
          lineWidth: 0
        },
        tableLineColor: [255, 255, 255],
        tableLineWidth: 0
      });
      
      // Add property status distribution section
      const propertyTableY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROPERTY STATUS DISTRIBUTION', 20, propertyTableY);
      
      // Add horizontal line
      doc.line(20, propertyTableY + 5, 190, propertyTableY + 5);
      
      const propertyStatusData = [
        ['Approved', reportData.properties.filter(p => p.status === 'approved').length,
         reportData.properties.length > 0 ? ((reportData.properties.filter(p => p.status === 'approved').length / reportData.properties.length) * 100).toFixed(1) + '%' : '0.0%'],
        ['Pending', reportData.properties.filter(p => p.status === 'pending').length,
         reportData.properties.length > 0 ? ((reportData.properties.filter(p => p.status === 'pending').length / reportData.properties.length) * 100).toFixed(1) + '%' : '0.0%'],
        ['Rejected', reportData.properties.filter(p => p.status === 'rejected').length,
         reportData.properties.length > 0 ? ((reportData.properties.filter(p => p.status === 'rejected').length / reportData.properties.length) * 100).toFixed(1) + '%' : '0.0%'],
        ['Hidden', reportData.properties.filter(p => p.status === 'hidden').length,
         reportData.properties.length > 0 ? ((reportData.properties.filter(p => p.status === 'hidden').length / reportData.properties.length) * 100).toFixed(1) + '%' : '0.0%']
      ];
      
      autoTable(doc, {
        startY: propertyTableY + 10,
        head: [['Status', 'Count', 'Percentage']],
        body: propertyStatusData,
        theme: 'plain',
        showHead: 'firstPage',
        headStyles: { 
          fillColor: headerColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          cellPadding: 8,
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 10,
          cellPadding: 8,
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 60, halign: 'left' },
          1: { cellWidth: 40, halign: 'center' },
          2: { cellWidth: 50, halign: 'center' }
        },
        margin: { left: 20, right: 20 },
        styles: {
          lineColor: [255, 255, 255],
          lineWidth: 0
        },
        tableLineColor: [255, 255, 255],
        tableLineWidth: 0
      });
      
      // Add formal footer
      const footerY = doc.lastAutoTable.finalY + 20;
      doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
      doc.rect(0, footerY, 210, 15, 'F');
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('University Management System - Accommodation Module', 20, footerY + 6);
      doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 20, footerY + 12);
      doc.text('Confidential Document', 150, footerY + 6);
      
      // Save the PDF
      doc.save(`accommodation-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const exportToExcel = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Summary sheet
      const summaryData = [
        ['Accommodation Management Report'],
        [`Generated on: ${new Date().toLocaleDateString()}`],
        [`Report Period: ${reportData.dateRange.start} to ${reportData.dateRange.end}`],
        [''],
        ['Summary Statistics'],
        ['Total Properties', reportData.properties.length],
        ['Total Owners', reportData.owners.length],
        ['Active Owners', reportData.owners.filter(o => o.status === 'active').length],
        ['Pending Owners', reportData.owners.filter(o => o.status === 'pending').length],
        ['Inactive Owners', reportData.owners.filter(o => o.status === 'inactive').length],
        ['Removed Owners', reportData.owners.filter(o => o.status === 'removed').length]
      ];
      
      const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
      
      // Owner details sheet
      const ownerData = [
        ['Name', 'Email', 'Phone', 'Status', 'Joined Date', 'Address']
      ];
      
      reportData.owners.forEach(owner => {
        ownerData.push([
          owner.fullName || 'N/A',
          owner.email || 'N/A',
          owner.phoneNumber || 'N/A',
          owner.status || 'N/A',
          owner.joinedDate ? new Date(owner.joinedDate).toLocaleDateString() : 'N/A',
          owner.address || 'N/A'
        ]);
      });
      
      const ownerWS = XLSX.utils.aoa_to_sheet(ownerData);
      XLSX.utils.book_append_sheet(wb, ownerWS, 'Owners');
      
      // Property details sheet
      const propertyData = [
        ['Title', 'Location', 'Price', 'Status', 'Owner', 'Created Date']
      ];
      
      reportData.properties.forEach(property => {
        propertyData.push([
          property.title || 'N/A',
          property.location || 'N/A',
          property.price || 'N/A',
          property.status || 'N/A',
          property.ownerName || 'N/A',
          property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'
        ]);
      });
      
      const propertyWS = XLSX.utils.aoa_to_sheet(propertyData);
      XLSX.utils.book_append_sheet(wb, propertyWS, 'Properties');
      
      // Save the Excel file
      XLSX.writeFile(wb, `accommodation-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel report. Please try again.');
    }
  };

  const fetchOwners = async () => {
    try {
      setOwnersLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }

      const response = await axios.get('http://localhost:5001/api/owner/admin/all', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      
      console.log('Owners response:', response.data); // Debug log
      
      const sorted = (response.data || []).slice().sort((a, b) => {
        // Try multiple date fields to find the most recent
        const aDate = a?.joinedDate ? new Date(a.joinedDate).getTime() : 
                     a?.createdAt ? new Date(a.createdAt).getTime() : 
                     a?._id ? new Date(a._id).getTime() : 0;
        const bDate = b?.joinedDate ? new Date(b.joinedDate).getTime() : 
                     b?.createdAt ? new Date(b.createdAt).getTime() : 
                     b?._id ? new Date(b._id).getTime() : 0;
        
        console.log('Sorting owners:', {
          a: { name: a?.fullName, joinedDate: a?.joinedDate, createdAt: a?.createdAt, aDate },
          b: { name: b?.fullName, joinedDate: b?.joinedDate, createdAt: b?.createdAt, bDate }
        });
        
        // If dates are equal, sort by name for consistency
        if (aDate === bDate) {
          return (a?.fullName || '').localeCompare(b?.fullName || '');
        }
        
        return bDate - aDate; // newest first
      });
      setOwners(sorted);
      console.log('Owners set:', sorted.length, 'owners');
    } catch (error) {
      console.error('Error fetching owners:', error);
      console.error('Error details:', error.response?.data);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert(`Failed to fetch owners: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setOwnersLoading(false);
    }
  };

  const handleApprove = async (listingId) => {
    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      
      await axios.put(
        `http://localhost:5001/api/boarding-places/admin/${listingId}/approve`,
        {},
        {
        headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      await fetchListings();
      alert('Listing approved successfully!');
    } catch (error) {
      console.error('Error approving listing:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to approve listing');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminHide = async (listingId) => {
    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      await axios.put(
        `http://localhost:5001/api/boarding-places/admin/${listingId}/hide`,
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      await fetchListings();
      alert('Listing hidden from admin dashboard.');
    } catch (error) {
      console.error('Error hiding listing:', error);
      alert('Failed to hide listing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 3) {
      alert('Please provide a rejection reason (minimum 3 characters)');
      return;
    }

    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      // Double confirmation
      const confirm1 = window.confirm('Are you sure you want to reject this listing?');
      if (!confirm1) {
        setActionLoading(false);
        return;
      }
      const confirm2 = window.confirm('This action cannot be undone. Confirm reject?');
      if (!confirm2) {
        setActionLoading(false);
        return;
      }

      await axios.put(
        `http://localhost:5001/api/boarding-places/admin/${selectedListing._id}/reject`,
        {
          rejectionReason: rejectionReason.trim(),
        },
        {
        headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      await fetchListings();
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedListing(null);
      alert('Listing rejected successfully!');
    } catch (error) {
      console.error('Error rejecting listing:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to reject listing');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!removalReason.trim() || removalReason.trim().length < 3) {
      alert('Please provide a removal reason (minimum 3 characters)');
      return;
    }

    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }
      // Double confirmation
      const confirm1 = window.confirm('Are you sure you want to remove this listing?');
      if (!confirm1) {
        setActionLoading(false);
        return;
      }
      const confirm2 = window.confirm('This action cannot be undone. Confirm removal?');
      if (!confirm2) {
        setActionLoading(false);
        return;
      }

      await axios.put(
        `http://localhost:5001/api/boarding-places/admin/${selectedListing._id}/remove`,
        {
          removalReason: removalReason.trim(),
        },
        {
        headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      await fetchListings();
      setShowRemoveModal(false);
      setRemovalReason('');
      setSelectedListing(null);
      alert('Listing removed successfully!');
    } catch (error) {
      console.error('Error removing listing:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to remove listing');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleImageGallery = (listing) => {
    setSelectedListing(listing);
    setShowImageGallery(true);
  };

  const handleCloseImageGallery = () => {
    setShowImageGallery(false);
    setSelectedListing(null);
  };

  const handleActivateOwner = async (ownerId) => {
    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }

      await axios.put(
        `http://localhost:5001/api/owner/admin/${ownerId}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      await fetchOwners();
      alert('Owner activated successfully!');
    } catch (error) {
      console.error('Error activating owner:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to activate owner');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateOwner = async (ownerId) => {
    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }

      const confirm = window.confirm('Are you sure you want to deactivate this owner?');
      if (!confirm) {
        setActionLoading(false);
        return;
      }

      await axios.put(
        `http://localhost:5001/api/owner/admin/${ownerId}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      await fetchOwners();
      alert('Owner deactivated successfully!');
    } catch (error) {
      console.error('Error deactivating owner:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to deactivate owner');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveOwner = async (ownerId) => {
    try {
      setActionLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please login as admin first');
        return;
      }

      // Enhanced confirmation with details about what will be deleted
      const confirm1 = window.confirm(
        '⚠️ WARNING: This will permanently remove the owner and ALL their data including:\n\n' +
        '• All boarding place listings\n' +
        '• All booking requests\n' +
        '• All related data\n\n' +
        'This action CANNOT be undone!\n\n' +
        'Are you sure you want to proceed?'
      );
      if (!confirm1) {
        setActionLoading(false);
        return;
      }
      
      const confirm2 = window.confirm(
        '🚨 FINAL CONFIRMATION 🚨\n\n' +
        'You are about to permanently delete this owner and ALL their data.\n\n' +
        'This will affect:\n' +
        '• Students who have booked their places\n' +
        '• All listing data and images\n' +
        '• All booking history\n\n' +
        'Type "DELETE" to confirm (case sensitive):'
      );
      
      if (confirm2) {
        const userInput = window.prompt('Type "DELETE" to confirm:');
        if (userInput !== 'DELETE') {
          alert('Removal cancelled. You must type "DELETE" exactly to confirm.');
          setActionLoading(false);
          return;
        }
      } else {
        setActionLoading(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:5001/api/owner/admin/${ownerId}/remove`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      
      await fetchOwners();
      await fetchListings(); // Also refresh listings to remove deleted owner's places
      
      // Show detailed success message
      const deletedData = response.data.deletedData;
      alert(
        `✅ Owner removed successfully!\n\n` +
        `Deleted data:\n` +
        `• ${deletedData.places} boarding place(s)\n` +
        `• ${deletedData.bookings} booking(s)\n\n` +
        `All related data has been permanently removed.`
      );
    } catch (error) {
      console.error('Error removing owner:', error);
      if (error.response?.status === 403) {
        alert('Access denied. Please ensure you are logged in as an admin.');
      } else if (error.response?.status === 401) {
        alert('Authentication required. Please login first.');
      } else {
        alert('Failed to remove owner');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewOwner = (owner) => {
    setSelectedOwner(owner);
    setShowOwnerModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'removed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'removed':
        return 'Removed';
      default:
        return 'Unknown';
    }
  };

  // Owner-specific status functions
  const getOwnerStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'removed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOwnerStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'removed':
        return 'Removed';
      default:
        return 'Unknown';
    }
  };

  const filteredListings = listings.filter((listing) => {
    if (filter === 'all') return true;
    return listing.status === filter;
  });

  const stats = {
    total: listings.length,
    pending: listings.filter((l) => l.status === 'pending').length,
    approved: listings.filter((l) => l.status === 'approved').length,
    rejected: listings.filter((l) => l.status === 'rejected').length,
    removed: listings.filter((l) => l.status === 'removed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-before: always;
          }
          .print-container {
            margin: 0;
            padding: 20px;
            background: white;
          }
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #f97316;
            padding-bottom: 20px;
          }
          .print-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .print-stat-card {
            border: 1px solid #e5e7eb;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
          }
          .print-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          .print-table th,
          .print-table td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            text-align: left;
          }
          .print-table th {
            background-color: #f97316;
            color: white;
            font-weight: bold;
          }
        }
      `}</style>
      <AdminNavbar />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Accommodation Admin</h1>
              <p className="mt-2 text-gray-600">Review and manage boarding place listings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Listings</p>
                <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Removed</p>
                <p className="text-2xl font-semibold text-gray-600">{stats.removed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => {
                  setActiveTab('listings');
                  fetchListings();
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'listings'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Property Listings
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {stats.total}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('owners');
                  fetchOwners();
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'owners'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Boarding Owners
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {ownersLoading ? '...' : (() => {
                    console.log('Rendering owners count:', owners.length, owners);
                    return owners.length;
                  })()}
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('reports');
                  generateReports();
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reports'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Reports
              </button>
            </nav>
          </div>
        </div>

        {/* Filter Tabs */}
        {activeTab === 'listings' && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Listings', count: stats.total },
                { key: 'pending', label: 'Pending Review', count: stats.pending },
                { key: 'approved', label: 'Approved', count: stats.approved },
                { key: 'rejected', label: 'Rejected', count: stats.rejected },
                  { key: 'removed', label: 'Removed', count: stats.removed },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        )}

        {/* Listings Grid + Empty State (wrapped in a Fragment) */}
        {activeTab === 'listings' && (
          <>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((listing) => {
                const images = Array.isArray(listing.images) ? listing.images : [];
                const hasImages = images.length > 0;
                const firstImage = hasImages ? getImageUrl(getFirstImage(images)) : null;
                const priceText =
                  listing?.price != null
                    ? `Rs. ${Number(listing.price).toLocaleString()}/month`
                    : 'Price not set';

                return (
                  <div
                    key={listing._id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col"
                  >
              {/* Image */}
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg relative">
                      {hasImages ? (
                  <img
                          src={firstImage}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                            e.currentTarget.src =
                              'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                    </svg>
                  </div>
                )}

                      {/* Image Gallery Button */}
                      {hasImages && (
                        <button
                          onClick={() => handleImageGallery(listing)}
                          className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md transition-all duration-200"
                          title="View All Images"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Image Count Badge */}
                      {hasImages && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                          {images.length} image{images.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            listing.status
                          )}`}
                        >
                    {getStatusText(listing.status)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                    </svg>
                    {listing.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                    </svg>
                          {priceText}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                    </svg>
                    {listing.ownerId?.fullName || 'Unknown Owner'}
                  </div>
                </div>

                {/* Admin Review Info */}
                {listing.adminReview?.reviewedAt && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Reviewed by {listing.adminReview.reviewedBy} on{' '}
                      {new Date(listing.adminReview.reviewedAt).toLocaleDateString()}
                    </p>
                    {listing.adminReview.rejectionReason && (
                      <p className="text-sm text-red-600">
                        <strong>Rejection Reason:</strong> {listing.adminReview.rejectionReason}
                      </p>
                    )}
                    {listing.adminReview.removalReason && (
                      <p className="text-sm text-red-600">
                        <strong>Removal Reason:</strong> {listing.adminReview.removalReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons - Always at bottom */}
                <div className="mt-auto space-y-3">
                  {/* Primary Actions Row */}
                  <div className="flex gap-2">
                    {listing.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(listing._id)}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                                {actionLoading ? 'Activating...' : 'Activate'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowRejectModal(true);
                          }}
                          disabled={actionLoading}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </>
                    )}
                    {listing.status === 'approved' && (
                      <button
                        onClick={() => {
                          setSelectedListing(listing);
                          setShowRemoveModal(true);
                        }}
                        disabled={actionLoading}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                        </svg>
                        Remove
                      </button>
                    )}
                    {listing.status === 'rejected' && (
                      <div className="flex-1">
                        <span className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 cursor-not-allowed">
                          Rejected
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Secondary Actions Row */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetailsListing(listing)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                      </svg>
                      View Details
                    </button>
                          {(listing.status === 'approved' ||
                            listing.status === 'rejected' ||
                            listing.status === 'removed') && (
                      <button
                        onClick={() => handleAdminHide(listing._id)}
                        disabled={actionLoading}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                        </svg>
                        Hide from Admin
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
                );
              })}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No listings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'No boarding places have been submitted yet.' : `No ${filter} listings found.`}
            </p>
              </div>
            )}
          </>
        )}

        {/* Owners Section */}
        {activeTab === 'owners' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {ownersLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="mt-2 text-gray-600">Loading owners...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {owners.map((owner) => (
                  <div
                    key={owner._id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Owner Info */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{owner.fullName}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getOwnerStatusColor(owner.status)}`}
                        >
                          {getOwnerStatusText(owner.status)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                          {owner.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {owner.phoneNumber || 'No phone provided'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {owner.address || 'No address provided'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Joined: {new Date(owner.joinedDate || owner.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Admin Review Info */}
                      {owner.adminReview?.reviewedAt && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Reviewed by {owner.adminReview.reviewedBy} on{' '}
                            {new Date(owner.adminReview.reviewedAt).toLocaleDateString()}
                          </p>
                          {owner.adminReview.rejectionReason && (
                            <p className="text-sm text-red-600">
                              <strong>Rejection Reason:</strong> {owner.adminReview.rejectionReason}
                            </p>
                          )}
                          {owner.adminReview.removalReason && (
                            <p className="text-sm text-red-600">
                              <strong>Removal Reason:</strong> {owner.adminReview.removalReason}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto space-y-3">
                        <div className="flex gap-2">
                          {owner.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleActivateOwner(owner._id)}
                                disabled={actionLoading}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {actionLoading ? 'Activating...' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleRemoveOwner(owner._id)}
                                disabled={actionLoading}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Remove
                              </button>
                            </>
                          )}
                          {owner.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleDeactivateOwner(owner._id)}
                                disabled={actionLoading}
                                className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                </svg>
                                {actionLoading ? 'Deactivating...' : 'Deactivate'}
                              </button>
                              <button
                                onClick={() => handleRemoveOwner(owner._id)}
                                disabled={actionLoading}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                {actionLoading ? 'Removing...' : 'Remove'}
                              </button>
                            </>
                          )}
                          {owner.status === 'inactive' && (
                            <>
                              <button
                                onClick={() => handleActivateOwner(owner._id)}
                                disabled={actionLoading}
                                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {actionLoading ? 'Activating...' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleRemoveOwner(owner._id)}
                                disabled={actionLoading}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                {actionLoading ? 'Removing...' : 'Remove'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!ownersLoading && owners.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No owners found</h3>
                <p className="mt-1 text-sm text-gray-500">No boarding owners have registered yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Reports Section */}
        {activeTab === 'reports' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print-container">
            <div className="mb-8 print-header">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Accommodation Reports</h2>
              <p className="text-gray-600">Generate comprehensive reports for your accommodation management system.</p>
              <p className="text-sm text-gray-500 mt-2">
                Report Period: {reportData.dateRange.start} to {reportData.dateRange.end} | 
                Generated on: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Date Range Filter */}
            <div className="bg-white rounded-lg shadow p-6 mb-8 no-print">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Date Range Filter</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={reportData.dateRange.start}
                    onChange={(e) => {
                      handleDateRangeChange('start', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={reportData.dateRange.end}
                    onChange={(e) => {
                      handleDateRangeChange('end', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={generateReports}
                    disabled={reportsLoading}
                    className={`w-full px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                      reportsLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {reportsLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        🔄 Generate Reports
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {reportsLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-600">Generating reports...</span>
              </div>
            )}

            {/* Quick Stats Cards */}
            {!reportsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 print-stats">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Properties</p>
                    <p className="text-3xl font-bold">{reportData.properties.length}</p>
                  </div>
                  <div className="p-3 bg-blue-400 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Owners</p>
                    <p className="text-3xl font-bold">{reportData.owners.filter(o => o.status === 'active').length}</p>
                  </div>
                  <div className="p-3 bg-green-400 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Pending Owners</p>
                    <p className="text-3xl font-bold">{reportData.owners.filter(o => o.status === 'pending').length}</p>
                  </div>
                  <div className="p-3 bg-yellow-400 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Owners</p>
                    <p className="text-3xl font-bold">{reportData.owners.length}</p>
                  </div>
                  <div className="p-3 bg-purple-400 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Detailed Reports */}
            {!reportsLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print-section">
              {/* Owner Status Report */}
              <div className="bg-white rounded-lg shadow p-6 print-stat-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Owner Status Distribution</h3>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['active', 'pending', 'inactive', 'removed'].map(status => {
                      const count = reportData.owners.filter(o => o.status === status).length;
                      const totalOwners = reportData.totalOwners ? reportData.totalOwners.length : owners.length;
                      const percentage = totalOwners > 0 ? (count / totalOwners * 100).toFixed(1) : 0;
                      return (
                        <tr key={status}>
                          <td className="capitalize">{status}</td>
                          <td>{count}</td>
                          <td>{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="space-y-4 no-print">
                  {['active', 'pending', 'inactive', 'removed'].map(status => {
                    const count = reportData.owners.filter(o => o.status === status).length;
                    const totalOwners = reportData.totalOwners ? reportData.totalOwners.length : owners.length;
                    const percentage = totalOwners > 0 ? (count / totalOwners * 100).toFixed(1) : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${getOwnerStatusColor(status)}`}></div>
                          <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">{count}</span>
                          <span className="text-xs text-gray-500 ml-2">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Property Status Report */}
              <div className="bg-white rounded-lg shadow p-6 print-stat-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🏠 Property Status Distribution</h3>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['approved', 'pending', 'rejected', 'hidden'].map(status => {
                      const count = reportData.properties.filter(p => p.status === status).length;
                      const totalProperties = reportData.totalProperties ? reportData.totalProperties.length : listings.length;
                      const percentage = totalProperties > 0 ? (count / totalProperties * 100).toFixed(1) : 0;
                      return (
                        <tr key={status}>
                          <td className="capitalize">{status}</td>
                          <td>{count}</td>
                          <td>{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="space-y-4 no-print">
                  {['approved', 'pending', 'rejected', 'hidden'].map(status => {
                    const count = reportData.properties.filter(p => p.status === status).length;
                    const totalProperties = reportData.totalProperties ? reportData.totalProperties.length : listings.length;
                    const percentage = totalProperties > 0 ? (count / totalProperties * 100).toFixed(1) : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(status)}`}></div>
                          <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">{count}</span>
                          <span className="text-xs text-gray-500 ml-2">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            )}

            {/* Export Options */}
            <div className="mt-8 bg-white rounded-lg shadow p-6 no-print">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Export Reports</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
                <button
                  onClick={exportToPDF}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Listing</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for rejecting "{selectedListing?.title}"
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason (minimum 3 characters)..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
                minLength={3}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedListing(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading || rejectionReason.trim().length < 3}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Remove Listing</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for removing "{selectedListing?.title}"
              </p>
              <textarea
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                placeholder="Enter removal reason (minimum 3 characters)..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
                minLength={3}
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setRemovalReason('');
                    setSelectedListing(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  disabled={actionLoading || removalReason.trim().length < 3}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {detailsListing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[680px] max-w-[95%] shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-900">Listing Details</h3>
                <button onClick={() => setDetailsListing(null)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img
                    src={getImageUrl(getFirstImage(detailsListing.images))}
                    alt={detailsListing.title}
                    className="w-full h-48 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Owner: {detailsListing.ownerId?.fullName || 'Unknown'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">{detailsListing.title}</p>
                  <p className="text-sm text-gray-700">{detailsListing.description}</p>
                  <p className="text-sm text-gray-600">📍 {detailsListing.location}</p>
                  <p className="text-sm text-gray-600">
                    Price:{' '}
                    {detailsListing.price != null
                      ? `Rs. ${Number(detailsListing.price).toLocaleString()}/month`
                      : 'Price not set'}
                  </p>
                  <p className="text-sm text-gray-600">Contact: {detailsListing.contactNumber}</p>
                  <p className="text-sm text-gray-600">Status: {getStatusText(detailsListing.status)}</p>
                  {detailsListing.adminReview?.reviewedAt && (
                    <div className="bg-gray-50 rounded p-2 text-sm">
                      <p>
                        Reviewed by {detailsListing.adminReview.reviewedBy} on{' '}
                        {new Date(detailsListing.adminReview.reviewedAt).toLocaleDateString()}
                      </p>
                      {detailsListing.adminReview.rejectionReason && (
                        <p className="text-red-600">Rejection: {detailsListing.adminReview.rejectionReason}</p>
                      )}
                      {detailsListing.adminReview.removalReason && (
                        <p className="text-red-600">Removal: {detailsListing.adminReview.removalReason}</p>
                      )}
                    </div>
                  )}
                  {Array.isArray(detailsListing.amenities) && detailsListing.amenities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">Amenities</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {detailsListing.amenities.map((a, i) => (
                          <span
                            key={i}
                            className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setDetailsListing(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Image Gallery Modal */}
      {showImageGallery && selectedListing && (
        <AdminImageGallery place={selectedListing} onClose={handleCloseImageGallery} />
      )}
    </div>
  );
};

export default AdminDash;
