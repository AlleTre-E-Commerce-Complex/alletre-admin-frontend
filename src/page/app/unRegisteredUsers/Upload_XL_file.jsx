import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { authAxios } from '../../../config/axios-config';
import useAxios from '../../../hooks/use-axios';
import api from '../../../api';
import { Button, Dimmer, Dropdown, Form } from 'semantic-ui-react';
import LodingTestAllatre from '../../../components/shared/lotties-file/loding-test-allatre';

const Upload_XL_file = () => {
  const [file, setFile] = useState(null);
  const [categorys, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
  const {run, isLoading} = useAxios([]);

  useEffect(() => {
    run(
      authAxios.get(api.app.category.default)
        .then((res) => {
          const categoryOptions = res?.data?.data?.map(category => ({
            key: category.id,
            text: category.nameEn,
            value: category.id
          }));
          setCategories(categoryOptions);
        })
    );
  }, []);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first.');
    if (!selectedCategory) return alert('Please select a category first.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('categoryId', selectedCategory);

    try {
      await run(
        authAxios.post(api.app.nonRegisteredUsers, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })  
      );
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      
      <Form>
        <Form.Field>
          <label>Select Category</label>
          <Dropdown
            placeholder='Select Category'
            fluid
            selection
            options={categorys}
            value={selectedCategory}
            onChange={(_, data) => setSelectedCategory(data.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Upload Excel File</label>
          <input type="file" onChange={handleFileChange} accept=".xlsx,.xls,.csv" />
        </Form.Field>

        <Button primary onClick={handleUpload} disabled={!file || !selectedCategory}>
          Upload
        </Button>
      </Form>
    </div>
  );
};

export default Upload_XL_file;
