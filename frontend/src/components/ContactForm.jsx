import { useState } from 'react'
import { sendContactMessage } from '../services/contactService'
import { CheckCircle, XCircle, Send } from 'lucide-react'

export default function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // { ok: bool, msg: string }
  const [loading, setLoading] = useState(false)

  const emailRe = /^[\w.-]+@[\w.-]+\.\w+$/

  async function handleSubmit() {
    const { name, email, message } = fields
    if (!name || !email || !message) {
      setStatus({ ok: false, msg: 'Please fill in all fields.' })
      return
    }
    if (!emailRe.test(email)) {
      setStatus({ ok: false, msg: 'Please enter a valid email address.' })
      return
    }

    setLoading(true)
    setStatus(null)
    try {
      await sendContactMessage(name, email, message)
      setStatus({ ok: true, msg: "Message sent successfully! We'll get back to you soon." })
      setFields({ name: '', email: '', message: '' })
    } catch {
      setStatus({ ok: false, msg: 'Failed to send message. Please try again later.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '520px', margin: '14px auto 0' }}>
      <input
        className="contact-input"
        placeholder="Your Name"
        value={fields.name}
        onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
      />
      <input
        className="contact-input"
        placeholder="Your Email"
        value={fields.email}
        onChange={e => setFields(f => ({ ...f, email: e.target.value }))}
      />
      <textarea
        className="contact-textarea"
        placeholder="Your Message"
        value={fields.message}
        onChange={e => setFields(f => ({ ...f, message: e.target.value }))}
      />
      <button
        className="contact-button"
        onClick={handleSubmit}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Send size={14} />
          {loading ? 'Sending...' : 'Send Message'}
        </span>
      </button>

      {status && (
        <div
          style={{
            marginTop: '12px',
            fontWeight: 600,
            textAlign: 'center',
            color: status.ok ? '#22c55e' : '#ff4d4d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {status.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {status.msg}
        </div>
      )}
    </div>
  )
}
