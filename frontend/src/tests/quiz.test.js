import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuizList from '../pages/QuizList';
import CreateQuiz from '../pages/CreateQuiz';

// Mock axios
jest.mock('axios');

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Quiz Tests', () => {
  test('Quiz list renders correctly', () => {
    const mockQuizzes = [
      { id: 1, title: 'Test Quiz 1', description: 'Description 1' },
      { id: 2, title: 'Test Quiz 2', description: 'Description 2' }
    ];

    render(
      <MemoryRouter>
        <QuizList quizzes={mockQuizzes} />
      </MemoryRouter>
    );

    const quizTitles = screen.getAllByRole('heading', { level: 3 });
    expect(quizTitles).toHaveLength(2);
    expect(quizTitles[0]).toHaveTextContent('Test Quiz 1');
    expect(quizTitles[1]).toHaveTextContent('Test Quiz 2');
  });

  test('Create quiz form submits correctly', () => {
    const mockCreateQuiz = jest.fn();
    render(
      <MemoryRouter>
        <CreateQuiz onCreateQuiz={mockCreateQuiz} />
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create quiz/i });

    fireEvent.change(titleInput, { target: { value: 'New Quiz' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(submitButton);

    expect(mockCreateQuiz).toHaveBeenCalledWith({
      title: 'New Quiz',
      description: 'New Description',
      questions: []
    });
  });
}); 