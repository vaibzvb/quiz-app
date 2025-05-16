import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock components for testing
const MockLogin = ({ onLogin }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    onLogin({ username: 'testuser', password: 'testpass' });
  }}>
    <label>
      Username
      <input type="text" aria-label="username" />
    </label>
    <label>
      Password
      <input type="password" aria-label="password" />
    </label>
    <button type="submit">Login</button>
  </form>
);

const MockRegister = ({ onRegister }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    onRegister({ username: 'newuser', password: 'newpass' });
  }}>
    <label>
      Username
      <input type="text" aria-label="username" />
    </label>
    <label>
      Password
      <input type="password" aria-label="password" />
    </label>
    <button type="submit">Register</button>
  </form>
);

describe('Authentication Tests', () => {
  test('Login form submits correctly', () => {
    const mockLogin = jest.fn();
    render(
      <MemoryRouter>
        <MockLogin onLogin={mockLogin} />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'testpass'
    });
  });

  test('Register form submits correctly', () => {
    const mockRegister = jest.fn();
    render(
      <MemoryRouter>
        <MockRegister onRegister={mockRegister} />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    expect(mockRegister).toHaveBeenCalledWith({
      username: 'newuser',
      password: 'newpass'
    });
  });
}); 