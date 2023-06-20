import React, { useState } from "react";
import { Dimmer, Modal } from "semantic-ui-react";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import useAxios from "../../hooks/use-axios";
import { FileUploader } from "react-drag-drop-files";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const CategoryUplodImgModel = ({
  bannerLink,
  sliderLink,
  text,
  id,
  onReload,
}) => {
  const [open, setOpen] = useState(false);
  const [fileSlider, setFileSlider] = useState(null);
  const [fileBanner, setFileBanner] = useState(null);
  const fileTypes = ["PNG"];
  const fileTypess = ["PNG", "JPG", "WEBP"];

  const { run: runUpload, isLoading: isloadingUpload } = useAxios([]);

  const handleChangeSlider = (fileOne) => {
    const formData = new FormData();
    formData.append("slider", fileOne);
    runUpload(
      authAxios.put(api.app.category.uploadImages(id), formData).then((res) => {
        onReload();
      })
    );
    setFileSlider(fileOne);
  };

  const handleChangeBanner = (fileTwo) => {
    const formData = new FormData();
    formData.append("banner", fileTwo);
    runUpload(
      authAxios.put(api.app.category.uploadImages(id), formData).then((res) => {
        onReload();
      })
    );
    setFileBanner(fileTwo);
  };

  console.log("====================================");
  console.log(fileSlider, fileBanner);
  console.log("====================================");

  return (
    <Modal
      className="w-[780px] h-[426px] rounded-2xl bg-white border-[1px] border-primary scale-in overflow-hidden"
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
      <div className="w-[780px] h-[426px] rounded-2xl bg-white border-[1px] border-primary ">
        <div className=" shadow h-[240px] rounded-xl bg-white ">
          <img
            className="w-full h-[240px] object-cover "
            src={
              fileBanner
                ? fileBanner && URL?.createObjectURL(fileBanner)
                : bannerLink
            }
            alt="bannerLink"
          />
          <button className="bg-secondary-light text-secondary  w-[132px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2 absolute right-2 top-[200px]">
            <FileUploader
              maxSize={1}
              handleChange={handleChangeBanner}
              name="file"
              types={fileTypess}
            >
              Upload banner Photo
            </FileUploader>
          </button>
          <div className="rounded-full w-40 h-40 absolute top-[210px] left-8 flex gap-x-5">
            <img
              className="w-full h-full object-cover rounded-full group-hover:scale-110 duration-300 ease-in-out transform"
              src={
                fileSlider
                  ? fileSlider && URL?.createObjectURL(fileSlider)
                  : sliderLink
              }
              alt="sliderLink"
            />
            <div className="flex-col">
              <h1 className="text-gray-dark mx-auto mt-[45px] font-semibold">
                {text}
              </h1>
              <button className="bg-secondary-veryLight text-secondary opacity-100 w-[132px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2 overflow-hidden">
                <FileUploader
                  maxSize={1}
                  handleChange={handleChangeSlider}
                  name="file"
                  types={fileTypes}
                >
                  Upload slider Photo
                </FileUploader>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default CategoryUplodImgModel;
