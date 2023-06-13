import React, { useEffect } from "react";
import api from "../api";
import { authAxios, axios } from "../config/axios-config";
import { useLanguage } from "../context/language-context";
import useAxios from "./use-axios";

const useGetAllCities = (countriesId) => {
  const [lang] = useLanguage();
  const [AllCitiesOptions, setAllCitiesOptions] = React.useState([]);

  const { run, isLoading, error, isError } = useAxios();

  useEffect(() => {
    if (countriesId)
      run(axios.get(api.app.cities.default(countriesId))).then(({ data }) => {
        const AllCitiesOptions = data.data;
        const options = [];

        AllCitiesOptions.forEach((d) =>
          options.push({
            text: lang === "en" ? d?.nameEn : d?.nameAr,
            key: d?.id,
            value: d.id,
          })
        );

        setAllCitiesOptions(options);
      });
  }, [lang, run, countriesId]);

  return {
    AllCitiesOptions,
    loadingCitiesOptions: isLoading,
    errorCitiesOptions: error,
    isErrorCitiesOptions: isError,
  };
};

export default useGetAllCities;
