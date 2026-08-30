import Hero from "@/components/home/HomeHero";
import HomeExploreCategories from "@/components/home/HomeExploreCategories";
import HomeHotItem from "@/components/home/HomeHotItem";
import HomeProductSpotlight from "@/components/home/HomeProductSpotlight";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeFaqs from "@/components/home/HomeFaqs";
import HomeHelpContact from "@/components/home/HomeHelpContact";
import HomeReviews from "@/components/home/HomeReviews";
import HomeBlogs from "@/components/home/HomeBlogs";
import HomeStoryCarousel from "@/components/home/HomeStoryCarousel";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      {/* Sits above the fixed hero and scrolls over it */}
      <div className="relative z-10 bg-white">
        <HomeExploreCategories />
        <HomeStoryCarousel />
        <HomeHotItem />
        <HomeProductSpotlight />
        <HomeFeatures />
        <HomeReviews />
        <HomeBlogs />
        <HomeFaqs />
        <HomeHelpContact />
      </div>
    </main>
  );
}
