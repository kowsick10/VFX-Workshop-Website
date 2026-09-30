import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import OfferBanner from "./components/OfferBanner";
import FunnelHero from "./components/FunnelHero";
import LearnTogether from "./components/LearnTogether";
import Programs from "./components/Programs";
import Journey from "./components/Journey";
import WhyChooseUs from "./components/WhyChooseUs";
import Gallery from "./components/Gallery";
import RegistrationForm from "./components/RegistrationForm";
import SuccessExperience from "./components/SuccessExperience";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import StickyBookBar from "./components/StickyBookBar";
import MarqueeStrip from "./components/MarqueeStrip";
import { scrollToSection } from "./utils/motion";

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("ai-video-creation");
  const [confirmedRegistration, setConfirmedRegistration] = useState(null);

  const scrollToRegistration = () => scrollToSection("registration");
  const scrollToPrograms = () => scrollToSection("programs");

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    scrollToRegistration();
  };

  return (
    <React.Fragment>
      <Preloader onFinish={() => setIntroDone(true)} />

      <Navbar onRegisterClick={scrollToRegistration} />

      <main>
        {confirmedRegistration ? (
          /* ---------- Post-payment confirmation replaces the landing flow ---------- */
          <SuccessExperience registration={confirmedRegistration} />
        ) : (
          <React.Fragment>
            {/* ---------- Chitti-style conversion funnel ---------- */}
            <div className="offer-float">
              <OfferBanner />
            </div>
            <FunnelHero onBookNow={scrollToRegistration} />

            <LearnTogether />

            {/* ---------- Existing deep-dive sections ---------- */}
            <Hero
              onExplorePrograms={scrollToPrograms}
              onRegisterNow={scrollToRegistration}
            />

            <Programs onSelectCourse={handleSelectCourse} />

            <MarqueeStrip />

            <Journey />

            <WhyChooseUs />

            <Gallery />

            <RegistrationForm
              selectedCourseId={selectedCourseId}
              onRegistrationSuccess={(reg) => {
                setConfirmedRegistration(reg);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            <FAQ />
          </React.Fragment>
        )}
      </main>

      <Footer onRegisterClick={scrollToRegistration} />

      {/* Mobile sticky book bar */}
      <div className="sticky-book-bar-desktop-hide">
        <StickyBookBar
          show={introDone && !confirmedRegistration}
          onClick={scrollToRegistration}
        />
      </div>
    </React.Fragment>
  );
}
