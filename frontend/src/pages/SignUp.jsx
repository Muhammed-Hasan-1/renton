import '../styles/SignUp.css'

function SignUp() {
  return (
    <div className="auth-page">
      <form className="auth-card">
        <h2>Create Account</h2>
        <label>
          Name
          <input type="text" placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Create password" />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp
