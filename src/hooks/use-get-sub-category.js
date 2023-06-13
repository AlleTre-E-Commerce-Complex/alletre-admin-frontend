import axios from "axios";
import React, { useEffect } from "react";
import api from "../api";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetSubGatogry = (categoryId) => {
  const [lang] = useLanguage();
  const [SubGatogryOptions, setSubGatogryOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    if (categoryId) {
      run(axios.get(api.app.subCategory.default(categoryId))).then(
        ({ data }) => {
          const SubGatogryOptions = data.data;
          const options = [];

          SubGatogryOptions.forEach((d) =>
            options.push({
              text: lang === "en" ? d?.nameEn : d?.nameAr,
              key: d?.id,
              value: d.id,
            })
          );
          setSubGatogryOptions(options);
        }
      );
    }
  }, [categoryId]);

  return {
    SubGatogryOptions,
    loadingSubGatogry: isLoading,
    errorSubGatogry: error,
    isErrorSubGatogry: isError,
  };
};

export default useGetSubGatogry;
