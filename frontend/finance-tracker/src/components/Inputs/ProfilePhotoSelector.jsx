import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
   const [previewUrl, setPreviewUrl] = useState(null);

   const handleImageChange = (e) => {
        const file = e.target.files[0];
    if (file) {
        // Update the image state
      setImage(file);

        // Generate a preview URL from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };
  
  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <label className="text-[13px] text-slate-800 mb-2">Profile Photo</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={inputRef}
        className="hidden"
      />

      {!image ? (
        <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full relative border border-gray-200 shadow-sm">
          <LuUser className="text-4xl text-slate-400" />

          <button
            type="button"
            onClick={onChooseFile}
            aria-label="upload"
            className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full absolute -bottom-1 -right-1 shadow-md"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          <div className="absolute -bottom-2 -right-2 flex gap-2">
            <button
              type="button"
              onClick={onChooseFile}
              className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full shadow-md"
              aria-label="change"
            >
              <LuUpload />
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full"
              aria-label="remove"
            >
              <LuTrash />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoSelector;