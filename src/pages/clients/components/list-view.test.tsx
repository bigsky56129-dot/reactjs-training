import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListView from './list-view';

describe('ListView Component', () => {
  const mockUsers = [
    {
      id: 1,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      image: 'https://example.com/john.jpg',
      email: 'john@example.com',
      phone: '+1234567890',
      role: 'user'
    },
    {
      id: 2,
      username: 'janedoe',
      firstName: 'Jane',
      lastName: 'Doe',
      gender: 'female',
      image: 'https://example.com/jane.jpg',
      email: 'jane@example.com',
      phone: '+0987654321',
      role: 'user'
    }
  ];

  it('should render list of users', () => {
    render(
      <MemoryRouter>
        <ListView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('@janedoe')).toBeInTheDocument();
  });

  it('should display user names', () => {
    render(
      <MemoryRouter>
        <ListView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('should render empty state when no users', () => {
    render(
      <MemoryRouter>
        <ListView users={[]} />
      </MemoryRouter>
    );

    expect(screen.queryByText('@johndoe')).not.toBeInTheDocument();
  });

  it('should display profile links for each user', () => {
    render(
      <MemoryRouter>
        <ListView users={mockUsers} />
      </MemoryRouter>
    );

    const links = screen.getAllByText('View profile');
    expect(links).toHaveLength(2);
  });

  it('should render user avatars', () => {
    render(
      <MemoryRouter>
        <ListView users={mockUsers} />
      </MemoryRouter>
    );

    const avatars = screen.getAllByRole('img');
    expect(avatars.length).toBeGreaterThan(0);
  });
});
