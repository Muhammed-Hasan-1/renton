import { useState } from 'react'

function Landing() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="landing-page">
      <header className="topbar">
        <div className="brand">Renton</div>
        <a className="nav-link" href="#signup">
          Sign up
        </a>
      </header>

      <main className="hero-section">
        <section className="hero-copy">
          <p className="eyebrow">Power tools, made simple</p>
          <h1>Rent the right tool for every job, without the big purchase.</h1>
          <p className="description">
            From weekend DIY projects to professional repairs, Renton helps you
            borrow trusted tools quickly and safely.
          </p>

          <div className="cta-group">
            <a className="btn btn-primary" href="#signup">
              Sign up
            </a>
            <a className="btn btn-secondary" href="#features">
              How it works
            </a>
          </div>

          <ul className="highlights">
            <li>Same-day pickup</li>
            <li>Flexible rental durations</li>
            <li>Verified tool owners</li>
          </ul>
        </section>

        <aside className="hero-card">
          <h2>Popular rentals</h2>
          <div className="tool-list">
            <div className="tool-item">
              <span>Drill kit</span>
              <strong>From $8/day</strong>
            </div>
            <div className="tool-item">
              <span>Paint sprayer</span>
              <strong>From $12/day</strong>
            </div>
            <div className="tool-item">
              <span>Angle grinder</span>
              <strong>From $10/day</strong>
            </div>
          </div>
        </aside>
      </main>

      <section id="features" className="features-section">
        <article className="feature-card">
          <h3>Book in minutes</h3>
          <p>Choose a nearby tool, confirm your dates, and reserve it instantly.</p>
        </article>
        <article className="feature-card">
          <h3>Flexible pickup</h3>
          <p>Pick up when it suits you or arrange delivery for extra convenience.</p>
        </article>
        <article className="feature-card">
          <h3>Trusted rentals</h3>
          <p>Every host is verified and every tool is checked before handover.</p>
        </article>
      </section>

      <section id="signup" className="signup-section">
        <div className="signup-copy">
          <p className="eyebrow">Join Renton</p>
          <h2>Create your account and start renting.</h2>
          <p>
            Whether you need a drill for a weekend project or a saw for a big job,
            Renton makes it easy to get started.
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Carter"
              required
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@email.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </label>
          <button type="submit">Create account</button>
          {submitted && <p className="success-msg">Thanks! Your account is ready to explore rentals.</p>}
        </form>
      </section>
    </div>
  )
}

export default Landing
