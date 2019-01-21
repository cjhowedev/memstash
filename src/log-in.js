import { Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { submitAPIForm } from "./api";
import AuthConsumer from "./auth";
import TextField from "./text-field";

const LogIn = ({ history }) => (
  <div className="container mb-3">
    <h1 className="title">Log In</h1>
    <AuthConsumer
      children={({ login }) => (
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={yup.object().shape({
            username: yup.string().required("A username is required"),
            password: yup.string().required("A password is required")
          })}
          onSubmit={async ({ username, password }, formikBag) => {
            try {
              await submitAPIForm(formikBag, login, username, password);
              history.push("/");
            } catch {}
          }}
          children={({ isSubmitting, isValid, status }) => (
            <Form>
              <TextField
                label="Username"
                placeholder="Enter your username..."
                name="username"
                icon="fas fa-user"
              />
              <TextField
                label="Password"
                placeholder="Enter your password..."
                name="password"
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
                Log In
              </button>
            </Form>
          )}
        />
      )}
    />
  </div>
);

export default LogIn;
