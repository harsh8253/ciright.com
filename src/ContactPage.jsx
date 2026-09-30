import { useEffect, useRef, useState } from 'react'
import { contactSubjects, headquarters, links } from './content.js'
import { hqMap } from './hqMap.js'
import { ArrowUpRight } from './icons.jsx'
import { useCursor, useSiteMotion } from './motion.js'
import { Cursor, Footer, Header } from './shared.jsx'

const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT

const fields = {
  name: { label: 'Your name', hint: 'your name', autoComplete: 'name' },
  company: { label: 'Your company', hint: 'your company', autoComplete: 'organization' },
  email: { label: 'Your email', hint: 'you@company.com', type: 'email', autoComplete: 'email', inputMode: 'email' },
  phone: { label: 'Your phone', hint: 'phone number', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
}

const empty = { name: '', company: '', email: '', phone: '', message: '' }

function check(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!values.company.trim()) errors.company = 'Enter your company, or “Independent” if you work for yourself.'
  if (!values.email.trim()) errors.email = 'Enter your email so the team can reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    errors.email = 'Check your email address, for example name@company.com.'
  const digits = values.phone.replace(/\D/g, '')
  if (!values.phone.trim()) errors.phone = 'Enter a phone number the team can reach you on.'
  else if (digits.length < 7) errors.phone = 'Check the phone number; it needs at least 7 digits.'
  if (!values.message.trim()) errors.message = 'Tell us what you would like to talk about.'
  return errors
}

function ContactHero() {
  return (
    <section className="hero contact-hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero-title">
        <span className="line">
          <span className="line-inner">Let’s connect.</span>
        </span>
      </h1>
      <div className="hero-row">
        <p className="hero-lede">
          Tell us who you are and what you are working on. Pick what it is about so your message reaches the right
          people at Ciright.
        </p>
      </div>
    </section>
  )
}

