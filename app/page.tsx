import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import CDDSection from "@/components/CDDSection";
import DomainTiles from "@/components/sections/DomainTiles";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <VideoSection />
         <CDDSection />
        <DomainTiles />
      </main>

      <Footer />
    </>
  );
}
