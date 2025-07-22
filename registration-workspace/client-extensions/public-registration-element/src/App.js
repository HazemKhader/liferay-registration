import React, { useState, useCallback } from "react";
import Form from "./components/Form";
import { addObject } from "./utils/Requests";
import "./styles.css";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  documentType: "ID",
  documentId: "",
  documentFile: null,
};

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [resetTrigger, setResetTrigger] = useState(false);
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await addObject(formData);
      if (!res.ok) throw new Error("Submission failed");

      Liferay.Util.openToast({
        message: "Registration submitted successfully!",
        type: "success",
      });

      // First trigger OCR reset
      setResetTrigger(true);
      // Then reset form after a small delay
      setTimeout(() => {
        setFormData(initialFormState);
        setResetTrigger(false);
      }, 100);
    } catch (err) {
      Liferay.Util.openToast({
        message: "Failed to submit registration. Please try again.",
        type: "danger",
      });
    }
  };

  const handleClear = () => {
    // First trigger OCR reset
    setResetTrigger(true);
    // Then reset form after a small delay
    setTimeout(() => {
      setFormData(initialFormState);
      setResetTrigger(false);
    }, 100);
  };

  return (
    <div className="registration-container">
      <h1>Registration Form</h1>
      <Form
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClear={handleClear}
        shouldReset={resetTrigger}
      />
    </div>
  );
}

export default App;
