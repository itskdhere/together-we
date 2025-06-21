import { createCivicAuthPlugin } from "@civic/auth/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.CIVIC_AUTH_CLIENT_ID!,
  loginUrl: "/signin",
  loginSuccessUrl: "/callback",
  exclude: ["/", "/signup"],
});

export default withCivicAuth(nextConfig);
