import React, { useState } from "react";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [campus, setCampus] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("campus", campus);
    formData.append("course", course);
    formData.append("year", year);
    formData.append("semester", semester);
    formData.append("subject", subject);
    formData.append("keywords", keywords);

    // TODO: send formData to backend API
    console.log("Form submitted:", Object.fromEntries(formData.entries()));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Upload Study Material</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.docx,.pptx"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded"
          required
        />

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Campus */}
        <select
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Campus</option>
          <option value="Malabe">Malabe</option>
          <option value="Kandy">Kandy</option>
          <option value="Matara">Matara</option>
          <option value="Jaffna">Jaffna</option>
        </select>

        {/* Course */}
        <input
          type="text"
          placeholder="Course (e.g. IT, Engineering)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Year */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>

        {/* Semester */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
        </select>

        {/* Subject */}
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {/* Keywords */}
        <input
          type="text"
          placeholder="Keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default Upload;
