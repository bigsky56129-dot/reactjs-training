import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const SignUp: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState<{email?: string; password?: string; confirm?: string; agree?: string}>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const e: typeof errors = {};
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRx.test(email)) e.email = 'Please enter a valid email address.';
        if (!password || password.length < 6) e.password = 'Password must be at least 6 characters.';
        if (confirm !== password) e.confirm = 'Passwords do not match.';
        if (!agree) e.agree = 'You must accept the Terms and Conditions.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // In a real app we'd call an API to register the user.
        setTimeout(() => {
            setLoading(false);
            navigate('/login');
        }, 600);
    };

    return (

        <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
            <a href="" className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white">
            <img src="/logo.png" className="mr-4 h-11" alt="Simple KYC Logo"/>
                <span>Sign-up for Simple KYC</span>
            </a>
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create a Free Account
                </h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6" action="#">
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
                        Already have an account? <a href="/login" className="text-primary-700 hover:underline dark:text-primary-500">Login here</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp;