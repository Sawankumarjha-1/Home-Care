"use client";
import { useCookies } from "next-client-cookies";
export default function IsLogin() {
  const cookie = useCookies();
  const accessToken = cookie.get("accessToken");
  const refreshToken = cookie.get("refreshToken");

  if (accessToken && refreshToken) return true;
  return false;
}
