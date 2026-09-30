import { useEffect, useState } from 'react'
import { links, nav, footerLinks } from './content.js'
import { ArrowUpRight } from './icons.jsx'

export function Pill({ href, children, variant = 'dark', size, external = !href.startsWith('/'), ...rest }) {
  return (
    <a
      className={`pill pill-${variant}${size ? ` pill-${size}` : ''}`}
      href={href}
      data-magnetic
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
    >
      <span className="pill-text">{children}</span>
    </a>
  )
}

export function Header({ current }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const here = (item) => (item.label === current ? { 'aria-current': 'page' } : {})

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="header-bar">
        <a className="wordmark" href="/" aria-label="Ciright home">
          ciright
        </a>
        <nav className="main-nav" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.label}>
                <a href={item.href} {...here(item)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Pill href={links.demo} size="nav" {...(current === 'Contact' ? { 'aria-current': 'page' } : {})}>
          Contact
        </Pill>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-toggle-lines" aria-hidden="true" />
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <ul>
          {nav.map((item) => (
            <li key={item.label}>
              <a href={item.href} onClick={() => setOpen(false)} {...here(item)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-foot">
          <Pill href={links.demo} variant="light">
            Schedule a demo
          </Pill>
          <a className="text-link" href={links.login}>
            Log in to Ciright
          </a>
        </div>
      </div>
    </header>
  )
}

export function Closing({
  title = 'Ready to see right?',
  text = 'Tell us where your enterprise is today and what is getting in the way. Our sales team will walk you through the platform.',
  cta = 'Schedule a demo',
  long = false,
}) {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="closing-glow" aria-hidden="true" />
      <h2 id="closing-title" className={`closing-title${long ? ' is-long' : ''}`}>
        {title}
      </h2>
      <p className="closing-text">{text}</p>
      <Pill href={links.demo} variant="light">
        {cta}
      </Pill>
    </section>
  )
}

export function Footer() {
  const onCredits = location.pathname.replace(/\/$/, '') === '/credits'
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-contact">
          <a className="pill pill-outline" href={links.demo} data-magnetic>
            <span className="pill-text">Contact us</span>
          </a>
          <a className="pill pill-outline" href={links.login} data-magnetic>
            <span className="pill-text">Log in</span>
          </a>
        </div>
        <ul className="footer-links">
          {footerLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer-bottom">
        <div className="footer-legal">
          <a href="https://ciright.com/terms-of-service">Terms of Service</a>
          <a href="https://ciright.com/anti-spam">Anti-Spam Policy</a>
          <a href="/credits" {...(onCredits ? { 'aria-current': 'page' } : {})}>
            Image credits
          </a>
        </div>
        <span>© {new Date().getFullYear()} Ciright</span>
      </div>
    </footer>
  )
}

export function Cursor() {
  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor-tag">
        <span className="cursor-chip">
          <span className="cursor-arrow">
            <ArrowUpRight size={16} />
          </span>
          <span className="cursor-arrow is-next">
            <ArrowUpRight size={16} />
          </span>
        </span>
        <span className="cursor-label" />
      </span>
    </div>
  )
}
