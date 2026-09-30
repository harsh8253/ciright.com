import { useState } from 'react'
import {
  links,
  stats,
  solutions,
  components,
  featuredBrand,
  moreBrands,
  trust,
  results,
  faqs,
} from './content.js'
import { ArrowUpRight, Plus } from './icons.jsx'
import { useCursor, useSiteMotion } from './motion.js'
import { Closing, Cursor, Footer, Header, Pill } from './shared.jsx'
import twinPill from '../assets/plates/video-pill.png'

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero-title">
        <span className="line">
          <span className="line-inner">
            Connect
            <span className="twin-pill" aria-hidden="true">
              <img
                src={twinPill}
                alt=""
                width="1302"
                height="424"
              />
            </span>
          </span>
        </span>
        <span className="line">
          <span className="line-inner">and transform</span>
        </span>
        <span className="line">
          <span className="line-inner">your business</span>
        </span>
      </h1>
      <div className="hero-reel" aria-hidden="true">
        <div className="hero-reel-frame">
          <img src={twinPill} alt="" width="1302" height="424" />
        </div>
      </div>
      <div className="hero-row">
        <p className="hero-label">25+ years · Philadelphia</p>
        <p className="hero-lede">
          Ciright Core connects sales, reps, ERP, IoT and digital twins into one digital enterprise. Cloud, hybrid or
          on premises.
        </p>
        <div className="hero-cta">
          <Pill href={links.demo}>
            Schedule a demo <ArrowUpRight />
          </Pill>
        </div>
      </div>
      <dl className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Solutions() {
  return (
    <section className="solutions" id="solutions" aria-label="Solutions">
      {solutions.map((s, i) => (
        <article className="stack-card" key={s.title} style={{ '--i': i }}>
          <div className="stack-card-inner">
            <div className="stack-rings" aria-hidden="true" />
            <div className="stack-copy">
              <h2 className="stack-title">{s.title}</h2>
              <p className="stack-lead">{s.lead}</p>
              <p className="stack-body">{s.body}</p>
              <a className="explore" href={s.href} data-cursor="Explore">
                {s.cta}
                <span className="explore-chip" aria-hidden="true">
                  <ArrowUpRight size={12} />
                </span>
              </a>
            </div>
            <span className="stack-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div
              className={
                s.photo === 'backdrop' ? 'stack-media is-backdrop' : s.photo ? 'stack-media is-photo' : 'stack-media'
              }
            >
              <img src={s.image} alt={s.alt} loading="lazy" />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

function Platform() {
  return (
    <section className="platform" id="platform" aria-labelledby="platform-title">
      <div className="split">
        <h2 id="platform-title" className="split-text" data-reveal>
          Ciright’s core platform is the connection engine for all things digital. Six components share one data model,
          so a change made in one department is known to every other.
        </h2>
      </div>
      <ul className="component-list">
        {components.map((c) => (
          <li key={c.name} className="component-row">
            <span className="component-name">{c.name}</span>
            <span className="component-text">{c.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Brands() {
  return (
    <section className="work" id="brands" aria-labelledby="brands-title">
      <div className="work-inner">
        <h2 id="brands-title" className="work-title" data-reveal>
          Brands built on Ciright
        </h2>
        <div className="work-grid">
          <a className="work-card" href={featuredBrand.href} data-cursor="View">
            <div className="work-media">
              <img src={featuredBrand.image} alt={featuredBrand.alt} loading="lazy" />
            </div>
            <h3 className="work-name">{featuredBrand.name}</h3>
            <p className="work-line">{featuredBrand.line}</p>
          </a>
          <ul className="brand-rows">
            {moreBrands.map((b) => (
              <li key={b.name}>
                <a href="/brands" className="brand-row">
                  <span className="brand-name">{b.name}</span>
                  <span className="brand-line">{b.line}</span>
                  <span className="brand-arrow" aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Trust() {
  return (
    <section className="trust" id="secure-access" aria-labelledby="trust-title">
      <h2 id="trust-title" className="trust-title">
        <span className="line">Trust,</span>
        <span className="line">
          <span className="trust-pill" aria-hidden="true">
            <img src="/images/secure-card.jpg" alt="" loading="lazy" />
          </span>
          built in.
        </span>
      </h2>
      <p className="trust-lede" data-reveal>
        Two Ciright brands guard the identities behind every login and every transaction.
      </p>
      <div className="trust-grid">
        {trust.map((t) => (
          <a className="trust-card" key={t.name} href={t.href} target="_blank" rel="noreferrer" data-cursor="Visit site">
            <div className="trust-media">
              <img src={t.image} alt={t.alt} loading="lazy" />
            </div>
            <h3 className="trust-name">{t.name}</h3>
            <p className="trust-line">{t.line}</p>
            <span className="explore">
              {t.cta}
              <span className="explore-chip" aria-hidden="true">
                <ArrowUpRight size={12} />
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

function CaseStudy() {
  return (
    <section className="case" aria-labelledby="case-title">
      <div className="case-head">
        <h2 id="case-title" className="case-title" data-reveal>
          Daikin Applied’s forecast went from <s className="case-from">30 days</s> to{' '}
          <span className="case-to">9–12 months</span>.
        </h2>
        <p className="case-text" data-reveal>
          Daikin Applied Systems deployed the Ciright Monolithic Core to connect TriState HVAC’s field sales office with
          its enterprise environment, and turned project data nobody could see into a forecast the factory can plan
          around.
        </p>
      </div>
      <div className="results-deck">
        {results.map((r) => (
          <article className={`result-card tone-${r.tone}`} key={r.title}>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Ink({ text }) {
  const words = text.split(' ')
  return words.map((w, i) => (
    <span key={i}>
      <span className="ink-word">{w}</span>
      {i < words.length - 1 ? ' ' : null}
    </span>
  ))
}

function Why() {
  return (
    <section className="why" aria-labelledby="why-title">
      <div className="split split-ruled">
        <span className="why-rule" aria-hidden="true" />
        <h2 id="why-title" className="split-text" data-ink>
          <Ink text="For over 25 years Ciright has led technology from mobile computing to spatial computing and AI. We deploy enterprise systems globally, from sales force automation to AI-powered analytics, and build them to adapt and scale across industries." />
        </h2>
      </div>
      <figure className="quote">
        <div className="quote-portrait">
          <img
            src="/images/news-podium.jpg"
            alt="Joe Callahan, CEO of Ciright, speaking at the Philadelphia Portal in LOVE Park"
            width="1400"
            height="934"
            loading="lazy"
          />
        </div>
        <blockquote data-ink>
          <span className="quote-mark">“</span>
          <Ink text="When you have passion, vision, drive and inspiration, you have the foundation for a team that’s destined to win… Add in an engaging environment and a lifetime of experiences with some Philadelphia grit and you have Ciright.”" />
        </blockquote>
        <figcaption>
          <strong>Joe Callahan</strong> CEO, Ciright
        </figcaption>
      </figure>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="faq-title">
        FAQ
      </h2>
      <div className="faq-list">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div className={`faq-item${isOpen ? ' is-open' : ''}`} key={f.q}>
              <h3>
                <button
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  id={`faq-q-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <Plus />
                </button>
              </h3>
              <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                <div className="faq-a-inner">
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function App() {
  useSiteMotion()
  useCursor()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Solutions />
        <Platform />
        <Brands />
        <Trust />
        <CaseStudy />
        <Why />
        <div className="night">
          <Faq />
          <Closing />
          <Footer />
        </div>
      </main>
      <Cursor />
    </>
  )
}
