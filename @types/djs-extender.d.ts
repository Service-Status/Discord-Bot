import * as Discord from "discord.js";

export type ChangeTypeOfKeys<
	T extends object,
	Keys extends keyof T,
	NewType
> = {
	// Loop to every key. We gonna check if the key
	// is assignable to Keys. If yes, change the type.
	// Else, retain the type.
	[key in keyof T]: key extends Keys ? NewType : T[key];
};

//* Extend Client from discord.js
declare module "discord.js" {
	interface Client {
		commands: Discord.Collection<
			string | undefined,
			{ run: Function; config: CommandProps }
		>;
		aliases: Discord.Collection<string, string>;
		elevation: Function;
		infos: Discord.Collection<string, any>;
		infoAliases: Discord.Collection<string, string>;
		discordCommands: Discord.Collection<string, ApplicationCommand>;
	}
}

//* Command Properties
export interface CommandProps {
	description?: string;
	name?: string;
	permLevel: number;
	enabled: boolean;
	aliases: Array<string>;
	hidden?: boolean;
	discordCommand?: boolean;
}
