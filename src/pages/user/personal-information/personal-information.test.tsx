import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock hooks and services
jest.mock('../../../hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: '1', role: 'user', username: 'john', name: 'John Doe' } })
}));

jest.mock('../../../utils/rbac', () => ({
  canAccessProfile: () => true,
  canEditProfile: () => true,
}));

jest.mock('../../../services/api', () => ({
  __esModule: true,
  fetchUserById: jest.fn(async (id: string | number) => ({
    id: Number(id),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    username: 'john',
    phone: '+123456789',
    birthDate: '1990-01-01',
    image: '/images/users/bonnie-green-2x.png',
    address: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    company: {
      name: 'Acme Corp',
      title: 'Engineer',
      department: 'R&D',
    },
  })),
  updateUserProfile: jest.fn(async () => ({ success: true })),
  uploadProfilePicture: jest.fn(async () => ({ url: '/images/users/bonnie-green-2x.png' })),
  getProfilePictureUrl: jest.fn(() => '/images/users/bonnie-green-2x.png'),
}))

import PersonalInformation from './personal-information';

const renderWithRoute = (initialPath = '/user/1/pi') => {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path='/user/:id/pi' element={<PersonalInformation />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PersonalInformation multi-entry validations', () => {
  // Silence console.error noise from component during test
  let consoleErrorSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
  test('shows errors for invalid extra phone/email/address and grouped address fields', async () => {
    renderWithRoute();

    // Wait for initial data load
    await waitFor(() => expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument());

    // Enter edit mode (wait until not loading)
    const editBtn = screen.getByRole('button', { name: /Edit/i });
    await waitFor(() => expect(editBtn).toBeEnabled());
    await userEvent.click(editBtn);
    // Confirm edit mode by checking a field becomes enabled
    await waitFor(() => expect(screen.getByLabelText(/First Name/i)).toBeEnabled());

    // Add invalid extra phone (scope to Other Phones section)
    const otherPhonesLabel = await screen.findByText(/Other Phones/i);
    const otherPhonesSection = otherPhonesLabel.closest('div')?.parentElement as HTMLElement;
    const addPhoneBtn = within(otherPhonesSection).getByRole('button', { name: /^Add$/ });
    await userEvent.click(addPhoneBtn);
    const otherPhoneInputs = screen.getAllByPlaceholderText(/\+\(12\)3456 789/i);
    const lastPhone = otherPhoneInputs[otherPhoneInputs.length - 1];
    await userEvent.clear(lastPhone);
    await userEvent.type(lastPhone, 'abc');

    // Add invalid extra email (scope to Other Emails section)
    const otherEmailsLabel = await screen.findByText(/Other Emails/i);
    const otherEmailsSection = otherEmailsLabel.closest('div')?.parentElement as HTMLElement;
    const addEmailBtn = within(otherEmailsSection).getByRole('button', { name: /^Add$/ });
    await userEvent.click(addEmailBtn);
    const otherEmailInputs = screen.getAllByPlaceholderText(/example@company.com/i);
    const lastEmail = otherEmailInputs[otherEmailInputs.length - 1];
    await userEvent.clear(lastEmail);
    await userEvent.type(lastEmail, 'not-an-email');

    // Add invalid simple address (scope to Other Addresses section)
    const otherAddressesLabel = await screen.findByText(/Other Addresses/i);
    const otherAddressesSection = otherAddressesLabel.closest('div')?.parentElement as HTMLElement;
    const addAddressBtn = within(otherAddressesSection).getByRole('button', { name: /^Add$/ });
    await userEvent.click(addAddressBtn);
    const otherAddressInputs = screen.getAllByPlaceholderText(/e\.g\. California/i);
    const lastAddr = otherAddressInputs[otherAddressInputs.length - 1];
    await userEvent.clear(lastAddr);
    await userEvent.type(lastAddr, 'x');

    // Add grouped extra address and set invalid zip (scope to Grouped Extra Addresses)
    const groupedLabel = await screen.findByText(/Grouped Extra Addresses/i);
    const groupedSection = groupedLabel.closest('div')?.parentElement as HTMLElement;
    let addGroupedBtn = within(groupedSection).getByRole('button', { name: /^Add$/ });
    await waitFor(() => expect(addGroupedBtn).toBeEnabled());
    await userEvent.click(addGroupedBtn);
    const zipInputs = await within(groupedSection).findAllByPlaceholderText(/Zip/i);
    const lastZip = zipInputs[zipInputs.length - 1];
    await userEvent.clear(lastZip);
    await userEvent.type(lastZip, '12'); // invalid (needs 3-10 digits)

    // Save to trigger validation
    const saveBtn = screen.getByRole('button', { name: /Save Changes|Saving…/i });
    await userEvent.click(saveBtn);

    // Expect validation messages
    expect(await screen.findByText(/Phone #\d+ is invalid/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email #\d+ is invalid/i)).toBeInTheDocument();
    expect(await screen.findByText(/Address #\d+ is too short/i)).toBeInTheDocument();
    expect(await screen.findByText(/Extra address #\d+ has invalid fields/i)).toBeInTheDocument();
  });
});
