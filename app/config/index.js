const config = {
	app: {
		port: process.env.PORT || 3000,
	},
	db: {
		uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quanlymonhoc",
	},
	jwt: {
		secret: process.env.JWT_SECRET || "project-secret-key",
	},
};

module.exports = config;
