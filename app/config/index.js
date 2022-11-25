const config = {
	app: {
		port: process.env.PORT || 3000,
	},
	db: {
		uri: process.env.MONGODB_URI || "mongodb://localhost:27017/quanlymonhoc",
	},
	jwt: {
		secret: process.env.JWT_SECRET || "project-secret-key",
	},
};

module.exports = config;
