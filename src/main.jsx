import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geologica'
import './styles.css'
import App from './App.jsx'
import ProductsPage from './ProductsPage.jsx'
import BrandsPage from './BrandsPage.jsx'
import PartnershipPage from './PartnershipPage.jsx'
import CompanyPage from './CompanyPage.jsx'
import ContactPage from './ContactPage.jsx'
import CreditsPage from './CreditsPage.jsx'

const routes = {
  '/credits': CreditsPage,
  '/products': ProductsPage,
  '/brands': BrandsPage,
  '/partnership': PartnershipPage,
  '/company': CompanyPage,
  '/contact': ContactPage,
}
const Page = routes[location.pathname.replace(/\/$/, '')] || App

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
