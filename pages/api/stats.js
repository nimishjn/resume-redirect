export default async function handler(req, res) {
	if (req.method === 'GET') {
		res.redirect(process.env.RESUME_STATS_URL || '/404');
	} else {
		res.redirect('/404');
	}
}
