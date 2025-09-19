import { StudyMaterial } from "../models/StudyMaterial.js";

// @desc Upload study material
export const uploadMaterial = async (req, res) => {
  try {
    const {
      title,
      description,
      campus,
      course,
      year,
      semester,
      subject,
      keywords,
    } = req.body;

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newMaterial = new StudyMaterial({
      title,
      description,
      campus,
      course,
      year,
      semester,
      subject,
      keywords: keywords ? keywords.split(",") : [],
      fileUrl,
      uploadedBy: "student1", // TODO: replace with logged-in student ID later
    });

    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// @desc Get all materials
export const getMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Fetching failed", error: error.message });
  }
};

// @desc Get material by ID
export const getMaterialById = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Fetching failed", error: error.message });
  }
};

// @desc Search materials by keywords and title
export const searchMaterials = async (req, res) => {
  try {
    const { searchQuery, campus, course, year, semester, subject } = req.query;
    
    let query = {};
    
    // Text search for keywords and title
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { keywords: { $in: [new RegExp(searchQuery, 'i')] } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    // Filter by other criteria
    if (campus) query.campus = campus;
    if (course) query.course = course;
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;
    
    const materials = await StudyMaterial.find(query).sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

// @desc Get top materials by likes and reviews
export const getTopMaterials = async (req, res) => {
  try {
    const { campus, course, year, semester, subject } = req.query;
    
    let query = {};
    
    // Filter by criteria
    if (campus) query.campus = campus;
    if (course) query.course = course;
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;
    
    const materials = await StudyMaterial.find(query)
      .sort({ likeCount: -1, reviewCount: -1, downloadCount: -1 })
      .limit(20);
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Fetching top materials failed", error: error.message });
  }
};

// @desc Like a material
export const likeMaterial = async (req, res) => {
  try {
    const { userId } = req.body; // TODO: get from auth middleware
    const materialId = req.params.id;
    
    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    
    // Check if user already liked
    if (material.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Already liked this material" });
    }
    
    // Remove from unliked if previously unliked
    if (material.unlikedBy.includes(userId)) {
      material.unlikedBy = material.unlikedBy.filter(id => id !== userId);
      material.unlikeCount = Math.max(0, material.unlikeCount - 1);
    }
    
    // Add to liked
    material.likedBy.push(userId);
    material.likeCount += 1;
    
    await material.save();
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Like operation failed", error: error.message });
  }
};

// @desc Unlike a material
export const unlikeMaterial = async (req, res) => {
  try {
    const { userId } = req.body; // TODO: get from auth middleware
    const materialId = req.params.id;
    
    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    
    // Check if user already unliked
    if (material.unlikedBy.includes(userId)) {
      return res.status(400).json({ message: "Already unliked this material" });
    }
    
    // Remove from liked if previously liked
    if (material.likedBy.includes(userId)) {
      material.likedBy = material.likedBy.filter(id => id !== userId);
      material.likeCount = Math.max(0, material.likeCount - 1);
    }
    
    // Add to unliked
    material.unlikedBy.push(userId);
    material.unlikeCount += 1;
    
    await material.save();
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Unlike operation failed", error: error.message });
  }
};

// @desc Add review and rating
export const addReview = async (req, res) => {
  try {
    const { userId, rating, review } = req.body; // TODO: get userId from auth middleware
    const materialId = req.params.id;
    
    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    
    // Check if user already reviewed
    const existingReviewIndex = material.reviewedBy.findIndex(r => r.userId === userId);
    
    if (existingReviewIndex !== -1) {
      // Update existing review
      material.reviewedBy[existingReviewIndex] = {
        userId,
        rating,
        review,
        createdAt: new Date()
      };
    } else {
      // Add new review
      material.reviewedBy.push({
        userId,
        rating,
        review
      });
      material.reviewCount += 1;
    }
    
    // Calculate average rating
    const totalRating = material.reviewedBy.reduce((sum, r) => sum + r.rating, 0);
    material.rating = totalRating / material.reviewedBy.length;
    
    await material.save();
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Review operation failed", error: error.message });
  }
};

// @desc Update material rating (legacy function)
export const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true }
    );
    
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Rating update failed", error: error.message });
  }
};

// @desc Delete material
export const deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    
    res.json({ message: "Study material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};

// @desc Track download
export const trackDownload = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    
    if (!material) {
      return res.status(404).json({ message: "Study material not found" });
    }
    
    res.json({ message: "Download tracked successfully", downloadCount: material.downloadCount });
  } catch (error) {
    res.status(500).json({ message: "Download tracking failed", error: error.message });
  }
};
