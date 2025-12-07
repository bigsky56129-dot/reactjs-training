import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TableView from './table-view';

describe('TableView Component', () => {
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
      role: 'user',
      birthDate: '1990-01-01',
      address: {
        city: 'New York',
        state: 'NY',
        country: 'USA'
      }
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
      role: 'officer',
      birthDate: '1992-05-15',
      address: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA'
      }
    }
  ];

  it('should render table with user data', () => {
    render(
      <MemoryRouter>
        <TableView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('should display table headers', () => {
    render(
      <MemoryRouter>
        <TableView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('should display user emails', () => {
    render(
      <MemoryRouter>
        <TableView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should display user roles', () => {
    render(
      <MemoryRouter>
        <TableView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('officer')).toBeInTheDocument();
  });

  it('should render empty state when no users', () => {
    render(
      <MemoryRouter>
        <TableView users={[]} />
      </MemoryRouter>
    );

    expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
  });

  it('should render table headers', () => {
    render(
      <MemoryRouter>
        <TableView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });
});
