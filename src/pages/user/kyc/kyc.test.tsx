import React from 'react';
import { render, screen } from '@testing-library/react';
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
    const assets = await screen.findByLabelText(/Section A: Assets/i);
    expect(assets).toBeEnabled();
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
    const assets = await screen.findByLabelText(/Section A: Assets/i);
    expect(assets).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Save KYC/i })).toBeNull();
    unmount();
  });
});

describe('UserKYC net worth calculation', () => {
  test('calculates net worth as sum of A+B+C+D', async () => {
    renderRoute('/user/1/kyc');
    const a = await screen.findByLabelText(/Section A: Assets/i);
    const b = screen.getByLabelText(/Section B: Liabilities/i);
    const c = screen.getByLabelText(/Section C: Income/i);
    const d = screen.getByLabelText(/Section D: Expenses/i);

    await userEvent.clear(a);
    await userEvent.type(a, '10');
    await userEvent.clear(b);
    await userEvent.type(b, '20');
    await userEvent.clear(c);
    await userEvent.type(c, '30');
    await userEvent.clear(d);
    await userEvent.type(d, '40');

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
