import React, { useState } from 'react';
import Papa from 'papaparse';

const allowedCancerTypes = ['Breast', 'Prostate', 'Pancreatic'];
const allowedPreservations = ['Fresh Frozen', 'FFPE', 'Cryopreserved'];
const allowedOmics = [
  'Bulk RNA-seq', 'Single-cell RNA-seq', 'CUT&RUN', 'Visium',
  'RIME (Chromatin Proteomics)', 'Spatial Proteomics (Akoya CODEX)'
];

const CSVValidator = () => {
  const [errors, setErrors] = useState([]);
  const [validRows, setValidRows] = useState([]);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        const errs = [];

        const requiredCols = ['Cancer_Type', 'Omics_Data_Types', 'Tissue_Preservation'];
        const missingCols = requiredCols.filter(col => !results.meta.fields.includes(col));
        if (missingCols.length > 0) {
          setErrors([`Missing required columns: ${missingCols.join(', ')}`]);
          return;
        }

        const validated = data.map((row, i) => {
          const rowErrors = [];

          if (!allowedCancerTypes.includes(row.Cancer_Type)) {
            rowErrors.push(`Invalid Cancer_Type "${row.Cancer_Type}"`);
          }

          if (!allowedPreservations.includes(row.Tissue_Preservation)) {
            rowErrors.push(`Invalid Tissue_Preservation "${row.Tissue_Preservation}"`);
          }

          if (!allowedOmics.includes(row.Omics_Data_Types)) {
            rowErrors.push(`Invalid Omics_Data_Types "${row.Omics_Data_Types}"`);
          }

          return rowErrors.length > 0 ? { row: i + 2, errors: rowErrors } : null;
        }).filter(Boolean);

        setErrors(validated);
        setValidRows(data.length - validated.length);
      }
    });
  };

  return (
    <div className="p-4">
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {errors.length > 0 ? (
        <div className="mt-4 text-red-600">
          <h4 className="font-bold">Validation Errors:</h4>
          <ul className="list-disc ml-6">
            {errors.map((err, idx) =>
              typeof err === 'string' ? (
                <li key={idx}>{err}</li>
              ) : (
                <li key={idx}>
                  Row {err.row}: {err.errors.join(', ')}
                </li>
              )
            )}
          </ul>
        </div>
      ) : validRows > 0 ? (
        <div className="mt-4 text-green-600">
          ✅ {validRows} rows validated successfully.
        </div>
      ) : null}
    </div>
  );
};

export default CSVValidator;
