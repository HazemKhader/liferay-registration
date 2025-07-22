import React, { useState, useCallback } from "react";
import ImageOCRReader from "../ImageOCRReader";
import "./styles.css";

export default function Form({
  formData,
  onChange,
  onSubmit,
  onClear,
  shouldReset,
}) {
  const handleDocumentRead = useCallback(
    (result) => {
      if (result.error) {
        Liferay.Util.openToast({
          message: result.error,
          type: "danger",
        });
        return;
      }

      onChange({
        target: {
          name: "documentFile",
          value: result.base64,
        },
      });

      if (result.documentId) {
        onChange({
          target: {
            name: "documentId",
            value: result.documentId,
          },
        });
      }
    },
    [onChange]
  );

  return (
    <form className="registration-form" onSubmit={onSubmit}>
      <div className="form-group">
        <input
          name="firstName"
          placeholder="First Name"
          onChange={onChange}
          value={formData.firstName || ""}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          name="lastName"
          placeholder="Last Name"
          onChange={onChange}
          value={formData.lastName || ""}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={onChange}
          value={formData.email || ""}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <select
          name="documentType"
          onChange={onChange}
          value={formData.documentType}
          required
          className="form-control"
        >
          <option value="">Select Document Type</option>
          <option value="ID">ID Card</option>
          <option value="PASSPORT">Passport</option>
        </select>
      </div>

      <div className="form-group">
        <input
          name="documentId"
          placeholder="Document ID"
          onChange={onChange}
          value={formData.documentId || ""}
          required
          className="form-control"
        />
      </div>

      <ImageOCRReader
        onDocumentRead={handleDocumentRead}
        documentType={formData.documentType}
        shouldReset={shouldReset}
      />

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Submit Registration
        </button>
        <button type="button" onClick={onClear} className="clear-btn">
          Clear Form
        </button>
      </div>
    </form>
  );
}
