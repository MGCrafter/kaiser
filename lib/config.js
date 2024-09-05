// Directus API URL
export const DIRECTUS_URL = "https://directus-1.nekozdevteam.eu";

// Datenmodelle
export const MODELS = {
  HEADER: "Header_Kaiser",
  LINKS: "Links_Kaiser",
  WELCOME: "Welcome_Kaiser",
  IMPRESSUM: "impressum_kaiser",
  BILDERGALERIE: "Bildergalerie",};
export async function directusLogin(email, password) {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('directus_token', data.data.access_token);
  return data;
}