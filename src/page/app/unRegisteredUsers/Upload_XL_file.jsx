import React, { useState } from 'react';
import axios from 'axios';
import { authAxios } from '../../../config/axios-config';
import useAxios from '../../../hooks/use-axios';
import api from '../../../api';
import { Button, Dimmer } from 'semantic-ui-react';
import LodingTestAllatre from '../../../components/shared/lotties-file/loding-test-allatre';

const Upload_XL_file = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const {run, isLoading} = useAxios([])
  const handleUpload = async () => {
    if (!file) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('file', file);

    try {
    //   const response = await authAxios.post('http://localhost:3000/users/upload-excel', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
      run(
        authAxios.post(api.app.nonRegisteredUsers,formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
              },  
        })
      )
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
        <Dimmer
          className="fixed w-full h-full top-0 bg-white/50"
          active={isLoading}
          inverted
        >
          <LodingTestAllatre />
        </Dimmer>
      <input type="file" onChange={handleFileChange} />
      <Button className='' onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default Upload_XL_file;
