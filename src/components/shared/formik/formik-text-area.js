import { Field } from "formik";
import { FormTextArea } from "semantic-ui-react";
import ErrorMessage from "./error-message";
import "../../../../src/assets/style/formik-text-area.css";

function FormikTextArea({
  label,
  name,
  className,
  placeholder,
  value,
  ...props
}) {
  return (
    <>
      <Field name={name}>
        {({ form, field }) => {
          const { errors, touched } = form;
          return (
            <div className="flex flex-col mt-1.5 relative Edit_FormikTextArea">
              <FormTextArea
                label={label}
                placeholder={placeholder}
                type={props.type}
                value={value}
                {...field}
                {...props}
              />
              {touched[name] && errors[name] && (
                <ErrorMessage message={errors[name]} />
              )}
            </div>
          );
        }}
      </Field>
    </>
  );
}

export default FormikTextArea;
