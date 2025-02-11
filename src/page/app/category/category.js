import React, { useEffect, useState } from "react";
import useGetGatogry from "../../../hooks/use-get-category";
import PenIcon from "../../../../src/assets/icons/pen-icon.png";
import CategoryCard from "../../../components/category-components/category-card";
import { Button, Dimmer } from "semantic-ui-react";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import AddCategoryModal from "./addCategoryModal";

const Category = () => {
  const { GatogryOptions, loadingGatogry, onReload } = useGetGatogry();
  const [openFrom,setOpenForm] = useState(false)
  const [categoryId, setCategoryId] = useState(null)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="animate-in">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loadingGatogry}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <div className="flex w-full justify-between">
      <h1 className="text-3xl text-black font-medium py-5 mx-5">Category</h1>
      <button
       className="bg-primary text-white mb-2 px-4 rounded-md hover:bg-primary-dark"
       onClick={()=>setOpenForm(true)}
      >
        Add new category
      </button>
      </div>
      <div className="bg-gray-light rounded-2xl p-4 shadow-md ">
        <div>
          <CategoryCard GatogryOptions={GatogryOptions} onReload={onReload} setCategoryId={setCategoryId} setShowModal={setOpenForm} />

        </div>
      </div>
      {openFrom && 
      <AddCategoryModal
        showModal={openFrom}
        setShowModal={setOpenForm}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        onReload={onReload}
      />}
    </div>
  );
};

export default Category;
