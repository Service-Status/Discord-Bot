import axios from "axios";
import { config } from "dotenv";
import { connect } from "./db";
import * as Discord from "discord.js";
import { loadCommands, loadEvents } from "./commandLoader";
import { error, success } from "./util/debug";

config({ path: "../.env" });

class Client extends Discord.Client {
	commands = new Discord.Collection<string, any>();
	discordCommands = new Discord.Collection<string, any>();
}

export let client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

async function run() {
	connect()
		.then(() => {
			client.login(process.env.TOKEN).then(async () => {
				(
					await axios({
						baseURL: client.options.http.api,
						url: `/applications/${client.user.id}/guilds/832359181196984360/commands`,
						headers: { Authorization: `Bot ${client.token}` }
					})
				).data.forEach(cmd => client.discordCommands.set(cmd.name, cmd));

				loadEvents("./events", client);
				loadCommands("./commands", client);

				if (client.user) success(`Connected as ${client.user.tag}`);
			});
		})
		.catch((err: Error) => {
			error(`Could not connect to database: ${err.name}`);
			process.exit();
		});
}

run();
