//
//
import { nameToInitials } from '../name-to-initials';

describe('nameToInitials', () => {
  it('should return the initials of the given name and family name', () => {
    // Arrange
    const givenName = 'John';
    const familyName = 'Doe';
    // Act
    const result = nameToInitials(givenName, familyName);
    // Assert
    expect(result).toBe('JD');
  });

  it('should return the initials of the given name and family name with multiple parts', () => {
    // Arrange
    const givenName = 'John';
    const familyName = 'Doe Smith';
    // Act
    const result = nameToInitials(givenName, familyName);
    // Assert
    expect(result).toBe('JDS');
  });

  it('should return the initials of the given name and family name with multiple parts', () => {
    // Arrange
    const givenName = 'John';
    const familyName = 'Doe Smith Johnson';
    // Act
    const result = nameToInitials(givenName, familyName);
    // Assert
    expect(result).toBe('JDSJ');
  });

  it('should return an empty string for empty given name and family name', () => {
    // Arrange
    const givenName = '';
    const familyName = '';
    // Act
    const result = nameToInitials(givenName, familyName);
    // Assert
    expect(result).toBe('');
  });
});
