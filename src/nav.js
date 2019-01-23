import React from "react";
import { Link, NavLink } from "react-router-dom";
import AuthConsumer from "./auth";

const Nav = () => (
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <NavLink className="navbar-item" activeClassName="is-active" exact to="/">
        MemStash
      </NavLink>
    </div>

    <div className="navbar-end">
      <AuthConsumer
        children={({ username, logout }) =>
          username == null ? (
            <div className="navbar-item">
              <div className="buttons">
                <Link className="button is-dark" to="/sign-up">
                  <strong>Sign up</strong>
                </Link>
                <Link className="button is-light" to="/log-in">
                  Log in
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link className="navbar-item mr-1" to={`/notes/${username}`}>
                Hello {username}!
              </Link>
              <div className="navbar-item">
                <div className="buttons">
                  <button className="button is-danger" onClick={() => logout()}>
                    <strong>Log Out</strong>
                  </button>
                </div>
              </div>
            </>
          )
        }
      />
    </div>
  </nav>
);

export default Nav;
