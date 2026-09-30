import { useEffect } from 'react'
import { useCursor, useSiteMotion } from './motion.js'
import { Cursor, Footer, Header } from './shared.jsx'

const groups = [
  {
    page: 'Home and Products',
    href: '/',
    text: 'Photography via Wikimedia Commons: “Woman Learning Design in Virtual Reality” (CC BY 2.0), “A large crowd enjoys a music concert” (CC BY 2.0), “Philadelphia Night Skyline” (CC BY-SA 4.0). Product renders are illustrative.',
  },
  {
    page: 'Brands',
    href: '/brands',
    text: 'Photography via Wikimedia Commons, tinted and cropped: “Talkline SIM card” by Raimond Spekking (CC BY-SA 4.0), “Mobile Payment” by Richard Tanzer Fotografie / VeroPay (CC BY-SA 3.0), “A large crowd enjoys a music concert” (CC BY 2.0), “A ZKT-ECO fingerprint scanner in Guangzhou” by 中少 (CC BY-SA 4.0), “Audience at Access to Arts Conference Chandigarh” by Benipal hardarshan (CC BY-SA 4.0), “A woman sits at a desk with her laptop” by Shixart1985 (CC BY 2.0), “Eastern Side of 7th Avenue in Times Square” by Julian Lupyan (CC0). The CyberONE render is illustrative.',
  },
  {
    page: 'Partnership',
    href: '/partnership',
    text: 'Photography via Wikimedia Commons, tinted and cropped: “A large crowd enjoys a music concert” (CC BY 2.0), “Eastern Side of 7th Avenue in Times Square” by Julian Lupyan (CC0), “A woman sits at a desk with her laptop” by Shixart1985 (CC BY 2.0). Platform and card renders are illustrative.',
  },
  {
    page: 'Company',
    href: '/company',
    text: 'Press photographs belong to the outlets credited with each story, as featured on ciright.com. Podium photograph: Metro Philadelphia. Portal at night: 6abc Action News.',
  },
  {
    page: 'Contact',
    href: '/contact',
    text: 'Map drawn from OpenStreetMap data, © OpenStreetMap contributors, available under the Open Database Licence.',
  },
]

export default function CreditsPage() {
  useEffect(() => {
    document.title = 'Image credits | Ciright'
  }, [])
  useSiteMotion()
  useCursor()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="hero contact-hero" aria-labelledby="hero-title">
          <h1 id="hero-title" className="hero-title">
            <span className="line">
              <span className="line-inner">Image credits</span>
            </span>
          </h1>
          <div className="hero-row">
            <p className="hero-lede">
              The photographs, renders and map used across this site, and the licences they are shared under.
            </p>
          </div>
        </section>
        <section className="credits" aria-label="Credits by page">
          <ol className="credits-list">
            {groups.map((g) => (
              <li key={g.page} className="credits-row">
                <h2 className="credits-page">
                  <a href={g.href}>{g.page}</a>
                </h2>
                <p className="credits-text">{g.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <div className="night">
          <Footer />
        </div>
      </main>
      <Cursor />
    </>
  )
}
