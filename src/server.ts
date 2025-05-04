import app from "./app";
import env from "./config/env";
import "./config/types";

app.listen(env.APP_PORT, () => {
	console.log(`Server is running on ${env.APP_URL}:${env.APP_PORT}`);
});
