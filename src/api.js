import fetch from "unfetch";

const throwAPIError = (messages, response) => {
  const error = new Error("The API call failed");
  error.messages = messages;
  error.response = response;
  throw error;
};

const fetchAPI = async (url, method = "GET", body = null) => {
  const response = await fetch(url, {
    credentials: "include",
    method,
    body: body == null ? undefined : JSON.stringify(body)
  });
  const json = await response.json();

  if (response.status >= 400) {
    const { error, messages } = json;
    const defaultMessages =
      error != null ? [error] : ["An unknown error has occured."];
    if (messages == null) {
      throwAPIError(defaultMessages, response);
    } else if (Array.isArray(messages)) {
      if (messages.length === 0) {
        throwAPIError(defaultMessages, response);
      } else {
        throwAPIError(messages, response);
      }
    } else if (typeof messages == "string") {
      throwAPIError([messages], response);
    } else {
      throwAPIError(Object.values(messages).flat(), response);
    }
  } else {
    return json;
  }
};

export const submitAPIForm = async (
  { setStatus, setSubmitting },
  apiFunction,
  ...args
) => {
  setStatus(null);
  setSubmitting(true);
  try {
    return await apiFunction(...args);
  } catch (err) {
    if (err.messages != null) {
      setStatus(err.messages);
      setSubmitting(false);
    } else {
      setStatus([err.toString()]);
      setSubmitting(false);
    }
    throw err;
  }
};

export const getCurrentUser = async () => {
  try {
    const { username } = await fetchAPI("/api/user");
    return username;
  } catch (err) {
    if (err.response && err.response.status === 403) {
      // a 403 status is expected when the user isn't logged in
      return null;
    } else {
      // otherwise the session may be invalid, so delete it if it exists
      try {
        await logout();
      } catch {}
      return null;
    }
  }
};

export const login = async (oldUsername, password) => {
  const { username } = await fetchAPI("/api/session", "POST", {
    username: oldUsername,
    password
  });
  return username;
};

export const logout = async () => {
  await fetchAPI("/api/session", "DELETE");
};

export const signup = async (newUsername, password) => {
  const { username } = await fetchAPI("/api/user", "POST", {
    username: newUsername,
    password
  });
  return username;
};

const processNote = ({ id, public: isPublic, text, created_at }) => ({
  id,
  isPublic,
  text,
  createdAt: Date.parse(created_at)
});

export const postNote = async text => {
  const note = await fetchAPI("/api/notes", "POST", {
    text
  });
  return processNote(note);
};

export const getNotes = async () => {
  const notes = await fetchAPI("/api/user/notes");
  return notes.map(processNote);
};

export const getPublicNotes = async username => {
  return fetchAPI(`/api/user/${username}/notes`);
};

export const deleteNote = async id => {
  const note = await fetchAPI(`/api/notes/${id}`, "DELETE");
  return processNote(note);
};

export const shareNote = async id => {
  const note = await fetchAPI(`/api/notes/${id}/share`, "POST");
  return processNote(note);
};
