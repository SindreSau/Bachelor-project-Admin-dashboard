export const nameToInitials = (givenName: string, familyName: string): string => {
  const givenNameInitial = givenName.charAt(0).toUpperCase();
  const familyNameParts = familyName.split(' ');
  const familyNameInitial = familyNameParts.map((part) => part.charAt(0).toUpperCase()).join('');

  return `${givenNameInitial}${familyNameInitial}`;
};
