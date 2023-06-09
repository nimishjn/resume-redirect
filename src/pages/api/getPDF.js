import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);
const url = process.env.RESUME_LINK;

const handler = async (req, res) => {
	try {
		const response = await fetch(url);
		if (!response.ok)
			throw new Error(`Unexpected response ${response.statusText}`);

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader(
			'Content-Disposition',
			'attachment; filename=Nimish jain Resume.pdf'
		);
		await pipeline(response.body, res);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Something went wrong!' });
	}
};

export default handler;
