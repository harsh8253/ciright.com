import { useEffect } from 'react'
import { brands } from './content.js'
import { ArrowUpRight } from './icons.jsx'
import { useCursor, useSiteMotion } from './motion.js'
import { Closing, Cursor, Footer, Header, Pill } from './shared.jsx'

const partnership = '/partnership'
const num = (i) => String(i + 1).padStart(2, '0')
function BrandsHero() {
  return (
    <section className="hero brands-hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero-title">
        <span className="line">
          <span className="line-inner">Eight brands</span>
        </span>
        <span className="line">
          <span className="line-inner">built on</span>
        </span>
        <span className="line">
          <span className="line-inner">Ciright</span>
        </span>
      </h1>
      <div className="hero-row">
        <p className="hero-lede">
          From the trust layer of the internet to a virtual festival that drew 4.36 million people, these are the
          products and brands built on the Ciright platform.
        </p>
        <div className="hero-cta">
          <Pill href={partnership} external={false}>
            Partner with us <ArrowUpRight />
          </Pill>
        </div>
      </div>
    </section>
  )
}

function Poster({ brand }) {
  const { image, figure } = brand
  return (
    <article className="poster" id={brand.id} aria-labelledby={`${brand.id}-name`}>
      <div className="poster-media">
        <img src={image.src} alt={image.alt} loading="lazy" style={{ objectPosition: image.position }} />
      </div>
      <h2 id={`${brand.id}-name`} className="poster-name">
        {brand.name}
      </h2>
      <div className="poster-foot">
        {figure && (
          <p className="poster-figure">
            <span className="poster-figure-value">
              <span data-count={figure.value}>{figure.value.toFixed(2)}</span>
              {figure.unit}
            </span>
            <span className="poster-figure-text">{figure.text}</span>
          </p>
        )}
        <p className="poster-line">{brand.line}</p>
        <p className="poster-body">{brand.body}</p>
        {brand.href && (
          <a className="explore" href={brand.href} target="_blank" rel="noreferrer" data-own-hover>
            {brand.cta}
            <span className="explore-chip" aria-hidden="true">
              <ArrowUpRight size={12} />
            </span>
          </a>
        )}
      </div>
    </article>
  )
}

function Reel() {
  return (
    <section className="reel" aria-label="Ciright brands">
      <div className="reel-track">
        <div className="reel-pin">
          <div className="reel-strip">
            {brands.map((b) => (
              <Poster brand={b} key={b.id} />
            ))}
            <article className="poster is-next" aria-labelledby="next-name">
              <h2 id="next-name" className="poster-name">
                Your brand, next.
              </h2>
              <div className="poster-foot">
                <p className="poster-body">
                  Technology Equity Partnership: together we develop, build, market and launch, with Ciright’s open
                  enterprise platform and proven process as your engine.
                </p>
                <Pill href={partnership} external={false}>
                  Start a partnership <ArrowUpRight />
                </Pill>
              </div>
            </article>
          </div>
          <div className="reel-foot" aria-hidden="true">
            <p className="reel-count">
              <span className="count-window">
                <span className="count-reel">
                  {brands.map((b, i) => (
                    <span key={b.id}>{num(i)}</span>
                  ))}
                </span>
              </span>
              <span className="count-total">/ {num(brands.length - 1)}</span>
            </p>
            <span className="reel-progress">
              <span className="reel-progress-fill" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function BrandsPage() {
  useEffect(() => {
    document.title = 'Brands | Ciright'
  }, [])
  useSiteMotion()
  useCursor()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header current="Brands" />
      <main id="main">
        <BrandsHero />
        <Reel />
        <div className="night">
          <Closing />
          <Footer />
        </div>
      </main>
      <Cursor />
    </>
  )
}
