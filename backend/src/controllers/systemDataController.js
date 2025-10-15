// SM - System Data Controller
import Campus from '../models/Campus.js';
import Course from '../models/Course.js';
import Year from '../models/Year.js';
import Semester from '../models/Semester.js';
import Subject from '../models/Subject.js';

// Get all system data for student forms
export const getSystemData = async (req, res) => {
  try {
    const [campuses, courses, years, semesters, subjects] = await Promise.all([
      Campus.find({ isActive: true }).sort({ name: 1 }).select('-__v'),
      Course.find({ isActive: true }).sort({ name: 1 }).select('-__v'),
      Year.find({ isActive: true }).sort({ year: 1 }).select('-__v'),
      Semester.find({ isActive: true }).sort({ semester: 1 }).select('-__v'),
      Subject.find({ isActive: true }).sort({ name: 1 }).select('-__v')
    ]);

    res.status(200).json({
      success: true,
      data: {
        campuses,
        courses,
        years,
        semesters,
        subjects
      }
    });
  } catch (error) {
    console.error('Error fetching system data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Campus CRUD operations
export const getCampuses = async (req, res) => {
  try {
    const campuses = await Campus.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(campuses);
  } catch (error) {
    console.error('Error fetching campuses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createCampus = async (req, res) => {
  try {
    const { name, code, location, description } = req.body;

    const existingCampus = await Campus.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        ...(code ? [{ code: { $regex: new RegExp(`^${code}$`, 'i') } }] : [])
      ]
    });

    if (existingCampus) {
      return res.status(400).json({
        success: false,
        message: 'Campus with this name or code already exists'
      });
    }

    const campusData = {
      name: name.trim()
    };
    
    // Only add code if it's provided and not empty
    if (code && code.trim()) {
      campusData.code = code.trim().toUpperCase();
    }
    if (location && location.trim()) {
      campusData.location = location.trim();
    }
    if (description && description.trim()) {
      campusData.description = description.trim();
    }
    
    const campus = new Campus(campusData);

    await campus.save();

    res.status(201).json({
      success: true,
      message: 'Campus created successfully',
      data: campus
    });
  } catch (error) {
    console.error('Error creating campus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Course CRUD operations
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { name, code, department, duration, description } = req.body;

    const existingCourse = await Course.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        ...(code ? [{ code: { $regex: new RegExp(`^${code}$`, 'i') } }] : [])
      ]
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course with this name or code already exists'
      });
    }

    const courseData = {
      name: name.trim()
    };
    
    // Only add code if it's provided and not empty
    if (code && code.trim()) {
      courseData.code = code.trim().toUpperCase();
    }
    if (department && department.trim()) {
      courseData.department = department.trim();
    }
    if (duration) {
      courseData.duration = duration;
    }
    if (description && description.trim()) {
      courseData.description = description.trim();
    }
    
    const course = new Course(courseData);

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Year CRUD operations
export const getYears = async (req, res) => {
  try {
    const years = await Year.find({ isActive: true }).sort({ year: 1 });
    res.status(200).json(years);
  } catch (error) {
    console.error('Error fetching years:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createYear = async (req, res) => {
  try {
    const { year, name, description } = req.body;

    const existingYear = await Year.findOne({ 
      $or: [
        { year: parseInt(year) },
        { name: { $regex: new RegExp(`^${name}$`, 'i') } }
      ]
    });

    if (existingYear) {
      return res.status(400).json({
        success: false,
        message: 'Year with this number or name already exists'
      });
    }

    const yearData = new Year({
      year: parseInt(year),
      name: name.trim(),
      description: description ? description.trim() : undefined
    });

    await yearData.save();

    res.status(201).json({
      success: true,
      message: 'Year created successfully',
      data: yearData
    });
  } catch (error) {
    console.error('Error creating year:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Semester CRUD operations
export const getSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find({ isActive: true }).sort({ semester: 1 });
    res.status(200).json(semesters);
  } catch (error) {
    console.error('Error fetching semesters:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createSemester = async (req, res) => {
  try {
    const { semester, name, description } = req.body;

    const existingSemester = await Semester.findOne({ 
      $or: [
        { semester: parseInt(semester) },
        { name: { $regex: new RegExp(`^${name}$`, 'i') } }
      ]
    });

    if (existingSemester) {
      return res.status(400).json({
        success: false,
        message: 'Semester with this number or name already exists'
      });
    }

    const semesterData = new Semester({
      semester: parseInt(semester),
      name: name.trim(),
      description: description ? description.trim() : undefined
    });

    await semesterData.save();

    res.status(201).json({
      success: true,
      message: 'Semester created successfully',
      data: semesterData
    });
  } catch (error) {
    console.error('Error creating semester:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update and Delete functions for Campus
export const updateCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Campus name is required'
      });
    }

    const campus = await Campus.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: 'Campus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campus updated successfully',
      data: campus
    });
  } catch (error) {
    console.error('Error updating campus:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Campus with this name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

export const deleteCampus = async (req, res) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findByIdAndDelete(id);

    if (!campus) {
      return res.status(404).json({
        success: false,
        message: 'Campus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campus deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update and Delete functions for Course
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Course name is required'
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Course with this name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update and Delete functions for Year
export const updateYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, name } = req.body;
    
    if (!year || !name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Year number and name are required'
      });
    }

    const yearData = await Year.findByIdAndUpdate(
      id,
      { year: parseInt(year), name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!yearData) {
      return res.status(404).json({
        success: false,
        message: 'Year not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Year updated successfully',
      data: yearData
    });
  } catch (error) {
    console.error('Error updating year:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Year with this number or name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

export const deleteYear = async (req, res) => {
  try {
    const { id } = req.params;

    const year = await Year.findByIdAndDelete(id);

    if (!year) {
      return res.status(404).json({
        success: false,
        message: 'Year not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Year deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting year:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update and Delete functions for Semester
export const updateSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const { semester, name } = req.body;
    
    if (!semester || !name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Semester number and name are required'
      });
    }

    const semesterData = await Semester.findByIdAndUpdate(
      id,
      { semester: parseInt(semester), name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!semesterData) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Semester updated successfully',
      data: semesterData
    });
  } catch (error) {
    console.error('Error updating semester:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Semester with this number or name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

export const deleteSemester = async (req, res) => {
  try {
    const { id } = req.params;

    const semester = await Semester.findByIdAndDelete(id);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: 'Semester not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Semester deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting semester:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Subject CRUD operations
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { name, code, category, description } = req.body;

    const existingSubject = await Subject.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        ...(code ? [{ code: { $regex: new RegExp(`^${code}$`, 'i') } }] : [])
      ]
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject with this name or code already exists'
      });
    }

    const subjectData = {
      name: name.trim()
    };
    
    // Only add code if it's provided and not empty
    if (code && code.trim()) {
      subjectData.code = code.trim().toUpperCase();
    }
    if (category && category.trim()) {
      subjectData.category = category.trim();
    }
    if (description && description.trim()) {
      subjectData.description = description.trim();
    }
    
    const subject = new Subject(subjectData);

    await subject.save();

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subject name is required'
      });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Subject with this name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
