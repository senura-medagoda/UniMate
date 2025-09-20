# Test Script for StudyMaterial API

## Test the new functionality:

### 1. Upload a test material
```bash
curl -X POST http://localhost:5001/api/study-materials/upload \
  -F "title=Test Mathematics Notes" \
  -F "description=Test notes for mathematics" \
  -F "campus=Main Campus" \
  -F "course=Computer Science" \
  -F "year=2024" \
  -F "semester=Spring" \
  -F "subject=Mathematics" \
  -F "keywords=calculus,algebra,test"
```

### 2. Get all materials
```bash
curl http://localhost:5001/api/study-materials/all
```

### 3. Search for materials
```bash
curl "http://localhost:5001/api/study-materials/search?searchQuery=mathematics"
```

### 4. Get top materials
```bash
curl "http://localhost:5001/api/study-materials/top"
```

### 5. Like a material (replace [material-id] with actual ID)
```bash
curl -X POST http://localhost:5001/api/study-materials/[material-id]/like \
  -H "Content-Type: application/json" \
  -d '{"userId": "student123"}'
```

### 6. Add a review (replace [material-id] with actual ID)
```bash
curl -X POST http://localhost:5001/api/study-materials/[material-id]/review \
  -H "Content-Type: application/json" \
  -d '{"userId": "student123", "rating": 5, "review": "Excellent notes!"}'
```

## Expected Results:
- Upload should return the created material with default counts (0 likes, 0 unlikes, 0 reviews)
- Search should find materials by title, keywords, or description
- Top materials should be sorted by likeCount, reviewCount, downloadCount
- Like/Unlike should update the counts and user arrays
- Review should update the rating and add to reviewedBy array
