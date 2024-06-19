"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Logo from "../../public/HALogo.png";
import Link from "next/link";
import styles from "../app/page.module.css";
import { usePathname } from "next/navigation";
import { VscSignOut } from "react-icons/vsc";
import { RxAvatar } from "react-icons/rx";

import axios, { isAxiosError } from "axios";
export default function Navbar() {
  const [credential, setCredential] = useState(false);
  const [role, setRole] = useState<string>("");

  const pathname = usePathname();
  const [scrollY, setScrollY] = useState(0);
  function removeCookie() {
    axios
      .get(`http://localhost:5000/api/v1/common/logout`, {
        withCredentials: true,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        alert(error);
      });
  }
  //For Monitoring scrollY to active the navlink
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollY]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/common`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setCredential(true);
          setRole(response.data.data.role);
        }
        if (response?.status === 401) {
          setCredential(false);
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          if (error?.response?.status === 401) {
            setCredential(false);
          }
        }
      });
  }, []);
  /**********************************************************/

  return (
    pathname !== "/client/login" &&
    pathname !== "/worker/login" &&
    pathname !== "/worker/signup" &&
    pathname !== "/client/signup" &&
    pathname !== "/message/cancel" &&
    pathname !== "/message/success" && (
      <main className={styles.webNavbar}>
        {/****************Laptop and Desktop view Navigation bar**************/}
        <div className={styles.navbar}>
          {/*Navbar Image Container*/}
          <div className={styles.navbarImageDiv}>
            <Image src={Logo} alt="Logo" className={styles.navbarImage} />
          </div>
          {/* All links*/}

          <ul>
            <Link
              href={"/"}
              className={`${styles.navbarLink} ${
                pathname == "/" && scrollY < 850 ? styles.activeLink : ""
              }`}
            >
              Home
            </Link>

            {credential == false ||
            (credential == true && role === "CLIENT") ? (
              <Link
                href={"/search"}
                className={`${styles.navbarLink} ${
                  pathname == "/search" && styles.activeLink
                }`}
              >
                Find
              </Link>
            ) : (
              <p></p>
            )}

            <Link
              href={"/#services"}
              className={`${styles.navbarLink} ${
                pathname == "/" && scrollY > 850 && scrollY < 1952
                  ? styles.activeLink
                  : ""
              }`}
            >
              Services
            </Link>
            <Link
              href={"/#testimonials"}
              className={`${styles.navbarLink} ${
                pathname == "/" && scrollY > 1952 ? styles.activeLink : ""
              }`}
            >
              Testimonal
            </Link>

            <span className={`${credential == true && styles.dNone}`}>
              <Link href="/access-account" className={styles.navbarBtn}>
                Login
              </Link>
              <Link href="/access-account/reg" className={styles.navbarBtn}>
                Signup
              </Link>
            </span>

            <Link
              href={"/profile"}
              className={`${styles.navbarLink} ${
                credential == false && styles.dNone
              }
                ${pathname == "/profile" && styles.activeLink}`}
            >
              <RxAvatar size={30} />
            </Link>
            <button
              className={`${styles.navbarLink} ${
                credential == false && styles.dNone
              }`}
              onClick={removeCookie}
            >
              <VscSignOut size={30} />
            </button>
          </ul>
        </div>
      </main>
    )
  );
}
