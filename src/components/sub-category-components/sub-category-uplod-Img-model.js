import React, { useState } from "react";
import { Dimmer, Modal } from "semantic-ui-react";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import useAxios from "../../hooks/use-axios";
import { FileUploader } from "react-drag-drop-files";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const SubCategoryUplodImgModel = ({ imageLink, text, id, onReload }) => {
  const [open, setOpen] = useState(false);
  const [fileSlider, setFileSlider] = useState(null);
  const fileTypes = ["PNG"];

  const { run: runUpload, isLoading: isloadingUpload } = useAxios([]);

  const handleChangeSlider = (fileOne) => {
    const formData = new FormData();
    formData.append("slider", fileOne);
    runUpload(
      authAxios
        .put(api.app.subCategory.uploadImages(id), formData)
        .then((res) => {
          onReload();
        })
    );
    setFileSlider(fileOne);
  };

  return (
    <Modal
      className="w-[380px] h-[226px] rounded-2xl bg-white border-[1px] border-primary scale-in overflow-hidden"
      onClose={() => {
        setOpen(false);
        onReload();
      }}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <button className="mx-auto mt-56 group-hover:flex justify-center hidden text-primary text-xl underline">
          Edit
        </button>
      }
    >
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isloadingUpload}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="w-[380px] h-[226px] rounded-2xl bg-white border-[1px] border-primary ">
        <div className="py-9 px-5">
          <div className="rounded-full w-40 h-40 flex gap-x-5 border-[1px] border-primary bg-gray-light ">
            <img
              className="w-full h-full object-cover rounded-full bg-gray-light "
              src={
                fileSlider
                  ? fileSlider && URL?.createObjectURL(fileSlider)
                  : imageLink
              }
              alt="sliderLink"
            />
            <div className="flex-col">
              <h1 className="text-gray-dark mx-auto mt-[45px] font-semibold">
                {text}
              </h1>
              <button className="bg-secondary-veryLight text-secondary opacity-100 w-[200px] h-[23px] px-2 text-sm font-normal rounded-lg mt-2 overflow-hidden">
                <FileUploader
                  maxSize={1}
                  handleChange={handleChangeSlider}
                  name="file"
                  types={fileTypes}
                >
                  Upload Sub Gatogry slider Photo
                </FileUploader>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default SubCategoryUplodImgModel;
