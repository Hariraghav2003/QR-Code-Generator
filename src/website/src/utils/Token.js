const SERVICE = import.meta.env.VITE_QR_API_ENDPOINT;
let cachedToken = null;

export async function getServiceToken() {
  if (cachedToken) return cachedToken;

  const res = await fetch(`${SERVICE}/authservice/service-token`);
  if (!res.ok) throw new Error("Failed to fetch service token");

  const { token } = await res.json();
  cachedToken = token;
  return token;
}
