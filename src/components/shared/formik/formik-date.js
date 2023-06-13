import { Field } from "formik";
import { DateInput } from "semantic-ui-calendar-react";
import { get } from "wild-wild-path";

import "../../../../src/assets/style/formik-date.css";
import ErrorMessage from "./error-message";

function FormikDate({ label, name, error, ...props }) {
  return (
    <div className="Edit_FormikDate relative">
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldTouched, setFieldValue, errors, touched } = form;
          const { value } = field;
          return (
            <DateInput
              label={
                <label htmlFor={name} className="font-normal  text-base">
                  {label}
                </label>
              }
              id={name}
              clearable
              closable
              value={value}
              iconPosition="left"
              {...field}
              {...props}
              onBlur={() => setFieldTouched(name, true)}
              onChange={(e, { value }) => setFieldValue(name, value)}
              error={
                get(touched, name) &&
                get(errors, name) && (
                  <ErrorMessage message={get(errors, name)} />
                )
              }
            />
          );
        }}
      </Field>
    </div>
  );
}

export default FormikDate;
