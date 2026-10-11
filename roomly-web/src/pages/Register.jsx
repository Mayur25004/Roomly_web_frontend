import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerEmployee } from "../services/authService.js";
function Register({ currentUser, onRegister }) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        document.title = "Roomly - Register";
    }, []);
    if (currentUser) {
        return <Navigate to={currentUser.role === "admin" ? "/admin" : "/rooms"} replace/>;
    }
    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");
        if (password.length < 8) {
            setErrorMessage("Use a password with at least 8 characters.");
            return;
        }
        setIsSubmitting(true);
        try {
            const user = await registerEmployee(name, email, password);
            onRegister(user);
            navigate("/rooms", { replace: true, state: { registered: true } });
        }
        catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Could not create your account. Try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    return (<main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md space-y-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <header>
          <p className="text-sm font-bold text-violet-700">Roomly</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Create an account</h1>
          <p className="mt-2 text-sm text-slate-500">Employee accounts can book and manage meeting rooms.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>)}
          <div className="space-y-2">
            <label htmlFor="register-name" className="block text-sm font-semibold text-slate-700">
              Full name
            </label>
            <input id="register-name" type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"/>
          </div>
          <div className="space-y-2">
            <label htmlFor="register-email" className="block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input id="register-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"/>
          </div>
          <div className="space-y-2">
            <label htmlFor="register-password" className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input id="register-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"/>
            <p className="text-xs text-slate-500">Use at least 8 characters.</p>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Creating account..." : "Create employee account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already registered? <Link to="/login" className="font-semibold text-violet-700 underline">Sign in</Link>
        </p>
        <p className="text-xs text-slate-500">Admin accounts are provisioned by the administrator and cannot be created here.</p>
      </section>
    </main>);
}
export default Register;
