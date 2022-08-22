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

export async function getServerSideProps(context) {
	const date = new Date();
	console.log({
		time: date.toLocaleString("en-IN", {timeZone: 'Asia/Kolkata'}),
		source: context.query.src || 'Unknown',
		allQueryParams: { ...context.query },
	});
	return {
		redirect: {
			destination:
				process.env.RESUME_LINK ||
				'https://drive.google.com/uc?export=view&id=1Tg31PggA8KJE4EIhHue5fIBz3qskzfgF',
			permanent: false,
		},
		props: {},
	};
}
