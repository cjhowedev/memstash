import React from "react";
import AuthConsumer from "./auth";
import Notes from "./notes";

const Home = () => (
  <div className="container mb-3">
    <AuthConsumer
      children={({ username }) =>
        username == null ? (
          <section className="hero is-dark">
            <div className="hero-body">
              <h1 className="title">MemStash</h1>
              <h2 className="subtitle">A cache for your brain</h2>
              <p>
                MemStash helps you store your mental context via short, frequent
                notes. MemStash rides the line between note taking application
                and microblog by letting you share your notes to the public.
              </p>
            </div>
          </section>
        ) : (
          <Notes />
        )
      }
    />
  </div>
);

export default Home;
