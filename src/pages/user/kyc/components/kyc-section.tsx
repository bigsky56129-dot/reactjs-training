import React from 'react';

export interface KycRow {
  type: string;
  amount: number;
}

export interface KycSectionProps {
  title: string;
  description?: React.ReactNode;
  canEdit: boolean;
  typeOptions: string[];
  idPrefix?: string;

  addTypeValue: string;
  onChangeAddType: (v: string) => void;
  addAmountValue: string;
  onChangeAddAmount: (v: string) => void;
  addErrors?: { type?: string; amount?: string };
  addButtonLabel: string;
  onAdd: () => void;

  rows: KycRow[];
  rowErrors?: Record<number, { type?: string; amount?: string }>;
  onUpdate: (index: number, field: 'type' | 'amount', value: string) => void;
  onRemove: (index: number) => void;

  totalLabel?: string;
  totalValue?: number | '';
}

const KycSection: React.FC<KycSectionProps> = ({
  title,
  description,
  canEdit,
  typeOptions,
  idPrefix,
  addTypeValue,
  onChangeAddType,
  addAmountValue,
  onChangeAddAmount,
  addErrors,
  addButtonLabel,
  onAdd,
  rows,
  rowErrors,
  onUpdate,
  onRemove,
  totalLabel,
  totalValue,
}) => {
  const prefix = (idPrefix || title).toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description ? (
        <div className="text-sm text-gray-600 mb-4">{description}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-4">
        <div>
          <label htmlFor={`${prefix}-add-type`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
          <select
            id={`${prefix}-add-type`}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
            value={addTypeValue}
            onChange={(e) => onChangeAddType(e.target.value)}
            disabled={!canEdit}
          >
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {addErrors?.type && (
            <div className="text-xs text-red-600 mt-1">{addErrors.type}</div>
          )}
        </div>
        <div>
          <label htmlFor={`${prefix}-add-amount`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount (Currency)</label>
          <input
            id={`${prefix}-add-amount`}
            type="number"
            placeholder="Enter amount"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
            value={addAmountValue}
            onChange={(e) => onChangeAddAmount(e.target.value)}
            disabled={!canEdit}
          />
          {addErrors?.amount && (
            <div className="text-xs text-red-600 mt-1">{addErrors.amount}</div>
          )}
        </div>
      </div>

      {typeof totalLabel === 'string' ? (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{totalLabel}</label>
          <input
            type="text"
            readOnly
            value={String(typeof totalValue === 'number' ? totalValue : '')}
            placeholder="Calculated Total"
            className="shadow-sm bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onAdd}
        disabled={!canEdit}
        className="inline-flex items-center px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {addButtonLabel}
      </button>

      {rows.length > 0 && (
        <div className="mt-4">
          <div className="space-y-3">
            {rows.map((row, idx) => (
              <div key={`${row.type}-${idx}`} className="border border-gray-200 rounded-lg p-3">
                <div className="flex flex-col md:flex-row md:items-end md:gap-4 gap-3">
                  <div className="md:flex-1">
                    <label htmlFor={`${prefix}-row-${idx}-type`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                    <select
                      id={`${prefix}-row-${idx}-type`}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      value={row.type}
                      onChange={(e) => onUpdate(idx, 'type', e.target.value)}
                      disabled={!canEdit}
                    >
                      {typeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {rowErrors?.[idx]?.type && (
                      <div className="text-xs text-red-600 mt-1">{rowErrors[idx]?.type}</div>
                    )}
                  </div>
                  <div className="md:flex-1">
                    <label htmlFor={`${prefix}-row-${idx}-amount`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                    <input
                      id={`${prefix}-row-${idx}-amount`}
                      type="number"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      value={String(row.amount)}
                      onChange={(e) => onUpdate(idx, 'amount', e.target.value)}
                      disabled={!canEdit}
                    />
                    {rowErrors?.[idx]?.amount && (
                      <div className="text-xs text-red-600 mt-1">{rowErrors[idx]?.amount}</div>
                    )}
                  </div>
                  {canEdit && (
                    <div className="md:self-end">
                      <button
                        type="button"
                        onClick={() => onRemove(idx)}
                        className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                        aria-label={`Remove ${title}`}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KycSection;
