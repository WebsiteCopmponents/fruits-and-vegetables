import Hero from "@/components/home/HomeHero";
import HomeExploreCategories from "@/components/home/HomeExploreCategories";
import HomeHotItem from "@/components/home/HomeHotItem";
import HomeProductSpotlight from "@/components/home/HomeProductSpotlight";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeFaqs from "@/components/home/HomeFaqs";
import HomeHelpContact from "@/components/home/HomeHelpContact";
import HomeReviews from "@/components/home/HomeReviews";
import HomeStoreLocation from "@/components/home/HomeStoreLocation";
import HomeBlogs from "@/components/home/HomeBlogs";
import HomeStoryCarousel from "@/components/home/HomeStoryCarousel";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <Hero />
      <HomeExploreCategories />
      <HomeStoryCarousel />
      <HomeHotItem />
      <HomeProductSpotlight />
      <HomeFeatures />
      <HomeReviews />
      <HomeStoreLocation />
      <HomeBlogs />
      <HomeFaqs />
      <HomeHelpContact />
    </main>
  );
}
