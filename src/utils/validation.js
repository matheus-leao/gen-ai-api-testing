export function requireFields(body, fields) {
  const missingFields = fields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  return null;
}
