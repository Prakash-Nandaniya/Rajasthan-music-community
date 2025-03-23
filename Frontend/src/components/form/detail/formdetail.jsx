import React from "react";
import { useState } from "react";
import { Plus, X, Maximize } from "lucide-react";
import "./formdetail.css";

const validateMobileNumber = (number) => {
  const regex = /^\d{10}$/;
  return regex.test(number);
};

const handleDeleteMobileNumber = (index,formData,setFormData) => {
  const updatedaccess = formData.access.filter((_, i) => i !== index);
  setFormData((prev) => ({ ...prev, access: updatedaccess }));
};

const handleEditMobileNumber = (index,formData,setMobileNumberError,setEditIndex,setMobileNumberInput) => {
  setMobileNumberInput(formData.access[index]);
  setEditIndex(index);
  setMobileNumberError("");
};

export default function SiteDetailsPage({
  formData,
  handleInputChange,
  setFormData,
  setIsGroupNameChanged,
}) {
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [mobileNumberInput, setMobileNumberInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddMobileNumber = () => {
    if (!validateMobileNumber(mobileNumberInput)) {
      setMobileNumberError("Please enter a valid 10-digit mobile number.");
      return;
    }
  
    if (editIndex !== null) {
      const updatedaccess = [...formData.access];
      updatedaccess[editIndex] = mobileNumberInput;
      setFormData((prev) => ({ ...prev, access: updatedaccess }));
      setEditIndex(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        access: [...prev.access, mobileNumberInput],
      }));
    }
  
    setMobileNumberInput("");
    setMobileNumberError("");
  };
  
  return (
    <div className="card-container">
      <h2 className="title">Site Details</h2>
      <div className="form-grid">
        <div className="image-section">
          <span className="media-label">Main Image</span>
          {formData.mainImage ? (
            <div className="media-item">
              <img
                src={URL.createObjectURL(formData.mainImage)}
                alt="Selected"
                className="media-image-mainimage"
                onClick={() => setSelectedImage(URL.createObjectURL(formData.mainImage))}
              />
              <button
                className="remove-btn"
                onClick={() => setFormData((prev) => ({ ...prev, mainImage: null }))}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label className="media-add-mainimage">
              <Plus size={24} />
              <input
                type="file"
                accept="image/*"
                className="hidden-input"
                required
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mainImage: e.target.files[0] }))
                }
              />
            </label>
          )}

        </div>
        {selectedImage && (
          <div className="fullscreen-modal" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full Size" className="fullscreen-image" />
          </div>
        )}
        <input name="community" value={formData["community"]} placeholder="Community (Required)" required className="input-text" onChange={handleInputChange} />
        <input name="groupName" value={formData["groupName"]} placeholder="Group Name (Required)" required className="input-text" onChange={(e) => { handleInputChange(e);setIsGroupNameChanged(true);}}  />
        <textarea name="quickInfo" value={formData["quickInfo"]} placeholder="Quick Info (Required)" required className="textarea" onChange={handleInputChange} />
        <textarea name="detail" value={formData["detail"]} placeholder="Detail (Optional)" className="textarea" onChange={handleInputChange} />
        <div>
          <div className="mobile-number-section">
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <div>
              <input
                type="tel"
                id="mobileNumber"
                value={mobileNumberInput}
                onChange={(e) => {
                  setMobileNumberInput(e.target.value);
                  setMobileNumberError("");
                }}
                onBlur={() => {
                  if (mobileNumberInput && !validateMobileNumber(mobileNumberInput)) {
                    setMobileNumberError("Please enter a valid 10-digit mobile number.");
                  }
                }}
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                className={`mobile-number-input ${mobileNumberError ? "error" : ""}`}
              />
              {mobileNumberError && <p className="mobile-number-error">{mobileNumberError}</p>}
              {
                !mobileNumberError && (
                  <p className="mobile-number-error-space">-</p>
                ) /* Add a placeholder text to prevent layout shift when error disappears */
              }
            </div>
            <button type="button" onClick={handleAddMobileNumber} className="add-mobile-number-btn">
              {editIndex !== null ? "Update" : "Add"}
            </button>
            <div className="mobile-number-list">
              <ul>
                {formData.access.map((number, index) => (
                  <li key={index} className="mobile-number-item">
                    {number}
                    <button type="button" onClick={() => handleEditMobileNumber(index,formData,setMobileNumberError,setEditIndex,setMobileNumberInput)} className="edit-mobile-number-btn">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteMobileNumber(index,formData,setFormData)} className="delete-mobile-number-btn">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}











