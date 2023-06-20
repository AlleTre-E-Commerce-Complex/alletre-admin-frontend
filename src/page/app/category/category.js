import React, { useState } from "react";
import useGetGatogry from "../../../hooks/use-get-category";
import PenIcon from "../../../../src/assets/icons/pen-icon.png";
import CategoryCard from "../../../components/category-components/category-card";

const Category = () => {
  const { GatogryOptions, loadingGatogry } = useGetGatogry();

  return (
    <div>
      <h1 className="text-3xl text-black font-medium py-5 mx-5">Category</h1>
      <div className="bg-gray-light rounded-2xl p-4 shadow-md ">
        <div>
          <CategoryCard GatogryOptions={GatogryOptions} />
        </div>
      </div>
    </div>
  );
};

export default Category;
