import * as mongodb from "mongodb";

export let ssDB: mongodb.Db = null;

export const connect = () => {
	mongodb.MongoClient.connect(
		process.env.MONGO_URL,
		{ useUnifiedTopology: true, maxIdleTimeMS: 60 * 1000 },
		(err, client: mongodb.MongoClient) => {
			if (err) {
				return;
			} else {
				ssDB = client.db("Service-Status");
			}
		}
	);
};
