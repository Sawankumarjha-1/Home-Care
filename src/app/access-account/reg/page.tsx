"use client";
import React from "react";
import styles from "../../../app/access-account.module.css";
import Link from "next/link";
import LoginSignupScreen from "@/components/LoginSignupScreen";
import LoginSignupScreen2 from "@/components/LoginSignupScreen2";
import IsLogin from "@/utils/IsLogin";
import { redirect } from "next/navigation";

export default function page() {
  const login = IsLogin();
  if (login) redirect("/");
  return (
    <main className={styles.accessMainContainer}>
      <LoginSignupScreen
        data={{
          btnText: "Signup",
          typeLink: "/client/signup",
          altLink: "#",
          content:
            "Homeassist Sense offers a range of services tailored to meet the diverse homecare needs of individuals and families. From eldercare to childcare and beyond, we provide comprehensive solutions to support you in every aspect of home management.",
          mainHeading: "For",
          subHeading: "Home Care Recuriter",
        }}
      />
      <LoginSignupScreen2
        data={{
          btnText: "Signup",
          typeLink: "/worker/signup",
          altLink: "/worker/login",
          content:
            "Homeassist Sense offers a range of services tailored to meet the diverse homecare needs of individuals and families. From eldercare to childcare and beyond, we provide comprehensive solutions to support you in every aspect of home management.",
          mainHeading: "For",
          subHeading: "Home Care Worker",
        }}
      />
    </main>
  );
}
