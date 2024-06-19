import styles from "./page.module.css";
import SocialIcons from "@/components/SocialIcons";
import HeroSection from "@/components/HeroSection";
import Services from "@/components/Services";
import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <SocialIcons />
      <h1 className={styles.heading}>
        Our <span>Services</span>
      </h1>
      <Services />
      <h1 className={styles.heading}>
        Our <span>Testimonial</span>
      </h1>
      <Testimonial />
    </main>
  );
}
