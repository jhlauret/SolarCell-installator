import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount React trees after every test so repeated renders don't leak DOM
// between cases (otherwise getByTestId finds duplicate nodes).
afterEach(() => {
  cleanup();
});
