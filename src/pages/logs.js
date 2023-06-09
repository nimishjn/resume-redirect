import { MongoClient } from 'mongodb';
import React, { useState } from 'react';

export default function Logs({ logs }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [filteredLogs, setFilteredLogs] = useState(
		logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
	);
	const [pagination, setPagination] = useState({
		currentPage: 1,
		rowsPerPage: 10,
	});

	const filterLogs = (e) => {
		e.preventDefault();

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

	const changeCurrentPage = (newVal) => {
		const maxPages = Math.ceil(
			filteredLogs.length / pagination.rowsPerPage
		);
		if (newVal < 1) setPagination({ ...pagination, currentPage: 1 });
		else if (newVal > maxPages)
			setPagination({ ...pagination, currentPage: maxPages });
		else setPagination({ ...pagination, currentPage: newVal });
	};

	return (
		<div className='px-4 flex flex-col gap-2 h-screen py-6'>
			<form
				onSubmit={filterLogs}
				className='sticky top-0 flex flex-col items-stretch justify-center'
			>
				<div className='flex items-center mb-4'>
					<label className='mr-2'>Keywords:</label>
					<input
						className='px-2 py-1 border border-gray-400 rounded flex-grow'
						type='text'
						placeholder='Search by name or message'
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
					/>
				</div>

				<div className='flex items-center mb-4'>
					<label className='mr-2'>Time Range:</label>
					<input
						className='px-2 py-1 border border-gray-400 rounded mr-2 flex-grow'
						type='datetime-local'
						value={startTime}
						onChange={(event) => setStartTime(event.target.value)}
					/>
					<span className='text-gray-500'>to</span>
					<input
						className='px-2 py-1 border border-gray-400 rounded ml-2 flex-grow'
						type='datetime-local'
						value={endTime}
						onChange={(event) => setEndTime(event.target.value)}
					/>
				</div>
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					type='submit'
				>
					Filter ({filteredLogs.length})
				</button>
			</form>
			<div className='min-w-full flex-grow overflow-auto shadow sm:rounded-lg'>
				<table className='relative table-auto min-w-full divide-y divide-gray-200 overflow-hidden border-b border-gray-200'>
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
							.slice(
								pagination.rowsPerPage *
									(pagination.currentPage - 1),
								pagination.rowsPerPage * pagination.currentPage
							)
							.map((log) => (
								<tr key={log._id}>
									<td className='px-6 py-4 whitespace-nowrap w-1/6'>
										<div className='text-sm text-gray-900 max-w-md break-all'>
											{log.source || '-'}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap w-1/6'>
										<div className='text-sm text-gray-900 max-w-md break-all'>
											{log.level || '-'}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap w-1/6'>
										<div className='text-sm text-gray-900 max-w-md break-all'>
											{log.time || log.timestamp || '-'}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap w-1/2'>
										<div className='text-sm text-gray-900 max-w-md overflow-auto break-all'>
											{JSON.stringify(
												log.allQueryParams || {}
											)}
										</div>
									</td>
								</tr>
							))}
						{filteredLogs.length === 0 && (
							<div className='px-6 py-4 whitespace-nowrap italic font-light w-full'>
								No data found
							</div>
						)}
					</tbody>
				</table>
			</div>
			<div className='w-full flex gap-2 items-center justify-center'>
				<select
					onChange={(e) =>
						setPagination({
							currentPage: 1,
							rowsPerPage: e.target.value,
						})
					}
					value={pagination.rowsPerPage}
					className='px-2 py-1 border border-gray-400 rounded outline-none'
				>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline'
					onClick={() =>
						changeCurrentPage(pagination.currentPage - 1)
					}
				>
					Previous
				</button>
				<p>Page</p>
				<input
					className='px-2 py-1 border border-gray-400 rounded outline-none w-10 text-center'
					value={pagination.currentPage}
					onChange={(e) => changeCurrentPage(e.target.value)}
					type='number'
				/>
				<p>of</p>
				<p>{Math.ceil(filteredLogs.length / pagination.rowsPerPage)}</p>
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline'
					onClick={() =>
						changeCurrentPage(pagination.currentPage + 1)
					}
				>
					Next
				</button>
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
