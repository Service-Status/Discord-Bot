import Discord from "discord.js";
import fs from "fs";
import path from "path";
import { error } from "./util/debug";

export async function loadEvents(filePath: string, client: Discord.Client) {
	let eventFile: any,
		files = fs.readdirSync(filePath);

	files = files.filter(file => !file.endsWith(".ts") && !file.endsWith(".map"));
	files = files.map(file => file.split(".")[0]);

	files.map((event: any) => {
		eventFile = require(`${filePath}/${event}.js`);
		if (typeof eventFile == "function") client.on(event, eventFile);
		else {
			if (typeof eventFile.config == "undefined") {
				error(
					`Event ${event} in module ${path.basename(
						path.dirname(filePath)
					)} is missing required field config`
				);
				return;
			}

			if (typeof eventFile.config.clientOnly != "undefined")
				client.on(event, () => eventFile.run(client));
		}
	});
}

export async function loadCommands(filePath: string, client: Discord.Client) {
	let files = fs.readdirSync(filePath);

	files = files.filter(file => !file.endsWith(".ts"));
	files = files.map(file => file.split(".")[0]);

	files.map(command => {
		let props = require(`${filePath}/${command}`);
		if (typeof props["config"] == "undefined") {
			error(
				`Command ${command} in module ${path.basename(
					path.dirname(filePath)
				)} is missing required field config`
			);
			return;
		}

		if (typeof props.config.name == "undefined") {
			error(
				`Command ${command} in module ${path.basename(
					path.dirname(filePath)
				)} is missing required property name`
			);
			return;
		}

		if (typeof props.config.enabled != "undefined" && !props.config.enabled)
			return;

		client.commands.set(props.config.name, props);
	});
}
