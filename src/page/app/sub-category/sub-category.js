import React, { useEffect, useState } from "react";
import useGetGatogry from "../../../hooks/use-get-category";
import PenIcon from "../../../../src/assets/icons/pen-icon.png";
import CategoryCard from "../../../components/category-components/category-card";
import { Dimmer, Form } from "semantic-ui-react";
import LodingTestAllatre from "../../../components/shared/lotties-file/loding-test-allatre";
import useGetSubGatogry from "../../../hooks/use-get-sub-category";
import FormikInput from "../../../components/shared/formik/formik-input";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import FormikMultiDropdown from "../../../components/shared/formik/formik-dropdown";
import { Formik } from "formik";
import localizationKeys from "../../../localization/localization-keys";
import SubCategoryUplodImgModel from "../../../components/sub-category-components/sub-category-uplod-Img-model";
import addimage from "../../../../src/assets/icons/add-image-icon.png";

const SubCategory = () => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [categoryId, SetCategoryId] = useState();

  const { GatogryOptions, loadingGatogry } = useGetGatogry();
  const { SubGatogryOptions, loadingSubGatogry, onReload } =
    useGetSubGatogry(categoryId);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="animate-in">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={loadingSubGatogry}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      <h1 className="text-3xl text-black font-medium py-5 mx-5">Sub Gatogry</h1>
      <div className="bg-gray-light rounded-2xl p-4 shadow-md ">
        <Formik
          initialValues={{
            GatogryId: "",
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <h1 className="font-bold text-base text-black pt-2 pb-6">
                Please choose a category to view the secondary categories,
                knowing that there are some categories that do not have
                subcategories
              </h1>
              <FormikMultiDropdown
                name="email"
                type={"text"}
                options={GatogryOptions}
                loading={loadingGatogry}
                onChange={(e) => SetCategoryId(e)}
                label={selectedContent[localizationKeys.category]}
                placeholder={selectedContent[localizationKeys.category]}
              />
            </Form>
          )}
        </Formik>

        <div className="flex gap-10 flex-wrap py-4">
          {SubGatogryOptions.map((e) => (
            <div className="relative  ">
              <div className="group hover:border-primary border-transparent border-[1px] shadow w-[240px] h-[240px] rounded-full  bg-white mx-auto cursor-pointer overflow-hidden ">
                <div
                  className=" w-[240px] h-[240px] rounded-full 
                hover:bg-gradient-to-t hover:from-[#25252562] absolute z-10 "
                >
                  <SubCategoryUplodImgModel
                    imageLink={e?.imageLink || addimage}
                    text={e?.text}
                    id={e?.value}
                    onReload={onReload}
                  />
                </div>
                <div className="rounded-full w-32 h-32 flex mx-auto mt-16 gap-x-5 ">
                  <img
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 duration-300 ease-in-out transform bg-primary-light"
                    src={e?.imageLink || addimage}
                    alt="imageLink"
                  />
                </div>
                <h1 className="text-gray-dark mx-auto mt-4 font-semibold group-hover:scale-110 duration-300 ease-in-out transform text-center">
                  {e?.text}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
