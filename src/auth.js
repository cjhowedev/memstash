import React, { Component } from "react";
import { getCurrentUser, login, logout, signup } from "./api";

export const AuthContext = React.createContext({});

export class AuthProvider extends Component {
  state = {
    username: null
  };

  async componentDidMount() {
    this.setState({ username: await getCurrentUser() });
  }

  signup = async (newUsername, password) => {
    const username = await signup(newUsername, password);
    this.setState({ username });
    return username;
  };

  login = async (oldUsername, password) => {
    const username = await login(oldUsername, password);
    this.setState({ username });
    return username;
  };

  logout = async () => {
    await logout();

    this.setState({ username: null });
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          username: this.state.username,
          signup: this.signup,
          login: this.login,
          logout: this.logout
        }}
        children={this.props.children}
      />
    );
  }
}

export default AuthContext.Consumer;
