import { MongoClient } from 'mongodb';

export default function Logs({ logs }) {
	return (
		<div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
			<div className='flex flex-col'>
				<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
						<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Source
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Message
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Level
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Timestamp
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{logs.map((log) => (
										<tr key={log._id}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>
													{log.source || '-'}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>
													{log.message || '-'}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>
													{log.level || '-'}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>
													{log.time ||
														log.timestamp ||
														'-'}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	// MongoDB connection URI
	const uri = process.env.MONGO_URI;

	try {
		// Connect to the MongoDB cluster
		const client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		// Access the database
		const db = client.db('logs');

		// Access the logs collection
		const logsCollection = db.collection('logs');

		// Find all documents in the logs collection
		const logs = await logsCollection.find().toArray();

		// Close the MongoDB connection
		await client.close();

		// Return the logs as props
		return { props: { logs: JSON.parse(JSON.stringify(logs)) } };
	} catch (error) {
		// Handle errors
		console.log(error);
		return { props: { logs: [] } };
	}
}
