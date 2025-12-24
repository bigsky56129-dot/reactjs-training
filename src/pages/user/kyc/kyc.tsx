import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';
import { canEditProfile } from '../../../utils/rbac';
import KycSection from './components/kyc-section';

const UserKYC: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const canEdit = user && id ? canEditProfile(user.id, user.role, id) : false;

    // Section totals
    const [a, setA] = useState<number | ''>('');
    const [b, setB] = useState<number | ''>('');
    const [c, setC] = useState<number | ''>('');
    const [d, setD] = useState<number | ''>('');

    // Incomes (A)
    const [incomeType, setIncomeType] = useState<string>('Salary');
    const [incomeAmount, setIncomeAmount] = useState<string>('');
    const [incomes, setIncomes] = useState<Array<{ type: string; amount: number }>>([]);
    const [incomeErrors, setIncomeErrors] = useState<Record<number, { type?: string; amount?: string }>>({});

    // Assets (B)
    const [assetType, setAssetType] = useState<string>('Bond');
    const [assetAmount, setAssetAmount] = useState<string>('');
    const [assets, setAssets] = useState<Array<{ type: string; amount: number }>>([]);
    const [assetErrors, setAssetErrors] = useState<Record<number, { type?: string; amount?: string }>>({});

    // Liabilities (C)
    const [liabilityType, setLiabilityType] = useState<string>('Personal Loan');
    const [liabilityAmount, setLiabilityAmount] = useState<string>('');
    const [liabilities, setLiabilities] = useState<Array<{ type: string; amount: number }>>([]);
    const [liabilityErrors, setLiabilityErrors] = useState<Record<number, { type?: string; amount?: string }>>({});

    // Source of Wealth (D)
    const [sowType, setSowType] = useState<string>('Inheritance');
    const [sowAmount, setSowAmount] = useState<string>('');
    const [sourcesOfWealth, setSourcesOfWealth] = useState<Array<{ type: string; amount: number }>>([]);
    const [sowErrors, setSowErrors] = useState<Record<number, { type?: string; amount?: string }>>({});

    // Other fields
    const [experience, setExperience] = useState<string>('');
    const [riskTolerance, setRiskTolerance] = useState<string>('');
    const [success, setSuccess] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Net worth = A + B + C + D
    const netWorth = useMemo(() => {
        const av = typeof a === 'number' ? a : 0;
        const bv = typeof b === 'number' ? b : 0;
        const cv = typeof c === 'number' ? c : 0;
        const dv = typeof d === 'number' ? d : 0;
        return av + bv + cv + dv;
    }, [a, b, c, d]);

    const incomeTypes = ['Salary', 'Bonus', 'Investment', 'Other'];
    const assetTypes = ['Bond', 'Stock', 'Property', 'Cash', 'Other'];
    const liabilityTypes = ['Personal Loan', 'Mortgage', 'Credit Card', 'Auto Loan', 'Other'];
    const sowTypes = ['Inheritance', 'Donation', 'Gift', 'Other'];

    // Add handlers
    const addIncome = () => {
        const amountNum = Number(incomeAmount);
        const errs: { type?: string; amount?: string } = {};
        if (!incomeType) errs.type = 'Select a type';
        if (Number.isNaN(amountNum) || amountNum <= 0) errs.amount = 'Enter a positive amount';
        if (errs.type || errs.amount) {
            setIncomeErrors({ ...incomeErrors, [-1]: errs });
            return;
        }
        const next = [...incomes, { type: incomeType, amount: amountNum }];
        setIncomes(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0);
        setA(sum);
        setIncomeAmount('');
        if (incomeErrors[-1]) {
            const { [-1]: _omit, ...rest } = incomeErrors; setIncomeErrors(rest);
        }
    };

    const addAsset = () => {
        const amountNum = Number(assetAmount);
        const errs: { type?: string; amount?: string } = {};
        if (!assetType) errs.type = 'Select a type';
        if (Number.isNaN(amountNum) || amountNum <= 0) errs.amount = 'Enter a positive amount';
        if (errs.type || errs.amount) {
            setAssetErrors({ ...assetErrors, [-1]: errs });
            return;
        }
        const next = [...assets, { type: assetType, amount: amountNum }];
        setAssets(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0);
        setB(sum);
        setAssetAmount('');
        if (assetErrors[-1]) { const { [-1]: _o, ...rest } = assetErrors; setAssetErrors(rest); }
    };

    const addLiability = () => {
        const amountNum = Number(liabilityAmount);
        const errs: { type?: string; amount?: string } = {};
        if (!liabilityType) errs.type = 'Select a type';
        if (Number.isNaN(amountNum) || amountNum <= 0) errs.amount = 'Enter a positive amount';
        if (errs.type || errs.amount) {
            setLiabilityErrors({ ...liabilityErrors, [-1]: errs });
            return;
        }
        const next = [...liabilities, { type: liabilityType, amount: amountNum }];
        setLiabilities(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0);
        setC(sum);
        setLiabilityAmount('');
        if (liabilityErrors[-1]) { const { [-1]: _o, ...rest } = liabilityErrors; setLiabilityErrors(rest); }
    };

    const addSow = () => {
        const amountNum = Number(sowAmount);
        const errs: { type?: string; amount?: string } = {};
        if (!sowType) errs.type = 'Select a type';
        if (Number.isNaN(amountNum) || amountNum <= 0) errs.amount = 'Enter a positive amount';
        if (errs.type || errs.amount) { setSowErrors({ ...sowErrors, [-1]: errs }); return; }
        const next = [...sourcesOfWealth, { type: sowType, amount: amountNum }];
        setSourcesOfWealth(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0);
        setD(sum);
        setSowAmount('');
        if (sowErrors[-1]) { const { [-1]: _o, ...rest } = sowErrors; setSowErrors(rest); }
    };

    // Update handlers
    const updateIncome = (index: number, field: 'type' | 'amount', value: string) => {
        const next = incomes.map((inc, i) => {
            if (i !== index) return inc;
            if (field === 'type') return { ...inc, type: value };
            const n = Number(value); return { ...inc, amount: Number.isNaN(n) ? 0 : n };
        });
        setIncomes(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0); setA(sum);
        const current = incomeErrors[index] || {};
        const errs: { type?: string; amount?: string } = { ...current };
        const row = next[index];
        if (!row.type) errs.type = 'Select a type'; else delete errs.type;
        if (!row.amount || row.amount <= 0) errs.amount = 'Enter a positive amount'; else delete errs.amount;
        setIncomeErrors({ ...incomeErrors, [index]: errs });
    };

    const updateAsset = (index: number, field: 'type' | 'amount', value: string) => {
        const next = assets.map((as, i) => {
            if (i !== index) return as;
            if (field === 'type') return { ...as, type: value };
            const n = Number(value); return { ...as, amount: Number.isNaN(n) ? 0 : n };
        });
        setAssets(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0); setB(sum);
        const current = assetErrors[index] || {};
        const errs: { type?: string; amount?: string } = { ...current };
        const row = next[index];
        if (!row.type) errs.type = 'Select a type'; else delete errs.type;
        if (!row.amount || row.amount <= 0) errs.amount = 'Enter a positive amount'; else delete errs.amount;
        setAssetErrors({ ...assetErrors, [index]: errs });
    };

    const updateLiability = (index: number, field: 'type' | 'amount', value: string) => {
        const next = liabilities.map((li, i) => {
            if (i !== index) return li;
            if (field === 'type') return { ...li, type: value };
            const n = Number(value); return { ...li, amount: Number.isNaN(n) ? 0 : n };
        });
        setLiabilities(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0); setC(sum);
        const current = liabilityErrors[index] || {};
        const errs: { type?: string; amount?: string } = { ...current };
        const row = next[index];
        if (!row.type) errs.type = 'Select a type'; else delete errs.type;
        if (!row.amount || row.amount <= 0) errs.amount = 'Enter a positive amount'; else delete errs.amount;
        setLiabilityErrors({ ...liabilityErrors, [index]: errs });
    };

    const updateSow = (index: number, field: 'type' | 'amount', value: string) => {
        const next = sourcesOfWealth.map((sw, i) => {
            if (i !== index) return sw;
            if (field === 'type') return { ...sw, type: value };
            const n = Number(value); return { ...sw, amount: Number.isNaN(n) ? 0 : n };
        });
        setSourcesOfWealth(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0); setD(sum);
        const current = sowErrors[index] || {};
        const errs: { type?: string; amount?: string } = { ...current };
        const row = next[index];
        if (!row.type) errs.type = 'Select a type'; else delete errs.type;
        if (!row.amount || row.amount <= 0) errs.amount = 'Enter a positive amount'; else delete errs.amount;
        setSowErrors({ ...sowErrors, [index]: errs });
    };

    // Remove handlers
    const removeIncome = (index: number) => {
        const next = incomes.filter((_, i) => i !== index);
        setIncomes(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0); setA(sum);
        const { [index]: _omit, ...rest } = incomeErrors; setIncomeErrors(rest);
    };
    const removeAsset = (index: number) => {
        const next = assets.filter((_, i) => i !== index);
        setAssets(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0); setB(sum);
        const { [index]: _omit, ...rest } = assetErrors; setAssetErrors(rest);
    };
    const removeLiability = (index: number) => {
        const next = liabilities.filter((_, i) => i !== index);
        setLiabilities(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0); setC(sum);
        const { [index]: _omit, ...rest } = liabilityErrors; setLiabilityErrors(rest);
    };
    const removeSow = (index: number) => {
        const next = sourcesOfWealth.filter((_, i) => i !== index);
        setSourcesOfWealth(next);
        const sum = next.reduce((acc, i) => acc + i.amount, 0); setD(sum);
        const { [index]: _omit, ...rest } = sowErrors; setSowErrors(rest);
    };

    // Validation and save
    const validate = () => {
        const e: Record<string, string> = {};
        const isNum = (v: number | '') => typeof v === 'number' && v >= 0;
        if (!isNum(a)) e.a = 'Enter non-negative assets';
        if (!isNum(b)) e.b = 'Enter non-negative liabilities';
        if (!isNum(c)) e.c = 'Enter non-negative income';
        if (!isNum(d)) e.d = 'Enter non-negative expenses';
        if (!experience) e.experience = 'Select experience';
        if (!riskTolerance) e.riskTolerance = 'Select risk tolerance';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canEdit) return;
        if (!validate()) return;
        setSuccess('KYC saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
    };

    return (
        <div className="px-4 pt-6 dark:bg-gray-900">
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Know Your Customer</h1>
                {!canEdit && <div className="mt-2 text-sm text-gray-500">View-only mode (officer)</div>}
            </div>
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>
                )}
                <form>
                    <fieldset disabled={!canEdit}>
                        <div className="grid grid-cols-1 gap-4">
                            <KycSection
                                title="Incomes (A)"
                                canEdit={!!canEdit}
                                typeOptions={incomeTypes}
                                addTypeValue={incomeType}
                                onChangeAddType={setIncomeType}
                                addAmountValue={incomeAmount}
                                onChangeAddAmount={setIncomeAmount}
                                addErrors={incomeErrors[-1]}
                                addButtonLabel="Add Income"
                                onAdd={addIncome}
                                rows={incomes}
                                rowErrors={incomeErrors}
                                onUpdate={updateIncome}
                                onRemove={removeIncome}
                            />

                            <KycSection
                                title="Assets (B)"
                                canEdit={!!canEdit}
                                typeOptions={assetTypes}
                                addTypeValue={assetType}
                                onChangeAddType={setAssetType}
                                addAmountValue={assetAmount}
                                onChangeAddAmount={setAssetAmount}
                                addErrors={assetErrors[-1]}
                                addButtonLabel="Add Asset"
                                onAdd={addAsset}
                                rows={assets}
                                rowErrors={assetErrors}
                                onUpdate={updateAsset}
                                onRemove={removeAsset}
                            />

                            <KycSection
                                title="Liabilities (C)"
                                description={
                                    <span>
                                        Liabilities are any outstanding debts or obligations you may have. These can include loans such as
                                        personal loans, mortgages, or other forms of debt.
                                    </span>
                                }
                                canEdit={!!canEdit}
                                typeOptions={liabilityTypes}
                                addTypeValue={liabilityType}
                                onChangeAddType={setLiabilityType}
                                addAmountValue={liabilityAmount}
                                onChangeAddAmount={setLiabilityAmount}
                                addErrors={liabilityErrors[-1]}
                                addButtonLabel="Add Liability"
                                onAdd={addLiability}
                                rows={liabilities}
                                rowErrors={liabilityErrors}
                                onUpdate={updateLiability}
                                onRemove={removeLiability}
                                totalLabel="Total Liabilities"
                                totalValue={typeof c === 'number' ? c : ''}
                            />

                            <KycSection
                                title="Source of Wealth (D)"
                                description={
                                    <span>
                                        This section identifies the origin of your wealth, such as any inheritance or donations you may
                                        have received. It's important for financial transparency.
                                    </span>
                                }
                                canEdit={!!canEdit}
                                typeOptions={sowTypes}
                                addTypeValue={sowType}
                                onChangeAddType={setSowType}
                                addAmountValue={sowAmount}
                                onChangeAddAmount={setSowAmount}
                                addErrors={sowErrors[-1]}
                                addButtonLabel="Add Source of Wealth"
                                onAdd={addSow}
                                rows={sourcesOfWealth}
                                rowErrors={sowErrors}
                                onUpdate={updateSow}
                                onRemove={removeSow}
                                totalLabel="Total Source of Wealth"
                                totalValue={typeof d === 'number' ? d : ''}
                            />

                            <div>
                                <label htmlFor="investment-experience" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Experience in Financial Markets
                                </label>
                                <select
                                    id="investment-experience"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                >
                                    <option value="">Select…</option>
                                    <option value="lt5">&lt; 5 years</option>
                                    <option value="gt5lt10">&gt; 5 and &lt; 10 years</option>
                                    <option value="gt10">&gt; 10 years</option>
                                </select>
                                {errors.experience ? <div className="text-xs text-red-600 mt-1">{errors.experience}</div> : null}
                            </div>
                            <div>
                                <label htmlFor="risk-tolerance" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Risk Tolerance</label>
                                <select
                                    id="risk-tolerance"
                                    value={riskTolerance}
                                    onChange={(e) => setRiskTolerance(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                >
                                    <option value="">Select…</option>
                                    <option value="10">10%</option>
                                    <option value="30">30%</option>
                                    <option value="all-in">All-in</option>
                                </select>
                                {errors.riskTolerance ? <div className="text-xs text-red-600 mt-1">{errors.riskTolerance}</div> : null}
                            </div>
                            <div>
                                <label htmlFor="net-worth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Net Worth</label>
                                <div className="text-xs text-gray-500 mb-1">Total</div>
                                <input
                                    id="net-worth"
                                    type="text"
                                    value={netWorth === 0 ? '' : String(netWorth)}
                                    readOnly
                                    placeholder="Automatically calculated"
                                    aria-readonly
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-not-allowed opacity-60"
                                />
                            </div>
                        </div>
                    </fieldset>
                    {canEdit && (
                        <div className="mt-6">
                            <button
                                type="submit"
                                onClick={handleSave}
                                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                Save KYC
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserKYC;