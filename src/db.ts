import { Db, MongoClient } from "mongodb";

export let ssDB: Db = null;

export function connect() {
	return new Promise((resolve, reject) => {
		MongoClient.connect(process.env.MONGO_URL)
			.then(mongoClient => {
				ssDB = mongoClient.db("Service-Status");
				resolve(mongoClient);
			})
			.catch(reject);
	});
}
