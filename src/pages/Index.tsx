import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LeadDialog from "@/components/LeadDialog";
import Catalog from "@/components/Catalog";
import WhyUs from "@/components/WhyUs";
import Designers from "@/components/Designers";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Catalog />
      <WhyUs />
      <Designers />
      <Contacts />
      <Footer />
      <FloatingWhatsApp />
      <LeadDialog />
    </div>
  );
};

export default Index;
