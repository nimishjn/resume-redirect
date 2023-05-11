import Head from 'next/head';
import { MongoClient } from 'mongodb';
import { dateFormatter } from '../utils/dateFormatter';

export default function Home() {
	return (
		<div>
			<Head>
				<title>{"Nimish Jain's Resume"}</title>
			</Head>
			<main>
				If it does not redirect, <a href='/api/getPDF'>Click here!</a>
			</main>
		</div>
	);
}

export async function getServerSideProps(context) {
	const date = new Date();

	const log = {
		source: context.query.src || 'Unknown',
		level: 'info',
		time: dateFormatter(date),
		timestamp: date,
		allQueryParams: { ...context.query },
	};

	try {
		// Connect to the MongoDB cluster
		const client = await MongoClient.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		// Access the database
		const db = client.db('logs');

		// Access the logs collection
		const logsCollection = db.collection('logs');

		// Insert the JSON object into the logs collection
		await logsCollection.insertOne(log);

		// Close the MongoDB connection
		await client.close();
	} catch (error) {
		// Handle errors
		console.error(error);
	}

	return {
		redirect: {
			destination: '/api/getPDF',
			permanent: false,
		},
		props: {},
	};
}
