import Head from 'next/head';
export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>{"Nimish Jain's Resume"}</title>
			</Head>
			<main>
				If it does not redirect,{' '}
				<a href='https://drive.google.com/uc?export=view&id=1Tg31PggA8KJE4EIhHue5fIBz3qskzfgF'>
					Click here!
				</a>
			</main>
		</div>
	);
}
