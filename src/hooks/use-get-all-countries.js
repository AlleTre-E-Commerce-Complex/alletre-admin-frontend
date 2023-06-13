import React, { useEffect } from "react";
import api from "../api";
import { authAxios, axios } from "../config/axios-config";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetAllCountries = () => {
  const [lang] = useLanguage();
  const [AllCountriesOptions, setAllCountriesOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    run(axios.get(api.app.countries.default)).then(({ data }) => {
      const AllCountriesOptions = data.data;
      const options = [];

      AllCountriesOptions.forEach((d) =>
        options.push({
          text: lang === "en" ? d?.nameEn : d?.nameAr,
          key: d?.id,
          value: d.id,
        })
      );

      setAllCountriesOptions(options);
    });
  }, [lang, run]);

  return {
    AllCountriesOptions,
    loadingAllCountries: isLoading,
    errorAllCountries: error,
    isErrorAllCountries: isError,
  };
};

export default useGetAllCountries;
