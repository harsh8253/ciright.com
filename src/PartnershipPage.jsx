import { useEffect } from 'react'
import { engineParts, links, sourceDigitalCase, territories } from './content.js'
import { ArrowUpRight } from './icons.jsx'
import { useCursor, useSiteMotion } from './motion.js'
import { Closing, Cursor, Footer, Header, Pill } from './shared.jsx'

function PartnerHero() {
  return (
    <section className="hero partner-hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero-title">
        <span className="line">
          <span className="line-inner">Fuel your</span>
        </span>
        <span className="line">
          <span className="line-inner">imagination</span>
        </span>
        <span className="line">
          <span className="line-inner">engine</span>
        </span>
      </h1>
      <div className="hero-row">
        <p className="hero-lede">
          Together we develop, build, market and launch. You bring the idea; Ciright brings decades of experience, an
          open enterprise platform, and carries the risk with you.
        </p>
        <div className="hero-cta">
          <Pill href={links.demo}>
            Start a partnership <ArrowUpRight />
          </Pill>
        </div>
      </div>
    </section>
  )
}

function Territories() {
  return (
    <section className="territories" id="territories" aria-labelledby="territories-title">
      <div className="territories-head">
        <h2 id="territories-title" className="territories-title" data-reveal>
          Five territories. One engine.
        </h2>
        <nav className="family-index" aria-label="Jump to a territory">
          <ul>
            {territories.map((t) => (
              <li key={t.id}>
                <a className="pill family-pill" href={`#t-${t.id}`}>
                  <span className="pill-text">{t.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="territories-engine">
        <p className="territories-engine-lead">Wherever you build, Ciright brings</p>
        <ul className="territories-parts">
          {engineParts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Territory({ t, flip }) {
  return (
    <section className={`territory${flip ? ' is-flip' : ''}`} id={`t-${t.id}`} aria-labelledby={`t-${t.id}-name`}>
      <a className="territory-media" href={t.proof.href} data-cursor="View">
        <img src={t.proof.image} alt={t.proof.alt} loading="lazy" />
        <span className="territory-proof">
          <span className="territory-proof-name">Built here: {t.proof.name}</span>
          <span className="territory-proof-line">{t.proof.line}</span>
        </span>
        <span className="explore-chip" aria-hidden="true">
          <ArrowUpRight size={12} />
        </span>
      </a>
      <div className="territory-copy">
        <h2 id={`t-${t.id}-name`} className="territory-name" data-reveal>
          {t.name}
        </h2>
        <dl className="territory-ledger">
          <div className="territory-row">
            <dt>You bring</dt>
            <dd>{t.you}</dd>
          </div>
          <div className="territory-row">
            <dt>Ciright brings</dt>
            <dd>{t.we}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function Engine() {
  return (
    <section className="engine" aria-labelledby="engine-title">
      <h2 id="engine-title" className="engine-title">
        <span className="engine-verb">Develop.</span> <span className="engine-verb">Build.</span>{' '}
        <span className="engine-verb">Market.</span> <span className="engine-verb">Launch.</span>
      </h2>
      <p className="engine-lede">
        Your imagination is the fuel. Ciright’s proven process, structure and technology become the engine.
      </p>
      <div className="engine-cols">
        <div className="engine-col">
          <h3 className="engine-col-title">Ideas in less time, for less capital</h3>
          <p>
            With decades of experience and an open enterprise platform, new ideas go live in reduced time frames and at
            lower capital cost. Ciright has embraced the risks so you can focus on realizing your vision.
          </p>
        </div>
        <div className="engine-col">
          <h3 className="engine-col-title">Your success, our mission</h3>
          <p>
            True collaboration with companies and entrepreneurs, backed by Ciright’s intellectual property, to deliver
            superior products faster. Everyone in their right seat on the bus, and success a shared journey.
          </p>
        </div>
      </div>
    </section>
  )
}

function SourceDigitalCase() {
  return (
    <section className="case proof partner-case" id="case" aria-labelledby="case-title">
      <div className="case-head">
        <h2 id="case-title" className="case-title" data-reveal>
          Source Digital turned video into <span className="case-to">media’s new currency</span>.
        </h2>
        <p className="case-text" data-reveal>
          A SaaS platform for content owners and brands that layers personalized, dynamic calls to action in and around
          the content, so viewers can learn, explore and buy without leaving it.
        </p>
      </div>
      <ul className="component-list">
        {sourceDigitalCase.map((c) => (
          <li key={c.name} className="component-row">
            <span className="component-name">{c.name}</span>
            <span className="component-text">{c.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function PartnershipPage() {
  useEffect(() => {
    document.title = 'Partnership | Ciright'
  }, [])
  useSiteMotion()
  useCursor()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current="Partnership" />
      <main id="main">
        <PartnerHero />
        <Territories />
        {territories.map((t, i) => (
          <Territory t={t} flip={i % 2 === 1} key={t.id} />
        ))}
        <Engine />
        <SourceDigitalCase />
        <div className="night">
          <Closing
            title="Join the partnership revolution."
            text="Contact us to start a structured conversation about accelerating your roadmap, with shared execution, clear milestones and technology you can build on."
            cta="Start a partnership"
            long
          />
          <Footer />
        </div>
      </main>
      <Cursor />
    </>
  )
}
