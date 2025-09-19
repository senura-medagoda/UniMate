# StudyMaterial & Admin API Test Guide

## StudyMaterial Endpoints

### Base URL: http://localhost:5001/api/study-materials

### Available Endpoints:

1. **Upload Study Material**
   - POST `/upload`
   - Content-Type: multipart/form-data
   - Body: 
     - file: (file upload)
     - title: (string, required)
     - description: (string)
     - campus: (string, required)
     - course: (string, required)
     - year: (string, required)
     - semester: (string, required)
     - subject: (string, required)
     - keywords: (comma-separated string)

2. **Get All Materials**
   - GET `/all`
   - Returns all study materials sorted by creation date

3. **Get Top Materials (Most Liked/Reviewed)**
   - GET `/top?campus=&course=&year=&semester=&subject=`
   - Returns top 20 materials sorted by likes, reviews, and downloads
   - Query parameters are optional filters

4. **Search Materials**
   - GET `/search?searchQuery=&campus=&course=&year=&semester=&subject=`
   - searchQuery: searches in title, keywords, and description
   - Other query parameters are optional filters

5. **Get Material by ID**
   - GET `/:id`
   - Returns specific study material

6. **Like Material**
   - POST `/:id/like`
   - Body: { "userId": "string" }

7. **Unlike Material**
   - POST `/:id/unlike`
   - Body: { "userId": "string" }

8. **Add Review**
   - POST `/:id/review`
   - Body: { "userId": "string", "rating": number (1-5), "review": "string" }

9. **Update Rating (Legacy)**
   - PUT `/:id/rating`
   - Body: { "rating": number (0-5) }

10. **Track Download**
    - POST `/:id/download`
    - Increments download count

11. **Delete Material**
    - DELETE `/:id`
    - Removes study material

## Forum Endpoints

### Base URL: http://localhost:5001/api/forum

### Available Endpoints:

1. **Get All Posts**
   - GET `/posts`
   - Returns all forum posts with optional filtering and sorting

2. **Create Post**
   - POST `/posts`
   - Body: { "title", "description", "campus", "course", "year", "semester", "subject", "tags" }

3. **Like Post**
   - POST `/posts/:id/like`
   - Body: { "userId": "string" }

4. **Dislike Post**
   - POST `/posts/:id/dislike`
   - Body: { "userId": "string" }

5. **Add Comment**
   - POST `/posts/:id/comments`
   - Body: { "text": "string" }

## Admin Endpoints

### Base URL: http://localhost:5001/api/admin

### Available Endpoints:

1. **Get Dashboard Stats**
   - GET `/stats`
   - Returns overview statistics for admin dashboard

2. **Get Analytics Report**
   - GET `/analytics`
   - Returns comprehensive analytics and reports

3. **Get All Complaints**
   - GET `/complaints?status=&type=&category=`
   - Returns all complaints with optional filtering

4. **Update Complaint Status**
   - PUT `/complaints/:id`
   - Body: { "status": "pending|resolved|rejected", "adminNotes": "string" }

5. **Create Complaint**
   - POST `/complaints`
   - Body: { "title", "description", "type", "category", "againstUser", "againstMaterial", "againstPost" }

6. **Get All Users**
   - GET `/users?status=&role=&campus=`
   - Returns all users with optional filtering

7. **Ban User**
   - PUT `/users/:userId/ban`
   - Body: { "reason": "string" }

8. **Suspend User**
   - PUT `/users/:userId/suspend`
   - Body: { "reason": "string", "duration": number (days) }

9. **Reactivate User**
   - PUT `/users/:userId/reactivate`

10. **Delete Material (Admin)**
    - DELETE `/materials/:materialId`

11. **Delete Forum Post (Admin)**
    - DELETE `/forum/posts/:postId`

### Example Usage:

```bash
# StudyMaterial Examples
# Upload a file
curl -X POST http://localhost:5001/api/study-materials/upload \
  -F "file=@/path/to/file.pdf" \
  -F "title=Advanced Mathematics Notes" \
  -F "description=Comprehensive notes for advanced mathematics" \
  -F "campus=Main Campus" \
  -F "course=Computer Science" \
  -F "year=2024" \
  -F "semester=Spring" \
  -F "subject=Mathematics" \
  -F "keywords=calculus,algebra,trigonometry"

# Get all materials
curl http://localhost:5001/api/study-materials/all

# Get top materials
curl "http://localhost:5001/api/study-materials/top?campus=Main%20Campus"

# Search materials
curl "http://localhost:5001/api/study-materials/search?searchQuery=mathematics&campus=Main%20Campus"

# Like a material
curl -X POST http://localhost:5001/api/study-materials/[material-id]/like \
  -H "Content-Type: application/json" \
  -d '{"userId": "student123"}'

# Add review
curl -X POST http://localhost:5001/api/study-materials/[material-id]/review \
  -H "Content-Type: application/json" \
  -d '{"userId": "student123", "rating": 4, "review": "Great notes, very helpful!"}'

# Forum Examples
# Get all posts
curl http://localhost:5001/api/forum/posts

# Create post
curl -X POST http://localhost:5001/api/forum/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Help with OOP Assignment",
    "description": "I need help with my Object Oriented Programming assignment",
    "campus": "Malabe",
    "course": "IT",
    "year": "2",
    "semester": "1",
    "subject": "OOP",
    "tags": "oop,assignment,help"
  }'

# Admin Examples
# Get dashboard stats
curl http://localhost:5001/api/admin/stats

# Get analytics report
curl http://localhost:5001/api/admin/analytics

# Get all complaints
curl http://localhost:5001/api/admin/complaints

# Update complaint status
curl -X PUT http://localhost:5001/api/admin/complaints/[complaint-id] \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved", "adminNotes": "Issue has been addressed"}'

# Create complaint
curl -X POST http://localhost:5001/api/admin/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inappropriate Content",
    "description": "This material contains inappropriate content",
    "type": "material",
    "category": "inappropriate_content",
    "againstMaterial": "[material-id]"
  }'

# Get all users
curl http://localhost:5001/api/admin/users

# Ban user
curl -X PUT http://localhost:5001/api/admin/users/[user-id]/ban \
  -H "Content-Type: application/json" \
  -d '{"reason": "Repeated violations of community guidelines"}'

# Suspend user
curl -X PUT http://localhost:5001/api/admin/users/[user-id]/suspend \
  -H "Content-Type: application/json" \
  -d '{"reason": "Temporary suspension", "duration": 7}'

# Reactivate user
curl -X PUT http://localhost:5001/api/admin/users/[user-id]/reactivate

# Delete material (admin)
curl -X DELETE http://localhost:5001/api/admin/materials/[material-id]

# Delete forum post (admin)
curl -X DELETE http://localhost:5001/api/admin/forum/posts/[post-id]
```

### Response Format:

Study materials now include:
- `likeCount`: Number of likes
- `unlikeCount`: Number of unlikes
- `reviewCount`: Number of reviews
- `likedBy`: Array of user IDs who liked
- `unlikedBy`: Array of user IDs who unliked
- `reviewedBy`: Array of review objects with userId, rating, review, and createdAt

### File Upload Directory:
- Uploaded files are stored in: `backend/uploads/`
- Files are served at: `http://localhost:5001/uploads/[filename]`
