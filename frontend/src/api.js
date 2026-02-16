// Centralized API base URL configuration
// In development: set VITE_API_URL=http://localhost:8000 in .env
// In production: leave empty (same origin, backend serves frontend)
const API_BASE = import.meta.env.VITE_API_URL || '';

export default API_BASE;
