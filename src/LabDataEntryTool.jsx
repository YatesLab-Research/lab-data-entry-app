
import { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Select, SelectItem } from './components/ui/select';
import { Upload, Download } from 'lucide-react';

export default function LabDataEntryTool() {
  const [formData, setFormData] = useState({
    studyName: '',
    sampleID: '',
    tissueType: '',
    anatomicalSite: '',
    sampleStatus: '',
    omicsType: '',
    assayTechnology: '',
    fileType: '',
    storageLocation: '',
    notes: ''
  });

  const [dataList, setDataList] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    setDataList([...dataList, formData]);
    alert('Data submitted successfully!');
    setFormData({
      studyName: '', sampleID: '', tissueType: '', anatomicalSite: '',
      sampleStatus: '', omicsType: '', assayTechnology: '', fileType: '',
      storageLocation: '', notes: ''
    });
  };

  const handleExport = () => {
    const csvRows = [
      Object.keys(formData).join(','),
      ...dataList.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lab_data_entries.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split('\n');
      const headers = lines[0].split(',');
      const entries = lines.slice(1).filter(Boolean).map(line => {
        const values = line.split(',');
        const entry = {};
        headers.forEach((header, i) => entry[header.trim()] = values[i]?.replaceAll('"', '').trim());
        return entry;
      });
      setDataList([...dataList, ...entries]);
      alert('Batch data imported successfully!');
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 grid gap-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Lab Data Entry Tool</h1>
      <Card>
        <CardContent className="grid gap-4 p-4">
          <Input name="studyName" placeholder="Study Name" value={formData.studyName} onChange={handleChange} />
          <Input name="sampleID" placeholder="Sample ID" value={formData.sampleID} onChange={handleChange} />
          <Input name="tissueType" placeholder="Tissue Type" value={formData.tissueType} onChange={handleChange} />
          <Input name="anatomicalSite" placeholder="Anatomical Site" value={formData.anatomicalSite} onChange={handleChange} />
          <Select name="sampleStatus" value={formData.sampleStatus} onChange={handleChange}>
            <SelectItem value="">Select Sample Status</SelectItem>
            <SelectItem value="Collected">Collected</SelectItem>
            <SelectItem value="Processed">Processed</SelectItem>
            <SelectItem value="Sequenced">Sequenced</SelectItem>
          </Select>
          <Select name="omicsType" value={formData.omicsType} onChange={handleChange}>
            <SelectItem value="">Select Omics Type</SelectItem>
            <SelectItem value="Proteomics">Proteomics</SelectItem>
            <SelectItem value="Transcriptomics">Transcriptomics</SelectItem>
            <SelectItem value="Single-cell Transcriptomics">Single-cell Transcriptomics</SelectItem>
          </Select>
          <Input name="assayTechnology" placeholder="Assay Technology" value={formData.assayTechnology} onChange={handleChange} />
          <Input name="fileType" placeholder="File Type (e.g., FASTQ, BAM)" value={formData.fileType} onChange={handleChange} />
          <Input name="storageLocation" placeholder="Storage Location (e.g., S3 Bucket)" value={formData.storageLocation} onChange={handleChange} />
          <Textarea name="notes" placeholder="Additional Notes" value={formData.notes} onChange={handleChange} />
          <Button onClick={handleSubmit}>Submit</Button>
          <div className="flex gap-2">
            <Button onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            <label className="cursor-pointer">
              <Input type="file" accept=".csv" onChange={handleImport} className="hidden" />
              <Button variant="secondary"><Upload className="mr-2 h-4 w-4" /> Import CSV</Button>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
