import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';

const SignUp: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState<{username?: string; email?: string; password?: string; confirm?: string; agree?: string}>({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const e: typeof errors = {};
        
        // Username validation - Length (6-10)
        if (!username) {
            e.username = 'Username is required.';
        } else if (username.length < 6 || username.length > 10) {
            e.username = 'Username must be between 6-10 characters.';
        }
        
        // Email validation - standard email format
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            e.email = 'Email is required.';
        } else if (!emailRx.test(email)) {
            e.email = 'Please enter a valid email address.';
        }
        
        // Password validation: Required, Length (12-16), Content({[a-zA-Z]}{[0-9]}{@,#,&!})
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#&!]).{12,16}$/;
        if (!password) {
            e.password = 'Password is required.';
        } else if (password.length < 12 || password.length > 16) {
            e.password = 'Password must be between 12-16 characters.';
        } else if (!passwordRegex.test(password)) {
            e.password = 'Password must contain letters, numbers, and at least one special character (@, #, &, !).';
        }
        
        // Confirm password
        if (confirm !== password) {
            e.confirm = 'Passwords do not match.';
        }
        
        // Terms and conditions
        if (!agree) {
            e.agree = 'You must accept the Terms and Conditions.';
        }
        
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setSuccessMessage('');
        
        try {
            // Simulate API call to create user
            // In a real app, you would POST to /users/add endpoint
            const response = await fetch('https://dummyjson.com/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    firstName: username, // Using username as firstName for simplicity
                    lastName: 'User',
                    age: 25,
                    role: 'user'
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create account');
            }
            
            const newUser = await response.json();
            console.log('User created:', newUser);
            
            setSuccessMessage('Account created successfully! Redirecting to login...');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                setLoading(false);
                navigate('/auth/login');
            }, 2000);
        } catch (error) {
            console.error('Sign up error:', error);
            setErrors({ ...errors, email: 'Unable to create account. Please try again.' });
            setLoading(false);
        }
    };

    return (

        <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
            <Link to="/" className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
            <img src="/logo.png" className="mr-4 h-11" alt="Simple KYC Logo"/>
                <span>Sign-up for Simple KYC</span>
            </Link>
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create a Free Account
                </h2>
                {successMessage && (
                    <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
                        {successMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <input 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            type="text" 
                            name="username" 
                            id="username" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                            placeholder="mateon" 
                            required 
                            aria-invalid={!!errors.username} 
                        />
                        {errors.username ? <div className="text-xs text-red-600 mt-1">{errors.username}</div> : null}
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="name@company.com" required aria-invalid={!!errors.email} />
                        {errors.email ? <div className="text-xs text-red-600 mt-1">{errors.email}</div> : null}
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required aria-invalid={!!errors.password} />
                        {errors.password ? <div className="text-xs text-red-600 mt-1">{errors.password}</div> : null}
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required aria-invalid={!!errors.confirm} />
                        {errors.confirm ? <div className="text-xs text-red-600 mt-1">{errors.confirm}</div> : null}
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input checked={agree} onChange={e => setAgree(e.target.checked)} id="remember" aria-describedby="remember" name="remember" type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="font-medium text-gray-900 dark:text-white">I accept the <a href="#" className="text-primary-700 hover:underline dark:text-primary-500">Terms and Conditions</a></label>
                        </div>
                    </div>
                    {errors.agree ? <div className="text-xs text-red-600">{errors.agree}</div> : null}
                    <button disabled={loading} type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? 'Creating…' : 'Create account'}</button>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Already have an account? <Link to="/auth/login" className="text-primary-700 hover:underline dark:text-primary-500">Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp;