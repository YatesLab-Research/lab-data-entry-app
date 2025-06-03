import React, { useState } from "react";
import Papa from "papaparse";
import {
  sampleStatusOptions,
  publicationStatusOptions,
  referenceGenomes,
  qcStatus,
  cancerTypes,
  omicsTypes,
  dataProcessingStages,
  fileTypes
} from "./ontologyOptions";


const LabDataEntryTool = () => {
  const [formData, setFormData] = useState({
    Study_Name: "",
    Sample_ID: "",
    Tissue_Type: "",
    Anatomical_Site: "",
    Sample_Status: "",
    Omics_Assay_ID: "",
    Linked_Study_Name: "",
    Cancer_Type: "",
    Cohort_Description: "",
    Sample_Size: "",
    Omics_Data_Types: "",
    File_Types: "",
    Data_Processing_Stage: "",
    Storage_Location: "",
    Responsible_Person: "",
    IRB_or_Consent_Notes: "",
    Publication_Status: "",
    DOI_or_Publication_Link: "",
    Date_Added: "",
    Last_Updated: "",
    Assay_Technology: "",
    Data_Format_Version: "",
    Quality_Control_Status: "",
    Analysis_Pipeline_Used: "",
    Reference_Genome: "",
    Batch_ID: "",
    Notes: "",
    omicsType: "",
    antibodyUsed: "",
    spatialResolution: "",
    targetProtein: "",
    tissuePreservation: ""
  });

  const [csvData, setCsvData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCSVEdit = (e, rowIndex, field) => {
    const updatedData = [...csvData];
    updatedData[rowIndex][field] = e.target.value;
    setCsvData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    alert("Form submitted! Check console for details.");
  };

  const handleExport = () => {
    const csv = Papa.unparse([formData]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "entries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportTable = () => {
    if (csvData.length === 0) return;
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "imported_table.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  const renderInput = (key, value) => {
    const dropdowns = {
      Sample_Status: sampleStatusOptions,
      Cancer_Type: cancerTypes,
      Publication_Status: publicationStatusOptions,
      Quality_Control_Status: qcStatus,
      Reference_Genome: referenceGenomes,
      omicsType: omicsTypes,
      Data_Processing_Stage: dataProcessingStages,
      File_Types: fileTypes
    };
    

    if (dropdowns[key]) {
      return (
        <select name={key} value={value} onChange={handleChange}>
          {dropdowns[key].map((option) => (
            <option key={option} value={option}>{option || `Select ${key.replace(/_/g, ' ')}`}</option>
          ))}
        </select>
      );
    }

    const inputType = key.includes("Date") ? "date" : key.includes("Size") ? "number" : "text";
    return (
      <input
        type={inputType}
        name={key}
        value={value}
        onChange={handleChange}
      />
    );
  };

  const formSections = [
    {
      title: "Study & Sample Information",
      fields: ["Study_Name", "Sample_ID", "Tissue_Type", "Anatomical_Site", "Sample_Status", "Linked_Study_Name", "Cancer_Type", "Cohort_Description", "Sample_Size"]
    },
    {
      title: "Assay & Data Details",
      fields: ["Omics_Assay_ID", "Omics_Data_Types", "File_Types", "Data_Processing_Stage", "Assay_Technology", "Data_Format_Version", "Analysis_Pipeline_Used", "Reference_Genome"]
    },
    {
      title: "OMICS",
      fields: ["omicsType", "antibodyUsed", "spatialResolution", "targetProtein", "tissuePreservation"]
    },
    {
      title: "Quality & Metadata",
      fields: ["Date_Added", "Last_Updated", "Quality_Control_Status", "Batch_ID", "Notes"]
    },
    {
      title: "Storage & Responsibility",
      fields: ["Storage_Location", "Responsible_Person", "IRB_or_Consent_Notes", "Publication_Status", "DOI_or_Publication_Link"]
    }
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "auto", fontFamily: "Segoe UI, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#004080" }}>Lab Data Entry Form</h2>

        {formSections.map((section) => (
          <fieldset key={section.title} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <legend style={{ fontWeight: "bold", color: "#333" }}>{section.title}</legend>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              {section.fields.map((key) => (
                <label key={key} style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: "600", marginBottom: "4px" }}>{key.replace(/_/g, ' ')}:</span>
                  {renderInput(key, formData[key])}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <label>
          Import CSV:
          <input type="file" accept=".csv" onChange={handleImport} />
        </label>
        <div style={{ marginTop: "10px" }}>
          <button type="button" onClick={handleExport} style={{ marginRight: "10px", backgroundColor: "#007bff", color: "white", padding: "10px", border: "none", borderRadius: "5px" }}>Export Form as CSV</button>
          <button type="submit" style={{ backgroundColor: "#28a745", color: "white", padding: "10px", border: "none", borderRadius: "5px" }}>Submit</button>
        </div>
      </form>

      {csvData.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#333" }}>Imported CSV Data</h3>
          <button onClick={handleExportTable} style={{ marginBottom: "10px", backgroundColor: "#6c757d", color: "white", padding: "8px", border: "none", borderRadius: "5px" }}>Export Table as CSV</button>
          <div style={{ overflowX: "auto", maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", borderRadius: "5px" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }}>
              <thead style={{ backgroundColor: "#e9ecef" }}>
                <tr>
                  {Object.keys(csvData[0]).map((key) => (
                    <th key={key} style={{ border: "1px solid #dee2e6", padding: "6px" }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, rowIndex) => (
                  <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? "#f8f9fa" : "#ffffff" }}>
                    {Object.entries(row).map(([field, val], colIndex) => (
                      <td key={colIndex} style={{ border: "1px solid #dee2e6", padding: "4px" }}>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleCSVEdit(e, rowIndex, field)}
                          style={{ width: "100%", fontSize: "12px", padding: "2px", border: "1px solid #ccc", borderRadius: "4px" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabDataEntryTool;
