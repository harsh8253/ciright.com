import { useEffect } from 'react'
import { beyondPortal, hisWords, links, portalLegs } from './content.js'
import { ArrowUpRight } from './icons.jsx'
import { useCursor, useSiteMotion } from './motion.js'
import { Closing, Cursor, Footer, Header, Pill } from './shared.jsx'

const credits =
  'Press photographs belong to the outlets credited with each story, as featured on ciright.com. Podium photograph: Metro Philadelphia. Portal at night: 6abc Action News.'

function Source({ outlet, date, medium }) {
  return (
    <span className="press-source">
      <span className="press-outlet">{outlet}</span>
      <time>{date}</time>
      {medium ? <span>{medium}</span> : null}
    </span>
  )
}

function CompanyHero() {
  return (
    <section className="hero company-hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero-title">
        <span className="line">
          <span className="line-inner">Ciright,</span>
        </span>
        <span className="line">
          <span className="line-inner">on the record</span>
        </span>
      </h1>
      <div className="hero-row">
        <p className="hero-lede">
          For over 25 years Ciright has led technology from mobile computing to spatial computing and AI, from
          Philadelphia. Here is what the press has written about our work, our CEO Joe Callahan and the Portals
          project.
        </p>
        <div className="hero-cta">
          <Pill href={links.demo}>
            Talk to Ciright <ArrowUpRight />
          </Pill>
        </div>
      </div>
      <figure className="podium">
        <div className="podium-frame">
          <img
            src="/images/news-podium.jpg"
            alt="Joe Callahan speaking at a podium in front of the Portal sculpture in LOVE Park"
            width="1400"
            height="934"
          />
        </div>
        <figcaption>Joe Callahan, CEO, at the Philadelphia Portal in LOVE Park.</figcaption>
      </figure>
    </section>
  )
}

function InHisWords() {
  const [lead, ...side] = hisWords
  return (
    <section className="words" aria-labelledby="words-title">
      <h2 id="words-title" className="press-heading" data-reveal>
        In his words
      </h2>
      <div className="words-grid">
        <a className="press press-lead" href={lead.href} target="_blank" rel="noreferrer">
          <span className="press-media" data-cursor="Read">
            <img src={lead.image} alt={lead.alt} loading="lazy" />
          </span>
          <h3 className="press-title">{lead.title}</h3>
          <p className="press-text">{lead.text}</p>
          <Source {...lead} />
        </a>
        <div className="words-side">
          {side.map((s) => (
            <a
              className={`press${s.image ? '' : ' is-audio'}`}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              key={s.href}
            >
              {s.image ? (
                <span className="press-media" data-cursor="Watch">
                  <img src={s.image} alt={s.alt} loading="lazy" />
                </span>
              ) : null}
              <h3 className="press-title">{s.title}</h3>
              {s.text ? <p className="press-text">{s.text}</p> : null}
              <Source {...s} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Portal() {
  return (
    <section className="portal" aria-labelledby="portal-title">
      <div className="portal-head">
        <h2 id="portal-title" className="portal-title" data-reveal>
          The Portal
        </h2>
        <p className="portal-lede">
          Portals.org’s livestream sculptures let strangers in different cities see each other in real time, and Joe
          Callahan is a core team member. The Portal opened between New York and Dublin in May 2024, then moved to LOVE
          Park that October, linking Philadelphia with Dublin, Vilnius and Lublin.
        </p>
      </div>
      <figure className="portal-step">
        <img
          src="/images/news-portal-night.jpg"
          alt="The Portal sculpture glowing white at night in LOVE Park, Philadelphia"
          width="1280"
          height="576"
          loading="lazy"
        />
      </figure>
      {portalLegs.map((leg, i) => {
        const lead = leg.stories.find((s) => s.featured) || leg.stories[0]
        const rest = leg.stories.filter((s) => s !== lead)
        return (
          <div className={i % 2 ? 'leg leg--flip' : 'leg'} key={leg.id}>
            <div className="leg-head">
              <h3 className="leg-place" data-reveal>
                {leg.place}
              </h3>
              <p className="leg-when">
                {leg.when} · {leg.stories.length} {leg.stories.length === 1 ? 'story' : 'stories'}
              </p>
            </div>
            <a className="leg-lead" href={lead.href} target="_blank" rel="noreferrer" data-own-hover>
              <span className="leg-lead-media" data-cursor="Read">
                <img
                  src={lead.image}
                  alt=""
                  loading="lazy"
                  style={lead.position ? { objectPosition: lead.position } : undefined}
                />
              </span>
              <span className="leg-lead-copy">
                <span className="leg-lead-title">{lead.title}</span>
                {lead.text ? <span className="leg-lead-text">{lead.text}</span> : null}
                <Source {...lead} />
                <span className="explore">
                  Read the story
                  <span className="explore-chip" aria-hidden="true">
                    <ArrowUpRight size={12} />
                  </span>
                </span>
              </span>
            </a>
            {rest.length ? (
              <ul className="leg-grid">
                {rest.map((s) => (
                  <li key={s.href}>
                    <a className="leg-card" href={s.href} target="_blank" rel="noreferrer">
                      <span className="leg-card-media" data-cursor="Read">
                        <img
                          src={s.image}
                          alt=""
                          loading="lazy"
                          style={s.position ? { objectPosition: s.position } : undefined}
                        />
                      </span>
                      <span className="leg-card-title">{s.title}</span>
                      <Source {...s} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </section>
  )
}

function BeyondPortal() {
  return (
    <section className="beyond" aria-labelledby="beyond-title">
      <h2 id="beyond-title" className="press-heading" data-reveal>
        Beyond the Portal
      </h2>
      <div className="beyond-grid">
        {beyondPortal.map((s) => (
          <a className="press" href={s.href} target="_blank" rel="noreferrer" key={s.href}>
            <span className="press-media" data-cursor="Read">
              <img src={s.image} alt={s.alt} loading="lazy" />
            </span>
            <h3 className="press-title">{s.title}</h3>
            <p className="press-text">{s.text}</p>
            <Source {...s} />
          </a>
        ))}
      </div>
    </section>
  )
}

export default function CompanyPage() {
  useEffect(() => {
    document.title = 'Company | Ciright'
  }, [])
  useSiteMotion()
  useCursor()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current="Company" />
      <main id="main">
        <CompanyHero />
        <InHisWords />
        <Portal />
        <BeyondPortal />
        <div className="night">
          <Closing
            title="Talk to Ciright."
            text="Whether you are writing about us, partnering with us or choosing a platform, start the conversation here."
            cta="Talk to Ciright"
          />
          <Footer credits={credits} />
        </div>
      </main>
      <Cursor />
    </>
  )
}
