import React, {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useAuth} from '../../../hooks/use-auth';
import {canEditProfile, canAccessProfile} from '../../../utils/rbac';
import {fetchUserById, updateUserProfile, uploadProfilePicture, APIUser} from '../../../services/api';

const PersonalInformation: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string,string>>({});

    // form state with defaults from placeholders
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        country: '',
        city: '',
        address: '',
        email: '',
        phone: '',
        birthday: '',
        organization: '',
        role: '',
        department: '',
        zip: ''
    });

    const [userImage, setUserImage] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Check permissions
    useEffect(() => {
        if (!currentUser || !id) {
            navigate('/login');
            return;
        }
        
        if (!canAccessProfile(currentUser.id, currentUser.role, id)) {
            navigate('/pages/unauthorized');
        }
    }, [currentUser, id, navigate]);

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

    // Load user data
    useEffect(() => {
        let cancelled = false;
        const loadUser = async () => {
            if (!id) return;
            setLoading(true);
            setFetchError(null);
            try {
                const data = await fetchUserById(id);
                if (cancelled) return;

                // Map API data to form
                setForm({
                    firstName: data.firstName ?? '',
                    lastName: data.lastName ?? '',
                    email: data.email ?? '',
                    phone: data.phone ?? '',
                    city: data.address?.city ?? '',
                    country: data.address?.country ?? '',
                    address: data.address?.address ?? '',
                    zip: data.address?.postalCode ?? '',
                    organization: data.company?.name ?? '',
                    role: data.company?.title ?? '',
                    birthday: data.birthDate ?? '',
                    department: '',
                });

                setUserImage(data.image ?? null);
            } catch (err: any) {
                console.error(err);
                if (!cancelled) setFetchError(err?.message ?? 'Failed to load user');
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
        if (!id) return;
        
        setLoading(true);
        setSuccess(null);
        setFetchError(null);
        
        try {
            // Update profile via API
            const updates: Partial<APIUser> = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                birthDate: form.birthday,
                address: {
                    address: form.address,
                    city: form.city,
                    state: '',
                    postalCode: form.zip,
                    country: form.country,
                },
                company: {
                    name: form.organization,
                    title: form.role,
                },
            };
            
            await updateUserProfile(id, updates);
            setEditing(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            console.error(err);
            setFetchError(err?.message ?? 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !id) return;

        // Validate file
        if (file.size > 800 * 1024) {
            setFetchError('File size must be less than 800KB');
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            setFetchError('Only JPG, PNG, or GIF images are allowed');
            return;
        }

        setUploadingPicture(true);
        setFetchError(null);

        try {
            const result = await uploadProfilePicture(id, file);
            setUserImage(result.url);
            setSuccess('Profile picture uploaded successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            console.error(err);
            setFetchError(err?.message ?? 'Failed to upload picture');
        } finally {
            setUploadingPicture(false);
        }
    };

    const handleDeletePicture = () => {
        setUserImage(null);
        setSuccess('Profile picture removed');
        setTimeout(() => setSuccess(null), 2000);
    };

    const canEdit = currentUser && id ? canEditProfile(currentUser.id, currentUser.role, id) : false;
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
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {success}
                    </div>
                )}
                {fetchError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {fetchError}
                    </div>
                )}
                <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                    <img className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 object-cover"
                        src={userImage ?? `${process.env.PUBLIC_URL}/images/users/bonnie-green-2x.png`} alt="Profile"/>
                    <div>
                        <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Profile picture</h3>
                        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                            JPG, GIF or PNG. Max size of 800K
                        </div>
                        <div className="flex items-center space-x-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/gif"
                                onChange={handlePictureUpload}
                                className="hidden"
                                disabled={!canEdit || uploadingPicture}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={!canEdit || uploadingPicture}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg className="w-4 h-4 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                                </svg>
                                {uploadingPicture ? 'Uploading...' : 'Upload picture'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDeletePicture}
                                disabled={!canEdit || !userImage}
                                className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
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
                                    {canEdit && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setEditing(prev => !prev)}
                                                disabled={loading}
                                                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50">
                                                {editing ? 'Cancel' : 'Edit'}
                                            </button>
                                            {editing && (
                                                <button
                                                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50"
                                                    type="submit"
                                                    disabled={loading}>
                                                    {loading ? 'Saving…' : 'Save Changes'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {!canEdit && (
                                        <div className="text-sm text-gray-500">View-only mode</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </fieldset>

                </form>
            </div>
        </div>
    )
}

export default PersonalInformation;