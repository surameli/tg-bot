// Check if a value is empty
export function isNotEmpty(value) {
  return value && value.trim().length > 0;
}
export function isValidFullName(name) {
    const words = name.trim().split(/\s+/);

    return words.length >= 2 &&
           words.every(word => word.length >= 2);
}
// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate Ethiopian phone numbers
export function isValidPhone(phone) {
  const phoneRegex = /^(09\d{8}|\+2519\d{8})$/;
  return phoneRegex.test(phone);
}

// Validate positive numbers
export function isPositiveNumber(value) {
  return !isNaN(value) && Number(value) >= 0;
}

// Validate password (min 8 chars, at least one letter and one number)
export function isValidPassword(password) {
  return password.length >= 8 &&
         /[a-zA-Z]/.test(password) &&
         /[0-9]/.test(password);
}