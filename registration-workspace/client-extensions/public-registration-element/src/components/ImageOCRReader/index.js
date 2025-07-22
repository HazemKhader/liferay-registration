import React, { useState, useCallback } from "react";
import Tesseract from "tesseract.js";
import "./styles.css";

export default function ImageOCRReader({
  onDocumentRead,
  documentType,
  shouldReset,
}) {
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [fileName, setFileName] = useState("");

  React.useEffect(() => {
    if (shouldReset) {
      setCurrentFile(null);
      setFileName("");
    }
  }, [shouldReset]);

  React.useEffect(() => {
    if (currentFile && currentFile.text) {
      const newId = extractDocumentId(currentFile.text, documentType);
      onDocumentRead({
        ...currentFile,
        documentId: newId,
      });
    }
  }, [documentType, currentFile]);

  const extractDocumentId = useCallback((text, type) => {
    if (!text || !type) return "";

    const cleanText = text
      .replace(/[~\r\n]/g, "")
      .toUpperCase()
      .trim();

    console.log("Clean OCR text:", cleanText);

    const patterns = {
      ID: {
        mainPattern: /IDJOR([A-Z0-9]+)</i,
        fallbackPatterns: [
          /ID[^A-Z0-9]*([A-Z0-9]{8,})/i,
          /NATIONAL[^A-Z0-9]*ID[^A-Z0-9]*([A-Z0-9]{8,})/i,
          /\b[A-Z0-9]{8,9}\b/,
        ],
      },
      PASSPORT: {
        mainPattern: /<{5,}\s*([A-Z0-9]{7,9})<+/i,
        fallbackPatterns: [
          /PASSPORT[^A-Z0-9]*([A-Z0-9]{7,9})/i,
          /([A-Z0-9]{9})(?=<)/,
          /([A-Z0-9]{7,9})<{5,}/i,
          /\b[A-Z0-9]{8,9}\b/,
          /P<[A-Z]{3}([A-Z0-9]{7,9})</i,
        ],
      },
    };

    const docPatterns = patterns[type];
    if (!docPatterns) return "";

    let match = cleanText.match(docPatterns.mainPattern);
    if (!match && docPatterns.fallbackPatterns) {
      for (const pattern of docPatterns.fallbackPatterns) {
        match = cleanText.match(pattern);
        if (match) break;
      }
    }

    const extractedId = match ? match[1] || match[0] : "";
    console.log(`Extracted ${type} ID:`, extractedId);
    return extractedId;
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    try {
      const base64String = await readFileAsBase64(file);

      if (file.type === "application/pdf") {
        const pdfResult = {
          base64: base64String,
          documentId: "",
          text: "",
          fileName: file.name,
        };
        setCurrentFile(pdfResult);
        onDocumentRead(pdfResult);
        return;
      }

      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>",
      });

      const result = {
        base64: base64String,
        text,
        fileName: file.name,
        documentId: extractDocumentId(text, documentType),
      };

      setCurrentFile(result);
      onDocumentRead(result);
    } catch (error) {
      console.error("File processing error:", error);
      onDocumentRead({
        base64: "",
        documentId: "",
        error: "Processing failed: " + error.message,
        fileName: file.name,
      });
    } finally {
      setLoading(false);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="ocr-reader">
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="file-input"
        id="document-upload"
        disabled={loading}
      />
      <label
        htmlFor="document-upload"
        className={`file-label ${loading ? "loading" : ""} ${
          fileName ? "has-file" : ""
        }`}
      >
        {fileName ? (
          <div className="file-info">
            <span className="file-name">{fileName}</span>
            <span className="upload-text">
              {loading ? "Processing..." : "Change file"}
            </span>
          </div>
        ) : loading ? (
          "Processing Document..."
        ) : (
          "Upload Document"
        )}
      </label>
    </div>
  );
}
