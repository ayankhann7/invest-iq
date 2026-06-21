const BASE_URL = "http://localhost:5000"

export async function sendContactMessage(name, email, message) {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}