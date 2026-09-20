import {
  render,
  screen,
  within,
  fireEvent,
  waitForElementToBeRemoved
} from '@testing-library/react';
import App from './App';

// Uses fireEvent rather than user-event: the version pinned here (v13)
// predates React 18 and does not wrap its events in act(), so state updates
// never flush. fireEvent is act-wrapped.

beforeEach(() => {
  window.localStorage.clear();
});

const addTransaction = ({ amount, details, type }) => {
  fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
  fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
    target: { value: amount }
  });
  fireEvent.change(screen.getByPlaceholderText(/enter details/i), {
    target: { value: details }
  });
  fireEvent.click(screen.getByLabelText(type));
  fireEvent.click(screen.getByRole('button', { name: /^add transaction$/i }));
};

test('renders the heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /expense tracker/i })
  ).toBeInTheDocument();
});

test('shows an empty state before anything is added', () => {
  render(<App />);
  expect(screen.getByText(/no transactions yet/i)).toBeInTheDocument();
});

test('adding transactions updates the totals and the balance', () => {
  render(<App />);

  addTransaction({ amount: '40000', details: 'Salary', type: 'Budget' });
  addTransaction({ amount: '10000', details: 'Rent', type: 'Expense' });

  expect(screen.getByText('Ksh 40,000')).toBeInTheDocument();
  expect(screen.getByText('Ksh 10,000')).toBeInTheDocument();
  // Balance: 40,000 - 10,000
  expect(screen.getByText('Ksh 30,000')).toBeInTheDocument();
});

test('a transaction can be removed', async () => {
  render(<App />);

  addTransaction({ amount: '1500', details: 'Water Bills', type: 'Expense' });
  expect(screen.getByText('Water Bills')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /remove water bills/i }));

  // The row animates out, so it lingers in the DOM briefly after the click.
  await waitForElementToBeRemoved(() => screen.queryByText('Water Bills'));
});

test('search filters the list without discarding non-matching rows', async () => {
  render(<App />);

  addTransaction({ amount: '5000', details: 'Food', type: 'Expense' });
  addTransaction({ amount: '2000', details: 'WiFi', type: 'Expense' });

  const search = screen.getByPlaceholderText(/search here/i);
  fireEvent.change(search, { target: { value: 'food' } });

  expect(screen.getByText('Food')).toBeInTheDocument();
  // Filtered-out rows animate out, so they outlive the keystroke briefly.
  await waitForElementToBeRemoved(() => screen.queryByText('WiFi'));

  // Clearing the query must bring the filtered-out row back.
  fireEvent.change(search, { target: { value: '' } });

  expect(screen.getByText('Food')).toBeInTheDocument();
  expect(screen.getByText('WiFi')).toBeInTheDocument();
});

test('expenses and income are visually distinguished', () => {
  render(<App />);

  addTransaction({ amount: '40000', details: 'Salary', type: 'Budget' });
  addTransaction({ amount: '5000', details: 'Food', type: 'Expense' });

  // The sign carries the meaning independently of colour.
  expect(screen.getByText(/^\+Ksh 40,000$/)).toBeInTheDocument();
  expect(screen.getByText(/^-Ksh 5,000$/)).toBeInTheDocument();
});

test('the submit button stays disabled until the form is valid', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
  const submit = screen.getByRole('button', { name: /^add transaction$/i });

  expect(submit).toBeDisabled();

  fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
    target: { value: '500' }
  });
  expect(submit).toBeDisabled();

  fireEvent.change(screen.getByPlaceholderText(/enter details/i), {
    target: { value: 'Lunch' }
  });
  expect(submit).toBeEnabled();
});

test('transactions survive a reload', () => {
  const { unmount } = render(<App />);

  addTransaction({ amount: '3200', details: 'Rent', type: 'Expense' });
  unmount();

  render(<App />);
  const row = screen.getByText('Rent');
  expect(row).toBeInTheDocument();
  expect(within(row.parentElement).getByText(/^-Ksh 3,200$/)).toBeInTheDocument();
});
