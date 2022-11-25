const express = require("express");
const cors = require("cors");
const deadlinesRouter = require("./app/routes/deadline.route");
const projectsRouter = require("./app/routes/project.route");
const authRouter = require("./app/routes/auth.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Welcome to learning manager." });
});

app.use("/api/deadlines", deadlinesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/auth", authRouter);

// handle 404 response
app.use((req, res, next) => {
	return next(new ApiError(404, "Resource not found"));
});

//  xác định phần mềm trung gian xử lý lỗi cuối cùng, sau các lệnh gọi app.use() và định tuyến khác
app.use((error, req, res, next) => {
	return res.status(error.statusCode || 500).json({
		message: error.message || "Internal Server Error",
	});
});

module.exports = app;
