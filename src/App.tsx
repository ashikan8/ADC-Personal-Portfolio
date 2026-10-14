import { useEffect, useState } from 'react';
import './App.css';

const GREETING = "Hi, I'm Ashika!";

function App() {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let index = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        index += 1;
        setTypedText(GREETING.slice(0, index));

        if (index === GREETING.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1800);
          return;
        }

        timeoutId = setTimeout(tick, 90);
        return;
      }

      index -= 1;
      setTypedText(GREETING.slice(0, index));

      if (index === 0) {
        deleting = false;
        timeoutId = setTimeout(tick, 400);
        return;
      }

      timeoutId = setTimeout(tick, 50);
    };

    timeoutId = setTimeout(tick, 90);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="App">
      <section className="hero">
        <div className="hero-text">
          <h1 className="typing">
            {typedText}
            <span className="typing-cursor" aria-hidden="true" />
          </h1>
          <div className="social-links">
            <a
              href="https://github.com/ashikan8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/ashika-nadendla-757458369/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z" />
              </svg>
            </a>
          </div>
        </div>
        <img
          className="hero-photo"
          src="/ashika.JPG"
          alt="Ashika Nadendla"
        />
      </section>

      <section className="centered">
        <h2>About Me</h2>
        <p>
          I am a Computer Science student at the University of Maryland with a
          passion for software development and FinTech. I enjoy building
          full-stack applications and explored how AI can improve user
          experience and solve real-world problems.
        </p>
        <p>
          Outside of school, I love travelling, trying new things, and exploring
          new places. I love being outdoors and spending time with my friends
          and family.
        </p>
      </section>

      <section className="centered" id="skills">
        <h2>Skills</h2>
        <div className="skills-list">
          <span className="skill-tag">Python</span>
          <span className="skill-tag">Java</span>
          <span className="skill-tag">React</span>
          <span className="skill-tag">Node</span>
          <span className="skill-tag">HTML</span>
          <span className="skill-tag">CSS</span>
        </div>
      </section>

      <section className="centered" id="projects">
        <h2 className="section-title">
          Featured <span>Projects</span>
        </h2>

        <div className="project-grid">
          <article className="project-card">
            <div className="project-number">01</div>

            <p className="project-type">
              FINTECH / FULL-STACK DEVELOPMENT
            </p>

            <h3>InvestEdge</h3>

            <p className="project-description">
              A portfolio optimization web application that helps users analyze
              investments and make data-driven financial decisions using
              real-time market data.
            </p>

            <div className="tech-tags">
              <span className="tech-tag">Python</span>
              <span className="tech-tag">Flask</span>
              <span className="tech-tag">Yahoo Finance API</span>
            </div>
          </article>
        </div>
      </section>

      <section className="centered">
        <h2>Contact Me</h2>
        <p>
          You can contact me via email at{' '}
          <a href="mailto:nadendla.ashika@gmail.com">
            nadendla.ashika@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}

export default App;