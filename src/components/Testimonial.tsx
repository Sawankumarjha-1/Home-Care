"use client";
import Image from "next/image";
import test1 from "../../public/test1.png";
import test2 from "../../public/test2.jpg";
import { useEffect, useState } from "react";
import styles from "../app/page.module.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
export default function Testimonial() {
  const images = [
    {
      id: "1",
      src: test1,
      name: "John Doe",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.",
    },
    {
      id: "2",
      src: test2,
      name: "Jane Smith",
      content:
        "Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(id);
  }, [currentIndex]);

  return (
    <div>
      <div className={styles.carousel}>
        <button onClick={handlePrev} className={styles.carouselBtn}>
          <FaAngleLeft size={20} />
        </button>
        <div className={styles.individualFeedback} id="testimonials">
          <Image
            src={images[currentIndex]?.src}
            alt={"Image" + currentIndex}
            width={100}
            height={100}
          />
          <b>{images[currentIndex]?.name}</b>
          <p>{images[currentIndex]?.content}</p>
        </div>
        <button onClick={handleNext} className={styles.carouselBtn}>
          <FaAngleRight size={20} />
        </button>
      </div>
    </div>
  );
}
