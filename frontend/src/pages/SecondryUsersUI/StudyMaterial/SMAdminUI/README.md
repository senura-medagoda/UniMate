# Study Material Admin Dashboard

## Overview

The Study Material Admin Dashboard is a comprehensive management system for administrators to moderate content, handle user complaints, manage users, and generate detailed reports.

## Features

### 🎯 Dashboard Overview
- **Real-time Statistics**: Total users, materials, forum posts, complaints, and pending approvals
- **Quick Actions**: Direct access to all admin functions
- **Visual Analytics**: Charts and graphs for data visualization

### 📚 Content Moderation
- **Materials Moderation**: Review, approve, or delete uploaded study materials
- **Forum Moderation**: Manage forum posts and comments
- **Bulk Actions**: Perform actions on multiple items at once

### ⚠️ Complaint Management
- **Complaint Tracking**: View and manage all user complaints
- **Status Updates**: Mark complaints as pending, resolved, or rejected
- **Admin Notes**: Add internal notes for complaint resolution
- **Complaint Categories**: 
  - Inappropriate Content
  - Spam
  - Harassment
  - Copyright Violation
  - Misinformation
  - Other

### 👥 User Management
- **User Overview**: View all registered users with detailed information
- **User Actions**: 
  - Ban users permanently
  - Suspend users temporarily
  - Reactivate suspended/banned users
- **User Statistics**: Track user contributions and activity

### 📊 Reports & Analytics
- **Top Content**: Most liked and downloaded materials
- **Top Contributors**: Users who contribute most materials
- **Campus Analytics**: Materials distribution by campus
- **Subject Analytics**: Materials distribution by subject
- **Forum Activity**: Posts, comments, likes, and engagement metrics
- **Complaint Statistics**: Complaint trends and resolution rates

## Access

The admin dashboard is accessible at:
```
http://localhost:3000/admin/study-material
```

## API Endpoints

### Dashboard Stats
```bash
GET /api/admin/stats
```

### Analytics Report
```bash
GET /api/admin/analytics
```

### Complaint Management
```bash
GET /api/admin/complaints
PUT /api/admin/complaints/:id
POST /api/admin/complaints
```

### User Management
```bash
GET /api/admin/users
PUT /api/admin/users/:userId/ban
PUT /api/admin/users/:userId/suspend
PUT /api/admin/users/:userId/reactivate
```

### Content Moderation
```bash
DELETE /api/admin/materials/:materialId
DELETE /api/admin/forum/posts/:postId
```

## Student Complaint System

Students can submit complaints through:
- **Material Reports**: Report inappropriate or problematic study materials
- **User Reports**: Report users for harassment or inappropriate behavior
- **Forum Reports**: Report inappropriate forum posts or comments

### Complaint Form Features
- **Type Selection**: Material, User, Forum Post, Comment, or Other
- **Category Selection**: Specific violation type
- **Detailed Description**: Comprehensive complaint details
- **Evidence Support**: Links or references to problematic content

## Security Features

- **Role-based Access**: Only admin users can access the dashboard
- **Audit Trail**: All admin actions are logged
- **Confirmation Dialogs**: Prevents accidental deletions
- **Data Validation**: Input validation for all forms

## Database Collections

- **users**: User accounts and profiles
- **studymaterials**: Uploaded study materials
- **forumposts**: Forum posts and comments
- **complaints**: User complaints and resolutions

## Future Enhancements

- **Email Notifications**: Automated notifications for complaints
- **Advanced Filtering**: More sophisticated search and filter options
- **Export Reports**: PDF/Excel export functionality
- **Real-time Updates**: WebSocket integration for live updates
- **Mobile Responsive**: Mobile-optimized admin interface
