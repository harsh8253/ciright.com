import { useEffect } from 'react'
import { links, productFamilies, daikinCase } from './content.js'
import { ArrowUpRight } from './icons.jsx'
import { useCursor, useSiteMotion } from './motion.js'
import { Closing, Cursor, Footer, Header, Pill } from './shared.jsx'
import twinPill from '../assets/plates/video-pill.png'

const num = (i) => String(i + 1).padStart(2, '0')

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

function Panel({ family }) {
  const grid = !!family.cols
  return (
    <article
      className={`suite-panel${family.media ? '' : ' is-catalog'}`}
      id={family.id}
      aria-labelledby={`${family.id}-title`}
    >
      <div className="suite-copy" data-part>
        <h2 id={`${family.id}-title`} className="suite-name">
          {family.name}
        </h2>
        <p className="suite-lead">
          <LeadWords text={family.lead} />
        </p>
        <p className="suite-body">{family.body}</p>
      </div>
      <div className="suite-side" data-part>
        {family.media && <FamilyMedia media={family.media} />}
        <ul className={`product-list${grid ? ' is-grid' : ''}`} style={grid ? { '--cols': family.cols } : undefined}>
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
      </div>
    </article>
  )
}

function Suite() {
  return (
    <section className="suite" aria-label="Product families">
      <div className="suite-track">
        <div className="suite-room">
          <div className="suite-glow" aria-hidden="true" />
          <div className="stack-rings" aria-hidden="true" />
          <nav className="suite-index" aria-label="Product family index">
            <span className="suite-rail" aria-hidden="true">
              <span className="suite-rail-fill" />
            </span>
            <ol>
              {productFamilies.map((f, i) => (
                <li key={f.id}>
                  <a href={`#${f.id}`} className={i === 0 ? 'is-active' : undefined} data-own-hover>
                    {f.short}
                  </a>
                </li>
              ))}
            </ol>
            <p className="suite-count" aria-hidden="true">
              <span className="count-window">
                <span className="count-reel">
                  {productFamilies.map((f, i) => (
                    <span key={f.id}>{num(i)}</span>
                  ))}
                </span>
              </span>
              <span className="count-total">/ {num(productFamilies.length - 1)}</span>
            </p>
          </nav>
          <div className="suite-stage">
            {productFamilies.map((f) => (
              <Panel family={f} key={f.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
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
