/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	async redirects() {
		return [
			{
				source: '/',
				destination:
					'https://drive.google.com/uc?export=view&id=1Tg31PggA8KJE4EIhHue5fIBz3qskzfgF',
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
