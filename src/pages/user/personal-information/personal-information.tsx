import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const PersonalInformation: React.FC = () => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string,string>>({});

    // form state with defaults from placeholders
    const [form, setForm] = useState({
        firstName: 'Bonnie',
        lastName: 'Green',
        country: 'United States',
        city: 'San Francisco',
        address: 'e.g. California',
        email: 'example@company.com',
        phone: '',
        birthday: '',
        organization: 'Company Name',
        role: 'React Developer',
        department: 'Development',
        zip: ''
    });

    const validate = () => {
        const e: Record<string,string> = {};
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.firstName.trim()) e.firstName = 'Required';
        if (!form.lastName.trim()) e.lastName = 'Required';
        if (!emailRx.test(form.email)) e.email = 'Enter a valid email';
        if (form.phone && !/^\+?[0-9\s-()]{6,}$/.test(form.phone)) e.phone = 'Enter a valid phone';
        if (form.zip && !/^\d{3,10}$/.test(form.zip)) e.zip = 'Enter a valid zip/postal code';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    // load user by id from dummyjson API and update form + image
    const { id } = useParams();
    const [userImage, setUserImage] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const loadUser = async () => {
            if (!id) return;
            setLoading(true);
            setFetchError(null);
            try {
                const res = await fetch(`https://dummyjson.com/users/${id}`);
                if (!res.ok) throw new Error('Unable to fetch user');
                const data = await res.json();
                if (cancelled) return;

                // prefer API fields when present
                setForm(prev => ({
                    ...prev,
                    firstName: data.firstName ?? prev.firstName,
                    lastName: data.lastName ?? prev.lastName,
                    email: data.email ?? prev.email,
                    phone: data.phone ?? prev.phone,
                    city: data.address?.city ?? prev.city,
                    country: data.address?.country ?? prev.country,
                    address: data.address?.address ?? prev.address,
                    organization: data.company?.name ?? prev.organization,
                    role: data.company?.title ?? prev.role
                }));

                setUserImage(data.image ?? null);
            } catch (err) {
                console.error(err);
                if (!cancelled) setFetchError('Failed to load user');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadUser();
        return () => { cancelled = true; };
    }, [id]);

    const handleChange = (field: string, value: string) => setForm(prev => ({...prev, [field]: value}));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        setLoading(false);
        setEditing(false);
        setSuccess('Profile updated');
        setTimeout(() => setSuccess(null), 2000);
    }
    return (
        <div className="grid grid-cols-1 px-4 pt-6 xl:gap-4 dark:bg-gray-900">
            <div className="mb-4 col-span-full xl:mb-2">
                <nav className="flex mb-5" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
                        <li className="inline-flex items-center">
                            <a href="#"
                               className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                                <a href="#"
                                   className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white">Users</a>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                          clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500"
                                      aria-current="page">Personal Information</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Personal Information</h1>
            </div>
            <div
                className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                    <img className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                        src={userImage ?? '/images/users/bonnie-green-2x.png'} alt="Profile picture"/>
                    {fetchError ? <div className="text-xs text-red-600 mt-2">{fetchError}</div> : null}
                    <div>
                        <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Profile
                            picture</h3>
                        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                            JPG, GIF or PNG. Max size of 800K
                        </div>
                        <div className="flex items-center space-x-4">
                            <button type="button"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                <svg className="w-4 h-4 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                                </svg>
                                Upload picture
                            </button>
                            <button type="button"
                                    className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold dark:text-white">General information</h3>
                <form onSubmit={handleSave}>
                    <fieldset disabled={!editing}>
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="first-name"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First
                                    Name</label>
                                <input value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} type="text" name="first-name" id="first-name"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Bonnie" required/>
                                    {errors.firstName ? <div className="text-xs text-red-600 mt-1">{errors.firstName}</div> : null}
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                          <label htmlFor="last-name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last
                                                Name</label>
                                          <input value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} type="text" name="last-name" id="last-name"
                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Green" required/>
                                    {errors.lastName ? <div className="text-xs text-red-600 mt-1">{errors.lastName}</div> : null}
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="country"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                                <input value={form.country} onChange={(e) => handleChange('country', e.target.value)} type="text" name="country" id="country"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="United States" required/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="city"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} type="text" name="city" id="city"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="e.g. San Francisco" required/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="address"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} type="text" name="address" id="address"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="e.g. California" required/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} type="email" name="email" id="email"
                                aria-invalid={!!errors.email}
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="example@company.com" required/>
                                    {errors.email ? <div className="text-xs text-red-600 mt-1">{errors.email}</div> : null}
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="phone-number"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone
                                    Number</label>
                                <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} type="text" name="phone-number" id="phone-number"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="e.g. +(12)3456 789" required/>
                                    {errors.phone ? <div className="text-xs text-red-600 mt-1">{errors.phone}</div> : null}
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="birthday"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Birthday</label>
                                <input value={form.birthday} onChange={(e) => handleChange('birthday', e.target.value)} type="text" name="birthday" id="birthday"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="15/08/1990" required/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="organization"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization</label>
                                <input value={form.organization} onChange={(e) => handleChange('organization', e.target.value)} type="text" name="organization" id="organization"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="Company Name" required/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="role"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                                <input value={form.role} onChange={(e) => handleChange('role', e.target.value)} type="text" name="role" id="role"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="React Developer" required/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="department"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
                                <input value={form.department} onChange={(e) => handleChange('department', e.target.value)} type="text" name="department" id="department"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="Development" required/>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="zip-code"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zip/postal
                                    code</label>
                                <input value={form.zip} onChange={(e) => handleChange('zip', e.target.value)} type="text" name="zip-code" id="zip-code"
                                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="123456" required/>
                                    {errors.zip ? <div className="text-xs text-red-600 mt-1">{errors.zip}</div> : null}
                            </div>
                            <div className="col-span-6 sm:col-full">
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setEditing(prev => !prev)} className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{editing ? 'Cancel' : 'Edit'}</button>
                                    <button className="ml-1 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="submit">{loading ? 'Saving…' : 'Save'}</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                </form>
                {success ? <div className="text-sm text-green-600 mt-3">{success}</div> : null}
            </div>
        </div>
    )
}

export default PersonalInformation;