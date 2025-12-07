import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GridView from './grid-view';

describe('GridView Component', () => {
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
      role: 'officer'
    }
  ];

  it('should render grid of user cards', () => {
    render(
      <MemoryRouter>
        <GridView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('should display username badges', () => {
    render(
      <MemoryRouter>
        <GridView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('@janedoe')).toBeInTheDocument();
  });

  it('should display role badges', () => {
    render(
      <MemoryRouter>
        <GridView users={mockUsers} />
      </MemoryRouter>
    );

    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('officer')).toBeInTheDocument();
  });

  it('should render empty state when no users', () => {
    render(
      <MemoryRouter>
        <GridView users={[]} />
      </MemoryRouter>
    );

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should display profile pictures', () => {
    render(
      <MemoryRouter>
        <GridView users={mockUsers} />
      </MemoryRouter>
    );

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should render view profile links', () => {
    render(
      <MemoryRouter>
        <GridView users={mockUsers} />
      </MemoryRouter>
    );

    const links = screen.getAllByText(/View profile/i);
    expect(links).toHaveLength(2);
  });
});
