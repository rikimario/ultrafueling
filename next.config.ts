// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     domains: ["lh3.googleusercontent.com"],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "svzirwqbkbfofdxhblhg.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
