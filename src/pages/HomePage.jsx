import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import PromoSection from "../components/home/PromoSection";
import ExploreProducts from "../components/home/ExploreProducts";
import DidYouKnowSection from "../components/home/DidYouKnowSection";
import EcoCertificationSection from "../components/home/EcoCertificationSection";

export default function HomePage({
    ASSET_CONFIG,
    handleTabChange,
    openProductDetail,
    setCurrentTab,

    user,
    triggerToast,
    setShowLoginModal,
    handleAddToCart,
    setIsCartOpen,
    setPromoDiscount,
    liveProducts,
    productsLoading,
}) {
  return (
    <>
      <HeroSection
        ASSET_CONFIG={ASSET_CONFIG}
        handleTabChange={handleTabChange}
      />

      <FeaturesSection />

      <PromoSection
    ASSET_CONFIG={ASSET_CONFIG}

    user={user}
    triggerToast={triggerToast}
    setShowLoginModal={setShowLoginModal}
    handleAddToCart={handleAddToCart}
    setIsCartOpen={setIsCartOpen}
    setPromoDiscount={setPromoDiscount}
/>

      <ExploreProducts
        products={liveProducts}
        productsLoading={productsLoading}
        openProductDetail={openProductDetail}
        handleTabChange={handleTabChange}
      />

      <DidYouKnowSection
          setCurrentTab={setCurrentTab}
      />

      <EcoCertificationSection />

      {/* nanti di bawahnya */}
      {/* PromoSection */}
      {/* ProductGrid */}
      {/* Testimonial */}
      {/* FAQ */}
    </>
  );
}