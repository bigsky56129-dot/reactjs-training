import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Simple KYC app', () => {
  render(<App />);
  const appElement = screen.getByText(/Simple KYC Authentication/i);
  expect(appElement).toBeInTheDocument();
});

test('renders login form', () => {
  render(<App />);
  const loginButton = screen.getByLabelText(/Log in/i);
  expect(loginButton).toBeInTheDocument();
});
