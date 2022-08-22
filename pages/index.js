import Head from 'next/head';
export default function Home() {
	return (
		<div>
			<Head>
				<title>{"Nimish Jain's Resume"}</title>
			</Head>
			<main>
				If it does not redirect,{' '}
				<a
					href={
						process.env.NEXT_PUBLIC_RESUME_LINK ||
						'https://drive.google.com/uc?export=view&id=1Tg31PggA8KJE4EIhHue5fIBz3qskzfgF'
					}
				>
					Click here!
				</a>
			</main>
		</div>
	);
}

export async function getStaticProps(context) {
	const date = new Date();
	console.log(
		'Resume fetched at',
		date.toLocaleString(),
		date.getTimezoneOffset()
	);
	return {
		redirect: {
			destination:
				process.env.RESUME_LINK ||
				'https://drive.google.com/uc?export=view&id=1Tg31PggA8KJE4EIhHue5fIBz3qskzfgF',
			permanent: false,
		},
	};
}
