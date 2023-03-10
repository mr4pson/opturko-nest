import fetch from 'node-fetch';

export const fetchJson = async (url) => {
  const response = await fetch(url);

  return response.json();
};
