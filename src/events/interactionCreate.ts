import { CommandInteraction } from "discord.js";

import { client } from "..";

module.exports = async (command: CommandInteraction) => {
	const cmd = client.commands.find(
		c => c.config.name === command.commandName && c.config.discordCommand
	);

	if (!cmd) return;

	//* Run the command
	cmd.run(command);
};
