module.exports = {
	async rewrites() {
		return [
			{
				source: '/:any*',
				destination: '/',
			},
		];
	},
	useFileSystemPublicRoutes: false,  
};