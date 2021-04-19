import { config } from "dotenv";
import { connect } from "./db";
import { Client } from "discord.js";
import * as WOKCommands from "wokcommands";

config({ path: "../.env" });

const client = new Client();
//const WOKCommands = require("wokcommands");

client.once("ready", async () => {
	console.log("Ready!");

	new WOKCommands(client, {
		commandsDir: "./commands",
		testServers: ["832359181196984360"],
		showWarns: false,
	}).setDefaultPrefix(".");
});

client.login(process.env.TOKEN);
connect();
