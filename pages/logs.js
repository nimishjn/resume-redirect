import { MongoClient } from 'mongodb';
import { useEffect, useState } from 'react';

export default function Logs({ logs }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [filteredLogs, setFilteredLogs] = useState(logs);

	const filterLogs = () => {
		const newLogs = logs.filter((log) => {
			if (!searchTerm) return true;

			const sourceMatches = log.source
				?.toString()
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			if (!startTime || !endTime) return sourceMatches;
			const log_time = new Date(log.timestamp).getTime();
			const startTime_time = new Date(startTime).getTime();
			const endTime_time = new Date(endTime).getTime();

			const withinTimeRange =
				log_time >= startTime_time && log_time <= endTime_time;

			return sourceMatches && withinTimeRange;
		});
		setFilteredLogs(newLogs);
	};

	return (
		<div className='min-w-full mx-auto py-6 sm:px-6 lg:px-8'>
			<div className='flex flex-col'>
				<div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
						<div className='p-4 md:p-0'>
							<div className='sticky top-0 flex flex-col items-stretch justify-center mb-4'>
								<div className='flex items-center mb-4'>
									<label className='mr-2'>Keywords:</label>
									<input
										className='px-2 py-1 border border-gray-400 rounded flex-grow'
										type='text'
										placeholder='Search by name or message'
										value={searchTerm}
										onChange={(event) =>
											setSearchTerm(event.target.value)
										}
									/>
								</div>

								<div className='flex items-center mb-4'>
									<label className='mr-2'>Time Range:</label>
									<input
										className='px-2 py-1 border border-gray-400 rounded mr-2 flex-grow'
										type='datetime-local'
										value={startTime}
										onChange={(event) =>
											setStartTime(event.target.value)
										}
									/>
									<span className='text-gray-500'>to</span>
									<input
										className='px-2 py-1 border border-gray-400 rounded ml-2 flex-grow'
										type='datetime-local'
										value={endTime}
										onChange={(event) =>
											setEndTime(event.target.value)
										}
									/>
								</div>
								<button
									className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
									onClick={filterLogs}
								>
									Filter ({filteredLogs.length})
								</button>
							</div>
							<table className='min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
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
											Level
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Timestamp
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											Data
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{filteredLogs
										.sort(
											(a, b) =>
												new Date(b.timestamp) -
												new Date(a.timestamp)
										)
										.map((log) => (
											<tr key={log._id}>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900 max-w-md break-all'>
														{log.source || '-'}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900 max-w-md break-all'>
														{log.level || '-'}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900 max-w-md break-all'>
														{log.time ||
															log.timestamp ||
															'-'}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900 max-w-md overflow-auto break-all'>
														{JSON.stringify(
															log.allQueryParams ||
																{}
														)}
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
