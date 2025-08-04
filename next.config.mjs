/** @type {import('next').NextConfig} */
const nextConfig = {

    eslint : {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false, 
    serverExternalPackages :['pdf-parse'],
    
};

export default nextConfig;
