import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import api from './api';

// The app fetches products and checks the admin session on mount; stub both so
// the tests do not depend on a running backend.
jest.mock('./api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
  getErrorMessage: () => 'error',
  API_BASE_URL: 'http://localhost:5000',
}));

const PRODUCT = { id: 'p1', name: 'Bed Bug Spray', price: 2500, status: 'active' };

beforeEach(() => {
  window.localStorage.clear();
  api.get.mockReset();
  api.get.mockImplementation((url) => {
    if (url === '/products') {
      return Promise.resolve({ data: [PRODUCT] });
    }
    // /admin/check-auth: not authenticated by default.
    return Promise.reject({ response: { status: 401 } });
  });
});

/** Render and let the mount-time requests settle, so no state update escapes act(). */
const renderApp = async () => {
  const result = render(<App />);
  await waitFor(() => expect(api.get).toHaveBeenCalledWith('/products'));
  await screen.findByRole('heading', { level: 2, name: /featured products/i });
  return result;
};

test('renders the storefront header', async () => {
  await renderApp();
  expect(screen.getByRole('heading', { level: 1, name: 'Ebshops' })).toBeInTheDocument();
});

test('renders products returned by the API', async () => {
  await renderApp();
  expect(await screen.findByText(PRODUCT.name)).toBeInTheDocument();
  // Price is formatted for display, not rendered raw.
  expect(screen.getByText('₦2500.00')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add to cart/i })).toBeEnabled();
});

test('starts with an empty cart count', async () => {
  await renderApp();
  expect(screen.getByText('0')).toBeInTheDocument();
});

test('shows a message when the product list is empty', async () => {
  api.get.mockImplementation((url) =>
    url === '/products'
      ? Promise.resolve({ data: [] })
      : Promise.reject({ response: { status: 401 } })
  );
  await renderApp();
  expect(screen.getByText(/no products available right now/i)).toBeInTheDocument();
});

test('surfaces an error when the product request fails', async () => {
  api.get.mockImplementation(() => Promise.reject({ request: {} }));
  render(<App />);
  expect(await screen.findByText(/could not load products/i)).toBeInTheDocument();
});
