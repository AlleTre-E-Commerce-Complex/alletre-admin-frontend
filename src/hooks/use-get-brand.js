import React, { useEffect } from "react";
import api from "../api";
import { authAxios } from "../config/axios-config";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetBrand = (categoryId) => {
  const [lang] = useLanguage();
  const [NotAllBranOptions, setAllAllBranOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    if (categoryId)
      run(authAxios.get(api.app.brand.default(categoryId))).then(({ data }) => {
        const AllBranOptions = data.data;
        const options = [];

        AllBranOptions.forEach((d) =>
          options.push({
            text: d?.name,
            key: d?.id,
            value: d.id,
          })
        );

        setAllAllBranOptions(options);
      });
  }, [categoryId, lang, run]);

  return {
    NotAllBranOptions,
    loadingAllBranOptions: isLoading,
    errorAllBranOptions: error,
    isErrorAllBranOptions: isError,
  };
};

export default useGetBrand;
