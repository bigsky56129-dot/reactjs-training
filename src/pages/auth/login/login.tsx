import React, { useState, useEffect, useContext } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AuthenticatedContext, User} from '../../../shared/authenticated';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // validation state
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const auth = useContext(AuthenticatedContext);
    const navigate = useNavigate();

    // if already logged in, redirect according to role
    React.useEffect(() => {
        const user = auth?.user;
        if (!user) return;
        if (user.role === 'officer') navigate('/pages/clients');
        else navigate(`/pages/user/${user.id}/pi`);
    }, [auth, navigate]);

    const validate = () => {
        let ok = true;
        
        // Basic validation - just check if fields are filled
        if (!email) {
            setUsernameError('Username or email is required.');
            ok = false;
        } else {
            setUsernameError(null);
        }

        if (!password) {
            setPasswordError('Password is required.');
            ok = false;
        } else {
            setPasswordError(null);
        }

        return ok;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // basic client-side validation
        if (!validate()) return;
        // Fetch user from dummyjson and derive role (officer vs user)
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(email)}`);
            if (!res.ok) throw new Error('Failed to fetch user');
            const data = await res.json();
            const users = Array.isArray(data.users) ? data.users : [];
            
            // Determine if input is email or username
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmail = emailRegex.test(email);
            
            // Find user by email or username
            const found = isEmail 
                ? users.find((u: any) => (u.email || '').toLowerCase() === email.toLowerCase())
                : users.find((u: any) => (u.username || '').toLowerCase() === email.toLowerCase());
            
            if (!found) {
                setError(`No user found with that ${isEmail ? 'email' : 'username'}`);
                return;
            }

            // Verify password matches
            if (found.password !== password) {
                setError('Incorrect password.');
                return;
            }

            // Map external role to app role. Treat admin/moderator as officer.
            const externalRole = (found.role || '').toLowerCase();
            const appRole: 'user' | 'officer' = ['admin', 'moderator'].includes(externalRole) ? 'officer' : 'user';

            const id = String(found.id ?? (email ? email.split('@')[0] : 'me'));
            const name = `${found.firstName ?? ''} ${found.lastName ?? ''}`.trim() || found.username || email;

            const newUser: User = {
                id,
                name,
                email: found.email ?? email,
                role: appRole
            };

            auth?.setUser(newUser);

            // Redirect according to role
            if (appRole === 'officer') {
                navigate('/pages/clients');
            } else {
                navigate(`/pages/user/${id}/pi`);
            }
        } catch (err) {
            console.error(err);
            setError('Unable to lookup user — try again later.');
        } finally {
            setLoading(false);
        }
    };

    return(
        <main className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900" role="main">
            <Link to="/" className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white" aria-label="Simple KYC Home">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} className="mr-4 h-11" alt="Simple KYC Logo"/>
                <span>Simple KYC Authentication</span>
            </Link>
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sign in to platform
                </h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username or Email</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="mateon or mateo.nguyen@x.dummyjson.com"
                            required
                            aria-invalid={!!usernameError}
                            aria-label="Username or Email"
                        />
                        {usernameError ? <div className="text-xs text-red-600 mt-1">{usernameError}</div> : null}
                    </div>
                    {/* Role is now determined by the external API — removed manual role selection */}
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            required
                            aria-invalid={!!passwordError}
                            aria-label="Password"
                        />
                        {passwordError ? <div className="text-xs text-red-600 mt-1">{passwordError}</div> : null}
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="remember"
                                aria-describedby="remember"
                                name="remember"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="font-medium text-gray-900 dark:text-white">Remember me</label>
                        </div>
                        <Link to='/auth/reset-password' className="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500">Lost Password?</Link>
                    </div>
                    {error ? (
                        <div className="text-sm text-red-600">{error}</div>
                    ) : null}
                    <button disabled={loading} type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" aria-label="Log in">
                        {loading ? 'Signing in…' : 'Login to your account'}
                    </button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Forgot password? <Link to='/auth/sign-up' className="text-primary-700 hover:underline dark:text-primary-500">Sign-up</Link>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Login;