import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../../../hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: '1', role: 'user', username: 'john' } })
}));

jest.mock('../../../utils/rbac', () => ({
  canEditProfile: (currentId: string, role: string, targetId: string) => currentId === targetId && role === 'user',
}));

import UserKYC from './kyc';

const renderRoute = (path = '/user/1/kyc') => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path='/user/:id/kyc' element={<UserKYC />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('UserKYC read-only rules', () => {
  test('user editing own KYC: inputs enabled and Save visible', async () => {
    renderRoute('/user/1/kyc');
    const assetsHeading = await screen.findByRole('heading', { name: /Assets \(B\)/i });
    const assetsCard = assetsHeading.closest('div')!;
    const assetsAmount = within(assetsCard).getByLabelText(/Amount \(Currency\)/i) as HTMLInputElement;
    expect(assetsAmount).toBeEnabled();
    const saveBtn = screen.getByRole('button', { name: /Save KYC/i });
    expect(saveBtn).toBeInTheDocument();
  });

  test('officer view-only: inputs disabled and Save hidden', async () => {
    // Override hook to simulate officer
    jest.doMock('../../../hooks/use-auth', () => ({
      useAuth: () => ({ user: { id: '1', role: 'officer', username: 'off' } })
    }));
    const { unmount } = render(
      <MemoryRouter initialEntries={['/user/2/kyc']}>
        <Routes>
          <Route path='/user/:id/kyc' element={<UserKYC />} />
        </Routes>
      </MemoryRouter>
    );
    const assetsHeading = await screen.findByRole('heading', { name: /Assets \(B\)/i });
    const assetsCard = assetsHeading.closest('div')!;
    const assetsAmount = within(assetsCard).getByLabelText(/Amount \(Currency\)/i) as HTMLInputElement;
    expect(assetsAmount).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Save KYC/i })).toBeNull();
    unmount();
  });
});

describe('UserKYC net worth calculation', () => {
  test('calculates net worth as sum of A+B+C+D', async () => {
    renderRoute('/user/1/kyc');

    // Incomes (A)
    const incomesHeading = await screen.findByRole('heading', { name: /Incomes \(A\)/i });
    const incomesCard = incomesHeading.closest('div')!;
    const incomeAmount = within(incomesCard).getByLabelText(/Amount \(Currency\)/i) as HTMLInputElement;
    await userEvent.clear(incomeAmount);
    await userEvent.type(incomeAmount, '10');
    await userEvent.click(within(incomesCard).getByRole('button', { name: /Add Income/i }));

    // Assets (B)
    const assetsHeading = await screen.findByRole('heading', { name: /Assets \(B\)/i });
    const assetsCard = assetsHeading.closest('div')!;
    const assetAmount = within(assetsCard).getByLabelText(/Amount \(Currency\)/i) as HTMLInputElement;
    await userEvent.clear(assetAmount);
    await userEvent.type(assetAmount, '20');
    await userEvent.click(within(assetsCard).getByRole('button', { name: /Add Asset/i }));

    // Liabilities (C)
    const liabilitiesHeading = await screen.findByRole('heading', { name: /Liabilities \(C\)/i });
    const liabilitiesCard = liabilitiesHeading.closest('div')!;
    const liabilityAmount = within(liabilitiesCard).getByLabelText(/Amount \(Currency\)/i) as HTMLInputElement;
    await userEvent.clear(liabilityAmount);
    await userEvent.type(liabilityAmount, '30');
    await userEvent.click(within(liabilitiesCard).getByRole('button', { name: /Add Liability/i }));

    // Source of Wealth (D)
    const sowHeading = await screen.findByRole('heading', { name: /Source of Wealth \(D\)/i });
    const sowCard = sowHeading.closest('div')!;
    const sowAmount = within(sowCard).getByLabelText(/Amount \(Currency\)/i) as HTMLInputElement;
    await userEvent.clear(sowAmount);
    await userEvent.type(sowAmount, '40');
    await userEvent.click(within(sowCard).getByRole('button', { name: /Add Source of Wealth/i }));

    const net = screen.getByLabelText(/Net Worth/i) as HTMLInputElement;
    expect(net.value).toBe('100');
  });
});

// Silence act warnings from React during controlled input typing; tests assert final UI state
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg?: any) => {
    if (typeof msg === 'string' && msg.includes('not wrapped in act')) return;
    // pass through other errors
    // eslint-disable-next-line no-console
    console.warn(msg);
  });
});
