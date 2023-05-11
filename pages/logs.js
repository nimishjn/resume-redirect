import { MongoClient } from 'mongodb';
import { useState } from 'react';

export default function Logs({ logs }) {
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
	};

	const filteredLogs = logs.filter((log) => {
		if (!log.source || !log.time) return true;
		const nameMatches = log.source
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const timestampMatches = log.time
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		return nameMatches || timestampMatches;
	});

	return (
		<div className='min-w-full mx-auto py-6 sm:px-6 lg:px-8'>
			<div className='flex flex-col'>
				<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
						<div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
							<div className='flex flex-col mb-4'>
								<div className='w-full md:w-1/3 mb-4 md:mb-0'>
									<label
										className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
										htmlFor='search'
									>
										Search
									</label>
									<input
										className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
										id='search'
										type='text'
										placeholder='Search logs'
										onChange={handleSearch}
									/>
								</div>
							</div>
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
									{filteredLogs.map((log) => (
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