function Desk() {
  const [values, setValues] = useState(empty)
  const [subject, setSubject] = useState('general')
  const [errors, setErrors] = useState({})
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState('idle')
  const [sentTo, setSentTo] = useState(null)
  const formRef = useRef(null)
  const doneRef = useRef(null)

  const chosen = contactSubjects.find((s) => s.id === subject)
  const sending = status === 'sending'

  useEffect(() => {
    if (sentTo) doneRef.current?.focus()
  }, [sentTo])

  const update = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    if (tried) setErrors(check(next))
    if (status === 'error' || status === 'unconnected') setStatus('idle')
  }

  const submit = async (e) => {
    e.preventDefault()
    setTried(true)
    const found = check(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current.querySelector(`[name="${first}"]`)?.focus()
      return
    }
    if (!endpoint) {
      setStatus('unconnected')
      return
    }
    setStatus('sending')
    const timeout = new AbortController()
    const timer = setTimeout(() => timeout.abort(), 15000)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, subject: chosen.value }),
        signal: timeout.signal,
      })
      if (!res.ok) throw new Error(String(res.status))
      setSentTo({ name: values.name.trim().split(/\s+/)[0], email: values.email.trim() })
      setStatus('sent')
    } catch {
      setStatus('error')
    } finally {
      clearTimeout(timer)
    }
  }

  const reset = () => {
    setValues(empty)
    setSubject('general')
    setErrors({})
    setTried(false)
    setSentTo(null)
    setStatus('idle')
  }

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange: update,
    required: true,
    disabled: sending,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  })

  const blank = (name) => {
    const f = fields[name]
    return (
      <span className={`blank${errors[name] ? ' is-invalid' : ''}`} data-fill={values[name] || f.hint}>
        <label className="visually-hidden" htmlFor={`contact-${name}`}>
          {f.label}
        </label>
        <input
          type={f.type || 'text'}
          autoComplete={f.autoComplete}
          inputMode={f.inputMode}
          placeholder={f.hint}
          size={1}
          {...fieldProps(name)}
        />
      </span>
    )
  }

  const lineErrors = ['name', 'company', 'email', 'phone'].filter((name) => errors[name])

  return (
    <section className="desk" aria-labelledby="desk-title" data-reveal>
      <h2 id="desk-title" className="visually-hidden">
        Send Ciright a message
      </h2>
      {sentTo ? (
        <div className="desk-done" ref={doneRef} tabIndex={-1}>
          <p className="desk-done-title">Thanks, {sentTo.name}.</p>
          <p className="desk-done-text">
            Your message has been sent to Ciright. Replies go to <strong>{sentTo.email}</strong>.
          </p>
          <button type="button" className="pill pill-dark" onClick={reset} data-magnetic>
            <span className="pill-text">Send another message</span>
          </button>
        </div>
      ) : (
        <form ref={formRef} className="desk-form" onSubmit={submit} noValidate aria-busy={sending}>
          <div className="letter">
            <p className="letter-line">
              Hi Ciright, I’m {blank('name')} from {blank('company')}.
            </p>
            <fieldset className="subjects letter-line" disabled={sending}>
              <legend className="visually-hidden">What is it about?</legend>
              <span className="subjects-lead" aria-hidden="true">
                I’d like to talk about
              </span>
              {contactSubjects.map((s) => (
                <label key={s.id} className="subject-pill" data-magnetic>
                  <input
                    type="radio"
                    name="subject"
                    value={s.id}
                    checked={subject === s.id}
                    onChange={() => setSubject(s.id)}
                  />
                  <span className="pill">
                    <span className="pill-text">{s.label}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="letter-line">
              You can reach me at {blank('email')} or on {blank('phone')}.
            </p>
            {lineErrors.length ? (
              <ul className="letter-errors">
                {lineErrors.map((name) => (
                  <li key={name} id={`contact-${name}-error`}>
                    {errors[name]}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className={`letter-message${errors.message ? ' is-invalid' : ''}`}>
              <label className="letter-line" htmlFor="contact-message">
                Here is what I have in mind:
              </label>
              <textarea
                rows={3}
                placeholder="A few lines about your project, your timeline or your question."
                {...fieldProps('message')}
              />
              {errors.message ? (
                <p id="contact-message-error" className="letter-error">
                  {errors.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="desk-foot">
            <button type="submit" className="pill pill-dark desk-send" disabled={sending} data-magnetic>
              <span className="pill-text">
                <span className="send-label" key={sending ? 'sending' : chosen.id}>
                  {sending ? 'Sending…' : chosen.send}
                </span>
                <ArrowUpRight />
              </span>
            </button>
            <div className="desk-status" role="status" aria-live="polite">
              {status === 'unconnected' ? (
                <p>
                  This form is not connected to Ciright’s inbox yet, so nothing was sent. Your details are still here;
                  for now, please use{' '}
                  <a href={links.legacyContact} target="_blank" rel="noreferrer">
                    contactus.ciright.com
                  </a>
                  .
                </p>
              ) : null}
              {status === 'error' ? (
                <p>
                  Your message did not send, so Ciright has not received it. Your details are still here; try again, or
                  use{' '}
                  <a href={links.legacyContact} target="_blank" rel="noreferrer">
                    contactus.ciright.com
                  </a>
                  .
                </p>
              ) : null}
              {tried && Object.keys(errors).length && status === 'idle' ? (
                <p>
                  {Object.keys(errors).length === 1
                    ? 'One field needs attention.'
                    : `${Object.keys(errors).length} fields need attention.`}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      )}
    </section>
  )
}

function HqMap() {
  const { width, height, pin, layers, labels } = hqMap
  return (
    <figure className="hq-map">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-labelledby="hq-map-title"
      >
        <title id="hq-map-title">
          Street map of West Philadelphia and Center City, with Ciright’s headquarters marked at 3025 JFK Boulevard,
          next to 30th Street Station and west of the Schuylkill River.
        </title>
        <rect className="m-ground" width={width} height={height} />
        <path className="m-park" d={layers.park} />
        <path className="m-water" d={layers.water} />
        <path className="m-minor" d={layers.minor} />
        <path className="m-mid" d={layers.mid} />
        <path className="m-major" d={layers.major} />
        <path className="m-rail" d={layers.rail} />
        <g className="m-labels" aria-hidden="true">
          {labels.jfk ? (
            <text x={labels.jfk[0]} y={labels.jfk[1] - 16} textAnchor="middle">
              JFK Blvd
            </text>
          ) : null}
          {labels.market ? (
            <text x={labels.market[0]} y={labels.market[1] - 16} textAnchor="middle">
              Market St
            </text>
          ) : null}
          <text className="m-label-station" x={pin[0] + 120} y={pin[1] + 180} textAnchor="end">
            30th Street Station
          </text>
          {labels.river ? (
            <text
              className="m-label-river"
              textAnchor="middle"
              dominantBaseline="central"
              transform={`translate(${labels.river[0]} ${labels.river[1]}) rotate(${labels.river[2] < -90 ? labels.river[2] + 180 : labels.river[2]})`}
            >
              Schuylkill River
            </text>
          ) : null}
        </g>
        <g className="hq-pin" transform={`translate(${pin[0]} ${pin[1]})`} aria-hidden="true">
          <circle className="hq-pin-ring" r="74" />
          <circle className="hq-pin-dot" r="17" />
          <text className="hq-pin-label" x="-96" y="10" textAnchor="end">
            Ciright
          </text>
        </g>
      </svg>
    </figure>
  )
}

function Headquarters() {
  return (
    <section className="hq" aria-labelledby="hq-title">
      <div className="hq-copy">
        <h2 id="hq-title" className="hq-title" data-reveal>
          {headquarters.street}
        </h2>
        <p className="hq-address">
          {headquarters.company}
          <br />
          {headquarters.city}
        </p>
        <p className="hq-note">Corporate headquarters, next to 30th Street Station.</p>
        <a className="explore" href={headquarters.directions} target="_blank" rel="noreferrer">
          Get directions
          <span className="explore-chip" aria-hidden="true">
            <ArrowUpRight size={12} />
          </span>
        </a>
      </div>
      <HqMap />
    </section>
  )
}

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact | Ciright'
  }, [])
  useSiteMotion()
  useCursor()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current="Contact" />
      <main id="main">
        <ContactHero />
        <Desk />
        <Headquarters />
        <div className="night">
          <Footer />
        </div>
      </main>
      <Cursor />
    </>
  )
}
