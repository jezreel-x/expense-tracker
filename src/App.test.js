import {
  render,
  screen,
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

const addTransaction = ({ amount, details, type, category, customCategory }) => {
  fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
  fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
    target: { value: amount }
  });
  fireEvent.change(screen.getByPlaceholderText(/enter details/i), {
    target: { value: details }
  });
  if (category) {
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: category }
    });
  }
  if (customCategory) {
    fireEvent.change(screen.getByLabelText('Custom category'), {
      target: { value: customCategory }
    });
  }
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

test('a transaction records and displays its category', () => {
  render(<App />);

  addTransaction({
    amount: '1200',
    details: 'Lunch at Java',
    type: 'Expense',
    category: 'Food'
  });

  expect(screen.getByText('Food')).toBeInTheDocument();
});

test('a custom category can be entered and is saved', () => {
  render(<App />);

  addTransaction({
    amount: '2000',
    details: 'Monthly contribution',
    type: 'Expense',
    category: '__custom__',
    customCategory: 'Chama'
  });

  expect(screen.getByText('Chama')).toBeInTheDocument();
});

test('search matches categories as well as details', async () => {
  render(<App />);

  addTransaction({
    amount: '800',
    details: 'Matatu fare',
    type: 'Expense',
    category: 'Transport'
  });
  addTransaction({
    amount: '3000',
    details: 'Groceries',
    type: 'Expense',
    category: 'Food'
  });

  fireEvent.change(screen.getByPlaceholderText(/search here/i), {
    target: { value: 'transport' }
  });

  expect(screen.getByText('Matatu fare')).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByText('Groceries'));
});

test('transactions saved before categories existed still load', () => {
  // Shape written by an earlier version: no category field at all.
  window.localStorage.setItem(
    'expense-tracker:transactions',
    JSON.stringify([
      { id: 'legacy-1', amount: 5000, details: 'Old entry', transType: 'expense' }
    ])
  );

  render(<App />);

  expect(screen.getByText('Old entry')).toBeInTheDocument();
  expect(screen.getByText('Other')).toBeInTheDocument();
});

test('new transactions are grouped under Today', () => {
  render(<App />);

  addTransaction({ amount: '900', details: 'Breakfast', type: 'Expense' });

  expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument();
});

test('older transactions get their own day heading', () => {
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;

  window.localStorage.setItem(
    'expense-tracker:transactions',
    JSON.stringify([
      {
        id: 'a',
        amount: 500,
        details: 'Older entry',
        category: 'Food',
        transType: 'expense',
        createdAt: twoDaysAgo
      }
    ])
  );

  render(<App />);

  expect(screen.getByText('Older entry')).toBeInTheDocument();
  // Two days back is neither Today nor Yesterday, so it gets a date label.
  expect(screen.queryByRole('heading', { name: 'Today' })).not.toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Yesterday' })
  ).not.toBeInTheDocument();
});

test('undated transactions group under Earlier rather than being dated', () => {
  // Shape written before timestamps were recorded.
  window.localStorage.setItem(
    'expense-tracker:transactions',
    JSON.stringify([
      { id: 'legacy-1', amount: 5000, details: 'Old entry', transType: 'expense' }
    ])
  );

  render(<App />);

  expect(screen.getByText('Old entry')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Earlier' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Today' })).not.toBeInTheDocument();
});

test('a transaction can be edited', () => {
  render(<App />);

  addTransaction({
    amount: '1500',
    details: 'Lunhc',
    type: 'Expense',
    category: 'Food'
  });

  fireEvent.click(screen.getByRole('button', { name: /edit lunhc/i }));

  fireEvent.change(screen.getByLabelText('Edit details'), {
    target: { value: 'Lunch' }
  });
  fireEvent.change(screen.getByLabelText('Edit amount'), {
    target: { value: '1800' }
  });
  fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

  expect(screen.getByText('Lunch')).toBeInTheDocument();
  expect(screen.queryByText('Lunhc')).not.toBeInTheDocument();
  // The totals follow the edit.
  expect(screen.getByText('Ksh 1,800')).toBeInTheDocument();
});

test('cancelling an edit discards the changes', () => {
  render(<App />);

  addTransaction({
    amount: '1500',
    details: 'Lunch',
    type: 'Expense',
    category: 'Food'
  });

  fireEvent.click(screen.getByRole('button', { name: /edit lunch/i }));
  fireEvent.change(screen.getByLabelText('Edit details'), {
    target: { value: 'Something else' }
  });
  fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

  expect(screen.getByText('Lunch')).toBeInTheDocument();
  expect(screen.queryByText('Something else')).not.toBeInTheDocument();
});

test('an edited category can be changed to a custom one', () => {
  render(<App />);

  addTransaction({
    amount: '1500',
    details: 'Contribution',
    type: 'Expense',
    category: 'Other'
  });

  fireEvent.click(screen.getByRole('button', { name: /edit contribution/i }));
  fireEvent.change(screen.getByLabelText('Edit category'), {
    target: { value: '__custom__' }
  });
  fireEvent.change(screen.getByLabelText('Edit custom category'), {
    target: { value: 'Chama' }
  });
  fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

  expect(screen.getByText('Chama')).toBeInTheDocument();
});

test('edits survive a reload', () => {
  const { unmount } = render(<App />);

  addTransaction({
    amount: '1500',
    details: 'Lunch',
    type: 'Expense',
    category: 'Food'
  });

  fireEvent.click(screen.getByRole('button', { name: /edit lunch/i }));
  fireEvent.change(screen.getByLabelText('Edit amount'), {
    target: { value: '2400' }
  });
  fireEvent.click(screen.getByRole('button', { name: /^save$/i }));

  unmount();
  render(<App />);

  expect(screen.getByText(/^-Ksh 2,400$/)).toBeInTheDocument();
});

test('the theme toggle switches and persists the choice', () => {
  const { unmount } = render(<App />);

  // Default is light here: jsdom reports no dark system preference.
  const toDark = screen.getByRole('button', { name: /switch to dark theme/i });
  fireEvent.click(toDark);

  expect(
    screen.getByRole('button', { name: /switch to light theme/i })
  ).toBeInTheDocument();

  unmount();
  render(<App />);

  expect(
    screen.getByRole('button', { name: /switch to light theme/i })
  ).toBeInTheDocument();
});

test('transactions survive a reload', () => {
  const { unmount } = render(<App />);

  addTransaction({ amount: '3200', details: 'Rent', type: 'Expense' });
  unmount();

  render(<App />);
  // Only one transaction here, so no scoping is needed — and scoping to a
  // parent element couples the test to the row's internal markup.
  expect(screen.getByText('Rent')).toBeInTheDocument();
  expect(screen.getByText(/^-Ksh 3,200$/)).toBeInTheDocument();
});
