// src/utils/formatters.js

export function formatStatus(status) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function formatDate (dateString)  {
  return new Date(dateString).toLocaleString()
}