import { useEffect, useState } from 'react';
import './App.css';

const GREETING = "Hi, I'm Ashika!";

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
};

type ContactInput = Omit<Contact, 'id'>;

function App() {
  const [typedText, setTypedText] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState<ContactInput>({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ContactInput>({ name: '', email: '', message: '' });

  // GET: load messages from the FastAPI backend, not a hardcoded array.
  useEffect(() => {
    async function loadContacts() {
      try {
        const response = await fetch('/contacts');
        if (!response.ok) throw new Error('Could not load messages.');
        const data: Contact[] = await response.json();
        setContacts(data);
      } catch {
        setError('Could not load messages. Make sure FastAPI is running.');
      } finally {
        setLoading(false);
      }
    }
    void loadContacts();
  }, []);

  // POST: submit the form to FastAPI.
  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Could not send your message.');
      const created: Contact = await response.json();
      setContacts((previous) => [...previous, created]);
      setForm({ name: '', email: '', message: '' });
      setSuccess('Message submitted successfully!');
    } catch {
      setError('Could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // PUT: update an existing message through FastAPI.
  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId === null) return;
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/contacts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error('Could not update the message.');
      const updated: Contact = await response.json();
      setContacts((previous) => previous.map((contact) =>
        contact.id === editingId ? updated : contact
      ));
      setEditingId(null);
      setSuccess('Message updated.');
    } catch {
      setError('Could not update the message. Please try again.');
    }
  }

  // DELETE: remove a message using its ID.
  async function deleteContact(contactId: number) {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/contacts/${contactId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete the message.');
      setContacts((previous) => previous.filter((contact) => contact.id !== contactId));
      setSuccess('Message deleted.');
    } catch {
      setError('Could not delete the message. Please try again.');
    }
  }

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

      <section className="centered" id="contact">
        <h2>Contact Me</h2>
        <p>Send me a message using the form below.</p>
        <form className="contact-form" onSubmit={(event) => void submitContact(event)}>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" value={form.name} required minLength={1}
            onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" value={form.email} required
            onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" value={form.message} required rows={4}
            onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {error && <p role="alert" className="contact-error">{error}</p>}
        {success && <p role="status" className="contact-success">{success}</p>}
        <div className="contact-messages">
          <h3>Contact Messages</h3>
          {loading ? (
            <p>Loading messages...</p>
          ) : contacts.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            <ul className="contact-list">
              {contacts.map((contact) => (
                <li key={contact.id} className="contact-item">
                  {editingId === contact.id ? (
                    <form className="contact-form edit-form" onSubmit={(event) => void saveEdit(event)}>
                      <label htmlFor={`edit-name-${contact.id}`}>Name</label>
                      <input id={`edit-name-${contact.id}`} value={editForm.name} required
                        onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} />
                      <label htmlFor={`edit-email-${contact.id}`}>Email</label>
                      <input id={`edit-email-${contact.id}`} type="email" value={editForm.email} required
                        onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} />
                      <label htmlFor={`edit-message-${contact.id}`}>Message</label>
                      <textarea id={`edit-message-${contact.id}`} required value={editForm.message}
                        onChange={(event) => setEditForm({ ...editForm, message: event.target.value })} />
                      <div className="contact-actions">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <strong>{contact.name}</strong> <span>({contact.email})</span>
                      <p>{contact.message}</p>
                      <div className="contact-actions">
                        <button type="button" onClick={() => {
                          setEditingId(contact.id);
                          setEditForm({ name: contact.name, email: contact.email, message: contact.message });
                        }}>Edit</button>
                        <button type="button" onClick={() => void deleteContact(contact.id)}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;