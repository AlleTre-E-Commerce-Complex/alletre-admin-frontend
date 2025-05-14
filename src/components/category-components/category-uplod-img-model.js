import React, { useState } from "react";
import { Dimmer, Modal, Tab } from "semantic-ui-react";
import api from "../../api";
import { authAxios } from "../../config/axios-config";
import useAxios from "../../hooks/use-axios";
import { FileUploader } from "react-drag-drop-files";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const CategoryUplodImgModel = ({
  bannerLink,
  sliderLink,
  bannerLinkAr,
  text,
  id,
  onReload,
}) => {
  const [open, setOpen] = useState(false);
  const [fileSlider, setFileSlider] = useState(null);
  const [fileBanner, setFileBanner] = useState(null);
  const [fileBannerAr, setFileBannerAr] = useState(null);
  const [activeTab, setActiveTab] = useState('english');
  const fileTypes = ["PNG"];

  const { run: runUpload, isLoading: isloadingUpload } = useAxios([]);
  const { run: runUpload2, isLoading: isloadingUpload2 } = useAxios([]);

  const handleChangeBanner = (fileTwo, isArabic = false) => {
    const formData = new FormData();
    formData.append(isArabic ? "bannerAr" : "banner", fileTwo);
    runUpload2(
      authAxios.put(api.app.category.uploadImages(id), formData).then((res) => {
        onReload();
        if (isArabic) {
          setFileBannerAr(null);

        } else {
          setFileBanner(null);
          setFileSlider(null);
        }
        setOpen(false);
      })
    );
    if (isArabic) {
      setFileBannerAr(fileTwo);
    } else {
      setFileBanner(fileTwo);
    }
  };

  const handleChangeSlider = (fileOne, isArabic = false) => {
    const formData = new FormData();
    formData.append(isArabic ? "sliderAr" : "slider", fileOne);
    runUpload(
      authAxios.put(api.app.category.uploadImages(id), formData).then((res) => {
        onReload();
        if (isArabic) {
          setFileBannerAr(null);

        } else {
          setFileBanner(null);
          setFileSlider(null);
        }
        setOpen(false);
      })
    );
    if (isArabic) {
      setFileSlider(fileOne);
    } else {
      setFileSlider(fileOne);
    }
  };

  return (
    <Modal
      className="w-[780px] h-[426px] rounded-2xl bg-white border-[1px] border-primary scale-in overflow-hidden"
      onClose={() => {
        setOpen(false);
        onReload();
        setFileBanner(null);
        setFileBanner(null);
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
        active={isloadingUpload || isloadingUpload2}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="w-[780px] h-[426px] rounded-2xl bg-white border-[1px] border-primary ">
        <Tab
          panes={[
            {
              menuItem: 'English',
              render: () => (
                <Tab.Pane>
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
              handleChange={(file) => handleChangeBanner(file, false)}
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
                  handleChange={(file) => handleChangeSlider(file, false)}
                  types={fileTypes}
                >
                  Upload slider Photo
                </FileUploader>
              </button>
            </div>
          </div>
        </div>
                </Tab.Pane>
              ),
            },
            {
              menuItem: 'Arabic',
              render: () => (
                <Tab.Pane>
                  <div className=" shadow h-[240px] rounded-xl bg-white ">
                    <img
                      className="w-full h-[240px] object-cover "
                      src={
                        fileBannerAr
                          ? fileBannerAr && URL?.createObjectURL(fileBannerAr)
                          : bannerLinkAr
                      }
                      alt="bannerLinkAr"
                    />
                    <button className="bg-secondary-light text-secondary  w-[132px] h-[23px] p-0 text-sm font-normal rounded-lg mt-2 absolute right-2 top-[200px]">
                      <FileUploader
                        handleChange={(file) => handleChangeBanner(file, true)}
                      >
                        Upload Arabic banner
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
                            handleChange={(file) => handleChangeSlider(file, true)}
                            types={fileTypes}
                          >
                            Upload Arabic slider
                          </FileUploader>
                        </button>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
              ),
            },
          ]}
          onTabChange={(e, data) => setActiveTab(data.activeIndex === 0 ? 'english' : 'arabic')}
        />
      </div>
    </Modal>
  );
};
export default CategoryUplodImgModel;
