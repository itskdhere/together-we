import type { NextConfig } from "next";
import { createCivicAuthPlugin } from "@civic/auth/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.CIVIC_AUTH_CLIENT_ID!,
  loginUrl: "/signin",
  loginSuccessUrl: "/callback",
  logoutUrl: "/",
});

export default withCivicAuth(nextConfig);
