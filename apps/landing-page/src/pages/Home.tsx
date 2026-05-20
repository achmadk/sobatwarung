import Hero from "../components/Hero";
import KeagenanHierarchy from "../components/KeagenanHierarchy";
import Features from "../components/Features";
import MASOverview from "../components/MASOverview";
import DataSovereignty from "../components/DataSovereignty";
import Personas from "../components/Personas";
import CTA from "../components/CTA";
import useHashScroll from "../hooks/useHashScroll";

export default function Home() {
  useHashScroll();

  return (
    <>
      <Hero />
      <KeagenanHierarchy />
      <Features />
      <MASOverview />
      <DataSovereignty />
      <div className="bg-slate-50">
        <Personas />
      </div>
      <CTA />
    </>
  );
}
