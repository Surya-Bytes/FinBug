import React, { useRef, useState } from 'react';
import { LuUpload } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosinstance';
import toast from 'react-hot-toast';

const CSVBulkUpload = ({ type, onUploadComplete, apiPath }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post(apiPath, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { summary, errors } = response.data;

      // Show success message
      toast.success(
        `Upload completed! ${summary.success} ${type}(s) added successfully` +
        (summary.failed > 0 ? `, ${summary.failed} failed` : '')
      );

      // Show detailed errors if any
      if (errors && errors.length > 0) {
        console.error('Upload errors:', errors);
        toast.error(`${errors.length} row(s) had errors. Check console for details.`);
      }

      // Trigger callback to refresh data
      if (onUploadComplete) {
        onUploadComplete();
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('CSV upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload CSV file');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleButtonClick}
        disabled={uploading}
        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title={`Upload ${type}s from CSV file`}
      >
        <LuUpload className={uploading ? 'animate-pulse' : ''} />
        {uploading ? 'Uploading...' : `Import CSV`}
      </button>
    </>
  );
};

export default CSVBulkUpload;
