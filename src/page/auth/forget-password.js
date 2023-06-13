import React, { useState } from "react";

import routes from "../../routes";
import { useHistory } from "react-router-dom";

import * as Yup from "yup";
import { Formik } from "formik";
import FormikInput from "../shared/formik/formik-input";

import { Button, Form } from "semantic-ui-react";
import { useLanguage } from "../../context/language-context";
import { toast } from "react-hot-toast";

import { useQuery } from "../../hooks/use-query";
import useLocalStorage from "../../hooks/use-localstorage";
import useAxios from "../../hooks/use-axios";
import axios from "axios";
import api from "../../api";

import { Player, Controls } from "@lottiefiles/react-lottie-player";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const ForgetPassword = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const history = useHistory();
  const query = useQuery();
  const tokenEdit = query.get("token");
  const [token] = useLocalStorage("tokenEdit", tokenEdit);

  const [isHidden, setIsHidden] = useState(false);

  const { run, isLoading } = useAxios();
  const resetPassword = (values) => {
    const body = {
      token: tokenEdit || token,
      newPassword: values.password,
    };
    run(axios.post(api.auth.resetCredentials, body))
      .then((res) => {
        setIsHidden(true);
        toast.success(
          lang === "en"
            ? "Your password has been changed successfully"
            : " تم تغيير كلمة المرور الخاصة بك بنجاح"
        );
      })
      .catch((err) => {
        toast.error(
          lang === "en"
            ? err.message.en || err.message
            : err.message.ar || err.message
        );
      });
  };

  const logInSchema = Yup.object({
    password: Yup.string()
      .min(8)
      .max(20)
      .trim()
      .required("Required field")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confarmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], `not match`)
      .required("Required field"),
  });

  return (
    <div className="sm:w-[304px] w-full mt-8 gap-x-3 animate-in z-50 rtl:font-serifAR ltr:font-serifEN">
      <div>
        <div className={isHidden ? "animate-out h-0" : "animate-in"}>
          <Formik
            initialValues={{
              password: "",
              confarmpassword: "",
            }}
            onSubmit={resetPassword}
            validationSchema={logInSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="sm:mx-0 mx-auto sm:w-[304px] w-full">
                  <div className="mt-10 mx-auto ">
                    <FormikInput
                      name="password"
                      type={"password"}
                      label={selectedContent[localizationKeys.newPassword]}
                      placeholder={
                        selectedContent[localizationKeys.newPassword]
                      }
                    />
                  </div>
                  <div className="mt-12  mx-auto">
                    <FormikInput
                      name="confarmpassword"
                      type={"password"}
                      label={selectedContent[localizationKeys.reEnterPassword]}
                      placeholder={
                        selectedContent[localizationKeys.reEnterPassword]
                      }
                    />
                  </div>
                </div>

                <div className="">
                  <Button
                    loading={isLoading}
                    onClick={() => {}}
                    className="bg-primary hover:bg-primary-dark opacity-100 sm:w-[304px] w-full  h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
                  >
                    {selectedContent[localizationKeys.resetPassword]}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div
          className={
            isHidden
              ? "animate-in text-center mx-auto "
              : "animate-out h-0 hidden mx-auto"
          }
        >
          <div className="w-72">
            <Player
              autoplay
              speed={1.5}
              loop
              src="https://assets9.lottiefiles.com/packages/lf20_afs4kbqm.json"
            >
              <Controls
                visible={false}
                buttons={[
                  "play",
                  "repeat",
                  "frame",
                  "debug",
                  "snapshot",
                  "background",
                ]}
              />
            </Player>
          </div>
          <p className="text-gray py-8">
            {
              selectedContent[
                localizationKeys.thePasswordHasBeenSuccessfullyChanged
              ]
            }
          </p>
          <button
            loading={isLoading}
            onClick={() => {
              history.push(routes.auth.logIn);
            }}
            className="bg-white border-[1px] border-primary w-80 h-12 rounded-lg text-primary mt-2 font-normal text-base font-serifAR "
          >
            {selectedContent[localizationKeys.backToHome]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
