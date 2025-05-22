import '@testing-library/jest-dom';

// Silence console.error and console.warn during tests
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
