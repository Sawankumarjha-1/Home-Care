"use client";
import React from "react";
import Logo from "../../public/HALogo.png";
import Link from "next/link";
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from "react-icons/bs";
import Image from "next/image";
import styles from "../app/page.module.css";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  return (
    pathname !== "/client/login" &&
    pathname !== "/worker/login" &&
    pathname !== "/client/signup" &&
    pathname !== "/worker/signup" &&
    pathname !== "/message/cancel" &&
    pathname !== "/message/success" && (
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerLeft}>
            <Image src={Logo} alt="logo" priority />
            <p>
              At Home Assist, we understand that managing your home can
              sometimes feel like a full-time job. From routine maintenance
              tasks to unexpected emergencies, there's always something
              demanding your attention. That's where we come in.
            </p>

            <h3>Address :</h3>
            <p> Home Assist Pvt.Ltd , Noida Sec - 82 , Uttarpradesh</p>
            <h3>Support Email :</h3>
            <p>support@homeassist.com</p>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.footerNavlinks}>
              <h3>Navlinks : </h3>
              <Link href={"/"}>Home</Link>
              <Link href={"/#services"}>Service</Link>

              <Link href="/access-account">Login</Link>
              <Link href={"/access-account/reg"}>Signup</Link>
              <Link href={"/#testimonials"}>Testimonial</Link>
              <Link href={"/find"}>Search Home Care</Link>
            </div>
            <div className={styles.footerSocial}>
              <h3>Social Icons : </h3>
              <Link href={"#"}>
                <BsFacebook size={30} className={styles.footerIcons} />
              </Link>
              <Link href={"#"}>
                <BsInstagram size={30} className={styles.footerIcons} />
              </Link>
              <Link href={"#"}>
                <BsLinkedin size={30} className={styles.footerIcons} />
              </Link>
              <Link href={"#"}>
                <BsTwitter size={30} className={styles.footerIcons} />
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            Copyright ©️ {new Date().getFullYear()} ALifeSaver, All right
            reserved @Design by Sawan Kumar Jha
          </p>
        </div>
      </div>
    )
  );
}

export default Footer;
