import React, { useEffect } from "react";
import api from "../api";
import { authAxios, axios } from "../config/axios-config";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetALLBrand = () => {
  const [lang] = useLanguage();
  const [AllBranOptions, setAllAllBranOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    run(axios.get(api.app.brand.all)).then(({ data }) => {
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
  }, [lang, run]);

  return {
    AllBranOptions,
    loadingAllBranOptions: isLoading,
    errorAllBranOptions: error,
    isErrorAllBranOptions: isError,
  };
};

export default useGetALLBrand;
