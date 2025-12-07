import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './sidebar';
import { AuthenticatedContext, User } from '../../shared/authenticated';

const mockUserRole: User = {
  id: '1',
  name: 'Regular User',
  username: 'user1',
  email: 'user@example.com',
  role: 'user' as const,
};

const mockOfficerRole: User = {
  ...mockUserRole,
  role: 'officer' as const,
};

describe('Sidebar Component', () => {
  it('should render navigation links', () => {
    render(
      <MemoryRouter>
        <AuthenticatedContext.Provider value={{ user: mockUserRole, setUser: jest.fn(), logout: jest.fn() }}>
          <Sidebar />
        </AuthenticatedContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  it('should show Review link for officer role', () => {
    render(
      <MemoryRouter>
        <AuthenticatedContext.Provider value={{ user: mockOfficerRole, setUser: jest.fn(), logout: jest.fn() }}>
          <Sidebar />
        </AuthenticatedContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Review/i)).toBeInTheDocument();
  });

  it('should not show Review link for user role', () => {
    render(
      <MemoryRouter>
        <AuthenticatedContext.Provider value={{ user: mockUserRole, setUser: jest.fn(), logout: jest.fn() }}>
          <Sidebar />
        </AuthenticatedContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText(/Review/i)).not.toBeInTheDocument();
  });
});
