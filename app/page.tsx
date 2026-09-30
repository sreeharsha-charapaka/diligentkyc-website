import { Navbar } from "@/components/navigation/Navbar";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import CDDSection from "@/components/CDDSection";
import DomainTiles from "@/components/sections/DomainTiles";
import AiScrollExperience from "@/components/sections/AiScrollExperience";
export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <VideoSection />
         <CDDSection />
        <DomainTiles />
        <AiScrollExperience />
      </main>
    </>
  );
}
