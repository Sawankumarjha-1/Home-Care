import Link from "next/link";
import React from "react";
import {
  BsInstagram,
  BsLinkedin,
  BsPhoneFlip,
  BsWhatsapp,
  BsX,
} from "react-icons/bs";
import styles from "../app/page.module.css";
import { CiPhone } from "react-icons/ci";
function SocialIcons() {
  return (
    <div className={styles.staticSocialIconsContainer}>
      <Link href="#">
        <BsLinkedin size={30} className={styles.linkedin} />
      </Link>
      <Link href="#">
        <BsWhatsapp size={30} className={styles.whatsapp} />
      </Link>
      <Link href="#">
        <CiPhone size={30} className={styles.phone} />
      </Link>
      <Link href="#">
        <BsInstagram size={30} className={styles.instagram} />
      </Link>
    </div>
  );
}

export default SocialIcons;
