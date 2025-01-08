import React from "react";
import Header from "../components/Header";
import HomeSection from "../components/HomeSection";
import AboutUsSection from "../components/AboutUsSection";
import ServicesSection from "../components/MyServicesSection";
import PricingSection from "../components/PricingSection";
import ContactUsSection from "../components/ContactUsSection";
import Footer from "../components/Footer";
const BlogAttenAi = () => {
    return (
        <div>
            <Header />
            <main style={{ marginTop: "100px" }}> {/* Offset for fixed header */}
                <HomeSection />
                <AboutUsSection />
                <ServicesSection />
                <PricingSection />
                <ContactUsSection />
                <Footer />
            </main>
        </div>
    );
};

export default BlogAttenAi;
