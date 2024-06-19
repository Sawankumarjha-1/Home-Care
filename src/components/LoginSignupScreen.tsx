import Link from "next/link";
import React from "react";
import styles from "../../src/app/access-account.module.css";
type dataTy = {
  btnText: string;
  typeLink: string;
  altLink: string;
  content: string;
  mainHeading: string;
  subHeading: string;
};
export default function LoginSignupScreen({ data }: { data: dataTy }) {
  return (
    <div className={styles.accessHiring}>
      <h1>
        {data.mainHeading} <span>{data.subHeading}</span>
      </h1>
      <p>{data.content}</p>
      <Link href={data.typeLink} className={styles.accessLoginBtn}>
        {data.btnText}
      </Link>
      {data.btnText == "Login" && (
        <p>
          Don't have account ? <Link href={data.altLink}>Signup</Link>
        </p>
      )}
      {data.btnText == "Signup" && (
        <p>
          Already Registered ? <Link href={data.altLink}>Login</Link>
        </p>
      )}
    </div>
  );
}
