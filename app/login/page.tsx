import { login, signInWithGoogle, signup } from "./actions";

export default function LoginPage() {
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
      </div>
      <div className="space-x-4">
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </form>
  );
}
