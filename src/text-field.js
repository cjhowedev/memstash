import React from "react";
import { Field } from "formik";

const TextField = ({ icon, label, name, ...props }) => (
  <Field
    name={name}
    children={({ field, form: { errors, touched } }) => (
      <div className="field">
        <label className="label">{label}</label>
        <div className={"control" + (icon ? " has-icons-left" : "")}>
          <input
            className={
              "input" + (touched[name] && errors[name] ? " is-danger" : "")
            }
            {...field}
            {...props}
          />
          {icon && (
            <span className="icon is-small is-left">
              <i className={icon} />
            </span>
          )}
        </div>
        {touched[name] && errors[name] && (
          <p className="help is-danger">{errors[name]}</p>
        )}
      </div>
    )}
  />
);

export default TextField;
