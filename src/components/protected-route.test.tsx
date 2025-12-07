import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { AuthenticatedProvider } from '../shared/authenticated';

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithRouter = (user: any = null, requiredPermission?: any) => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    }

    return render(
      <AuthenticatedProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute requiredPermission={requiredPermission}>
                  <TestComponent />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          </Routes>
        </MemoryRouter>
      </AuthenticatedProvider>
    );
  };

  it('should render children when user is authenticated and has permission', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user'
    };

    renderWithRouter(mockUser, 'view:own-profile');
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render children when no permission required', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user'
    };

    renderWithRouter(mockUser);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
