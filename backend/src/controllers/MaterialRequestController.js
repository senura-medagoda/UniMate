import { MaterialRequest } from "../models/MaterialRequest.js";
import { StudyMaterial } from "../models/StudyMaterial.js";

// @desc Create a new material request
export const createRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      campus,
      course,
      year,
      semester,
      urgency,
      requestedBy
    } = req.body;

    const request = new MaterialRequest({
      title,
      description,
      subject,
      campus,
      course,
      year,
      semester,
      urgency,
      requestedBy
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: "Failed to create request", error: error.message });
  }
};

// @desc Get all material requests
export const getAllRequests = async (req, res) => {
  try {
    const { status, campus, course, subject, urgency } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (campus) query.campus = campus;
    if (course) query.course = course;
    if (subject) query.subject = subject;
    if (urgency) query.urgency = urgency;
    
    const requests = await MaterialRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error: error.message });
  }
};

// @desc Get request by ID
export const getRequestById = async (req, res) => {
  try {
    const request = await MaterialRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch request", error: error.message });
  }
};

// @desc Update request status to fulfilled
export const fulfillRequest = async (req, res) => {
  try {
    const { fulfilledBy, fulfilledMaterial } = req.body;
    const { id } = req.params;
    
    const request = await MaterialRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: "Request cannot be fulfilled" });
    }
    
    request.status = 'fulfilled';
    request.fulfilledBy = fulfilledBy;
    request.fulfilledMaterial = fulfilledMaterial;
    request.fulfilledAt = new Date();
    
    await request.save();
    
    // TODO: Send notification and email to requested student
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to fulfill request", error: error.message });
  }
};

// @desc Get requests by user
export const getRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requests = await MaterialRequest.find({ requestedBy: userId })
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user requests", error: error.message });
  }
};

// @desc Delete request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await MaterialRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    // Only allow deletion if request is pending or by the original requester
    if (request.status !== 'pending') {
      return res.status(400).json({ message: "Cannot delete fulfilled or expired request" });
    }
    
    await MaterialRequest.findByIdAndDelete(id);
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request", error: error.message });
  }
};

// @desc Update request
export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated
    delete updateData.status;
    delete updateData.fulfilledBy;
    delete updateData.fulfilledMaterial;
    delete updateData.fulfilledAt;
    
    const request = await MaterialRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to update request", error: error.message });
  }
};

// @desc Get request statistics
export const getRequestStats = async (req, res) => {
  try {
    const stats = await MaterialRequest.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          fulfilled: { $sum: { $cond: [{ $eq: ["$status", "fulfilled"] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] } }
        }
      }
    ]);
    
    const campusStats = await MaterialRequest.aggregate([
      {
        $group: {
          _id: "$campus",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const subjectStats = await MaterialRequest.aggregate([
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      overview: stats[0] || { total: 0, pending: 0, fulfilled: 0, expired: 0 },
      byCampus: campusStats,
      bySubject: subjectStats
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch request stats", error: error.message });
  }
};
