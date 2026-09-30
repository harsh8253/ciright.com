import { useEffect } from 'react'
import { links, productFamilies, daikinCase } from './content.js'
import { ArrowUpRight } from './icons.jsx'
import { useCursor, useSiteMotion } from './motion.js'
import { Closing, Cursor, Footer, Header, Pill } from './shared.jsx'
import twinPill from '../assets/plates/video-pill.png'

function ProductsHero() {
  return (
    <section className="hero products-hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero-title">
        <span className="line">
          <span className="line-inner">The suite that</span>
        </span>
        <span className="line">
          <span className="line-inner">connects your</span>
        </span>
        <span className="line">
          <span className="line-inner">enterprise</span>
        </span>
      </h1>
      <div className="hero-row">
        <p className="hero-lede">
          Applications and managed services that turn manufacturers, reps, machines and customers into one seamless
          digital enterprise, deployed on premises or in any cloud.
        </p>
        <div className="hero-cta">
          <Pill href={links.demo}>
            Schedule a demo <ArrowUpRight />
          </Pill>
        </div>
      </div>
      <nav className="family-index" aria-label="Jump to a product family">
        <ul>
          {productFamilies.map((f) => (
            <li key={f.id}>
              <a className="pill family-pill" href={`#${f.id}`}>
                <span className="pill-text">{f.short}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}

function FamilyMedia({ media }) {
  const twin = media.src === 'twin'
  return (
    <div className={`family-media${twin ? ' is-twin' : ` is-${media.kind}`}`}>
      <img
        src={twin ? twinPill : media.src}
        alt={media.alt}
        loading="lazy"
        style={media.position ? { objectPosition: media.position } : undefined}
        {...(twin ? { width: 1302, height: 424 } : {})}
      />
    </div>
  )
}

function LeadWords({ text }) {
  const words = text.split(' ')
  return words.map((w, i) => (
    <span key={i}>
      <span className="lead-word">
        <span>{w}</span>
      </span>
      {i < words.length - 1 ? ' ' : null}
    </span>
  ))
}

function Family({ family }) {
  return (
    <section className="suite" id={family.id} aria-labelledby={`${family.id}-title`}>
      <h2 id={`${family.id}-title`} className="suite-name">
        <LeadWords text={family.name} />
      </h2>
      <div className="suite-intro">
        <p className="suite-lead">{family.lead}</p>
        <div className="suite-aside">
          <p className="suite-body">{family.body}</p>
          <Pill href={links.demo}>
            Ask about {family.short} <ArrowUpRight />
          </Pill>
        </div>
      </div>
      {family.media && <FamilyMedia media={family.media} />}
      <ul className="product-list">
        {family.products.map((p) => (
          <li className="product" key={p.name}>
            <span className="product-rule" aria-hidden="true" />
            <h3 className="product-name">
              <span className="product-name-inner">{p.name}</span>
            </h3>
            <p className="product-text">
              {p.tag && <span className="product-tag">{p.tag}</span>}
              {p.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Suite() {
  return (
    <div className="suites">
      {productFamilies.map((f) => (
        <Family family={f} key={f.id} />
      ))}
    </div>
  )
}

function Proof() {
  return (
    <section className="case proof" aria-labelledby="proof-title">
      <div className="case-head">
        <h2 id="proof-title" className="case-title" data-reveal>
          One core took Daikin Applied’s forecast from <s className="case-from">30 days</s> to{' '}
          <span className="case-to">9–12 months</span>.
        </h2>
        <p className="case-text" data-reveal>
          Daikin Applied Systems deployed the Ciright Monolithic Core, the same connection engine behind every family
          above, to give its factory sight of the projects its field sales teams were chasing.
        </p>
      </div>
      <ul className="component-list">
        {daikinCase.map((c) => (
          <li key={c.name} className="component-row">
            <span className="component-name">{c.name}</span>
            <span className="component-text">{c.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function ProductsPage() {
  useEffect(() => {
    document.title = 'Products | Ciright'
  }, [])
  useSiteMotion()
  useCursor()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current="Products" />
      <main id="main">
        <ProductsHero />
        <Suite />
        <Proof />
        <div className="night">
          <Closing />
          <Footer />
        </div>
      </main>
      <Cursor />
    </>
  )
}
