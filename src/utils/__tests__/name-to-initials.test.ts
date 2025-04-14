import { nameToInitials } from '../name-to-initials';

describe('nameToInitials', () => {
  it('should return the initials of the given name and family name', () => {
    const result = nameToInitials('John', 'Doe');
    expect(result).toBe('JD');
  });

  it('should return the initials of the given name and family name with multiple parts', () => {
    const result = nameToInitials('John', 'Doe Smith');
    expect(result).toBe('JDS');
  });

  it('should return the initials of the given name and family name with multiple parts', () => {
    const result = nameToInitials('John', 'Doe Smith Johnson');
    expect(result).toBe('JDSJ');
  });

  it('should return an empty string for empty given name and family name', () => {
    const result = nameToInitials('', '');
    expect(result).toBe('');
  });
});
