import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import Offers from "@/components/home/Offers";
import StoreBenefits from "@/components/home/StoreBenefits";
import DeliveryOptions from "@/components/home/DeliveryOptions";
import Navbar from "@/components/home/Navbar";

export default function Home() {
  return (
    <main id="home" className="min-h-screen bg-[#f8fbf8]">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Offers />
      <StoreBenefits />
      <DeliveryOptions />
    </main>
  );
}