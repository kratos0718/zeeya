import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import FinancialAI from '../components/FinancialAI'
import InsuranceAdvisor from '../components/InsuranceAdvisor'
import TripPlanner from '../components/TripPlanner'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function Page() {
  return (
    <main className="bg-bg">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <FinancialAI />
      <InsuranceAdvisor />
      <TripPlanner />
      <CTA />
      <Footer />
    </main>
  )
}
