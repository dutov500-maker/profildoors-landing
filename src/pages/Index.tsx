import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LeadDialog from "@/components/LeadDialog";
import CalcDialog from "@/components/CalcDialog";
import Catalog from "@/components/Catalog";
import Showroom from "@/components/Showroom";
import Factory from "@/components/Factory";
import WhyUs from "@/components/WhyUs";
import Designers from "@/components/Designers";
import Contacts from "@/components/Contacts";
import Footer from "@/components/Footer";
import FloatingMessenger from "@/components/FloatingMessenger";

const Index = () => {
  return (
    <div className="min-h-screen bg-card text-foreground">
      <Header />
      <Hero />
      <Showroom />
      <Factory />
      <Catalog />
      <WhyUs />
      <Designers />
      <Contacts />
      <Footer />
      <FloatingMessenger />
      <LeadDialog />
      <CalcDialog />
    </div>
  );
};

export default Index;
