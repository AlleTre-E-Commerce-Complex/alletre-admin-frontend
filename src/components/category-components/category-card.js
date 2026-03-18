import React, { useState } from "react";
import CategoryUplodImgModel from "./category-uplod-img-model";
import addimage from "../../../src/assets/icons/add-image-icon.png";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const CategoryCard = ({ GatogryOptions, onReload, setCategoryId, setShowModal }) => {
  const [loadingObj, setLoadingObj] = useState({});

  const toggleCategoryStatus = async (categoryId, currentStatus) => {
    try {
      setLoadingObj((prev) => ({ ...prev, [categoryId]: true }));
      const newStatus = !currentStatus;
      await authAxios.patch(api.app.category.editStatus(categoryId), { status: newStatus });
      toast.success(newStatus ? "Category enabled successfully" : "Category disabled successfully");
      onReload();
    } catch (error) {
      toast.error("Failed to update category status");
    } finally {
      setLoadingObj((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  return (
    <div className="flex gap-10 flex-wrap py-4 ">
      {GatogryOptions?.map((e, index) => (
        <div key={e?.key || index} className="relative  ">
          <div className="group hover:border-primary border-transparent border-[1px] shadow w-[300px] h-[240px] rounded-xl  bg-white mx-auto cursor-pointer overflow-hidden ">
            <div
              className={`group w-[300px] h-[240px]  rounded-xl
                hover:bg-gradient-to-t hover:from-[#25252562] absolute z-20 ${e?.status === false ? "bg-gray-400/50" : ""}`}
            >
              <CategoryUplodImgModel
                bannerLink={e?.bannerLink || addimage}
                sliderLink={e?.sliderLink || addimage}
                bannerLinkAr={e?.bannerLinkAr || addimage}
                text={e?.text}
                id={e?.value}
                onReload={onReload}
              />
            </div>
            <img
              className="w-full h-40 object-cover rounded-lg group-hover:scale-110 duration-300 ease-in-out transform"
              src={e?.bannerLink || e?.bannerLinkAr || addimage}
              alt="bannerLink"
            />
            <div className="rounded-full w-32 h-32 absolute top-[100px] left-8 flex gap-x-5">
              <img
                className="w-full h-full object-cover rounded-full group-hover:scale-110 duration-300 ease-in-out transform"
                src={e?.sliderLink || e?.sliderLinkAr || addimage}
                alt="sliderLink"
              />
              <h1 className="text-gray-dark mx-auto mt-[64px] font-semibold group-hover:scale-110 duration-300 ease-in-out transform">
                {e?.text}
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-primary text-white mb-2 mt-4 px-4 py-2 flex-grow rounded-md hover:bg-primary-dark"
              onClick={()=>{
               setShowModal(true)
               setCategoryId(e?.key)
              }}
            >
              Edit category
            </button>
            <button
              disabled={loadingObj[e?.key]}
              title={e?.status ? "Disable Category" : "Enable Category"}
              className={`${e?.status ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} flex items-center justify-center text-white mb-2 mt-4 px-4 py-2 w-[50px] rounded-md disabled:opacity-50`}
              onClick={() => toggleCategoryStatus(e?.key, e?.status)}
            >
              {loadingObj[e?.key] ? "..." : (e?.status ? <FaEyeSlash size={18} /> : <FaEye size={18} />)}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
