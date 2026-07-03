export function notFoundMiddleware(request, response) {
  response.status(404).json({ error: 'Route not found' });
}

export function errorMiddleware(error, request, response, next) {
  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  next(error);
}
