import React from "react";
import styles from "../app/page.module.css";
import Image from "next/image";
import Chef from "../../public/chef.png";
import Maid from "../../public/cleaning-lady.png";
import Nanny from "../../public/mother.png";
import Driver from "../../public/driver.png";
import OldCare from "../../public/nursing-home.png";
import Gardner from "../../public/gardening.png";

function Services() {
  const service = [
    {
      id: "0",
      image: OldCare,
      serviceName: "Old Care Service",
      content:
        "Our old care service is dedicated to providing compassionate and attentive care for seniors, ensuring their comfort, safety, and well-being.",
    },
    {
      id: "1",
      image: Maid,
      serviceName: "Maid Service",
      content:
        "Our maid service offers experienced and reliable professionals who will take care of your household chores efficiently, leaving your home spotless and organized.",
    },
    {
      id: "2",
      image: Gardner,
      serviceName: "Gardener Service",
      content:
        "Our gardener service provides skilled professionals who will maintain your garden, ensuring it remains beautiful and healthy throughout the year.",
    },
    {
      id: "3",
      image: Driver,
      serviceName: "Driver Service",
      content:
        "Our driver service offers safe and punctual transportation to your desired destinations, whether it's for work, errands, or leisure.",
    },
    {
      id: "4",
      image: Nanny,
      serviceName: "Baby Service",
      content:
        "Our nanny service provides nurturing and trustworthy caregivers who will ensure the well-being and happiness of your children in your absence.",
    },
    {
      id: "5",
      image: Chef,
      serviceName: "Chef Service",
      content:
        "Our chef service delivers culinary expertise right to your kitchen, offering delicious and personalized meals crafted to your preferences.",
    },
  ];

  return (
    <div className={styles.serviceContainer} id="services">
      {service.map((data, index) => {
        return (
          <div
            className={styles.individualServiceContianer}
            key={"Service" + data.id}
          >
            <Image src={data.image} alt="Not Found" />
            <br></br>
            <b>{data.serviceName}</b>
            <p>{data.content.substring(0, 100)}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Services;
