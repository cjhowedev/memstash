import { Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { submitAPIForm } from "./api";
import AuthConsumer from "./auth";
import TextField from "./text-field";

const SignUp = ({ history }) => (
  <div className="container mb-3">
    <h1 className="title">Sign Up</h1>
    <AuthConsumer
      children={({ signup }) => (
        <Formik
          initialValues={{ username: "", password: "", confirmPassword: "" }}
          validationSchema={yup.object().shape({
            username: yup
              .string()
              .required("A username is required")
              .matches(
                /^[A-Za-z0-9_]+$/,
                "Your username can only have letters, numbers and underscores."
              )
              .min(8, "Your username must be at least 8 characters long")
              .max(64, "Your username cannot be more than 64 characters long"),
            password: yup
              .string()
              .required("A password is required")
              .min(8, "Your password must be at least 8 characters long")
              .max(50, "Your password cannot be more than 50 characters long"),
            confirmPassword: yup
              .mixed()
              .required("Please confirm your password")
              .oneOf(
                [yup.ref("password")],
                "Your confirmation does not match your password!"
              )
          })}
          onSubmit={async ({ username, password }, formikBag) => {
            try {
              await submitAPIForm(formikBag, signup, username, password);
              history.push("/");
            } catch {}
          }}
          children={({ isSubmitting, isValid, status }) => (
            <Form>
              <TextField
                label="Username"
                placeholder="Enter a username..."
                name="username"
                icon="fas fa-user"
              />
              <TextField
                label="Password"
                placeholder="Enter a password..."
                name="password"
                type="password"
              />
              <TextField
                label="Confirm Password"
                placeholder="Confirm your password..."
                name="confirmPassword"
                type="password"
              />
              {status && (
                <div className="notification is-danger">
                  <ul>
                    {status.map((message, i) => (
                      <li key={i}>{message}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="submit"
                className={
                  "button is-primary" + (isSubmitting ? " is-loading" : "")
                }
                disabled={!isValid}
              >
                Sign Up
              </button>
            </Form>
          )}
        />
      )}
    />
  </div>
);

export default SignUp;
