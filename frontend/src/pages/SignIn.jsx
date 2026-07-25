import '../styles/SignIn.css'

function SignIn() {
  return (
    <div className="auth-page">
      <form className="auth-card">
        <h2>Sign In</h2>
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Enter password" />
        </label>
        <button type="submit">Continue</button>
      </form>
    </div>
  )
}

export default SignIn
