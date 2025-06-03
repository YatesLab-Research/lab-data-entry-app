# Lab Data Entry App

## Overview

The Lab Data Entry App is a user-friendly, React-based interface built to streamline the management of cancer research data in a structured, ontology-driven format. It supports data entry for breast, prostate, and pancreatic cancer studies, helping standardize metadata for omics experiments across multiple researchers in the lab.

Key features:
- Form-based entry with controlled vocabularies (dropdowns for consistency)
- Supports omics metadata: RNA-seq, ATAC-seq, Proteomics, Spatial Transcriptomics, etc.
- Bulk import and export of `.csv` files
- Editable, scrollable table of imported data
- Automatically deployed via [Vercel]

## Deployment

👉 The app is continuously deployed via Vercel. Every push to `main` triggers a live update.  


## Technologies Used

- React (with hooks)
- PapaParse (CSV import/export)
- Vercel (CI/CD and hosting)

## Project Structure

- `LabDataEntryTool.jsx`: Main component with form logic
- `ontologyOptions.js`: Controlled vocabularies for dropdown fields
- `entries.csv`: Example or exported metadata file

## Usage

1. Fill in the form using dropdowns for standardized fields
2. Export your entry as `entries.csv`
3. Import `.csv` files to review and edit entries
4. All metadata follows structured blocks for:
   - Sample and study information
   - Omics assay details
   - Data quality and versioning
   - Storage and IRB information

## Contribution

This tool is maintained by [Samuel Mwamburi].  
To contribute:
- Fork this repo
- Create a new branch
- Submit a pull request with your changes

## License

MIT License
