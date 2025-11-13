import '@/config/env';
import app from '@/app';

const port = process.env.PORT || 7313;
app.listen(port, () => {
	console.log(`🚀: Server is running on port ${port}`);
});
