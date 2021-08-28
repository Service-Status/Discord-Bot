import { CommandInteraction, MessageEmbed } from "discord.js";
import axios from "axios";
import { ssDB } from "../db";

import { titleCase } from "../util/strings";

const sites = ssDB.collection("sites");

module.exports.run = async (interaction: CommandInteraction) => {
	let response = [];
	const serviceName = (await interaction.options.data[0].value) as string,
		embed = new MessageEmbed();

	let serviceObj = await sites.find({ name: serviceName }).toArray();
	if (serviceObj.length == 0) {
		await interaction.reply({
			embeds: [
				embed
					.setTitle(`${serviceName} Status`)
					.addFields({
						name: "SERVER ERROR",
						value: "UNKOWN SERVICE"
					})
					.setColor("#e24138")
			]
		});

		setTimeout(() => {
			interaction.deleteReply();
		}, 5 * 1000);
		return;
	}

	switch (serviceObj[0].type) {
		case "1":
			response = await checkAtlassianStatus(serviceObj[0].summary);
			break;

		default:
			response = await checkStatus(serviceObj[0].urls);
			break;
	}

	if (response.length > 0) embed.setColor("#00866e");
	else embed.setColor("#e24138");

	response.forEach((site: any) => {
		embed.addFields({
			name: site.service,
			value: site.status
		});
	});

	embed
		.setTitle(`${serviceObj[0].properName} Status`)
		.setImage("https://premid.app/_nuxt/img/logo-wordmark-blue.dea9c6a.png");

	interaction.reply({
		embeds: [embed]
	});
};

async function checkStatus(urls: any): Promise<any> {
	let status = [];

	await axios
		.all(
			urls.map(service => {
				return axios.get(service.url);
			})
		)
		.then((site: any) => {
			for (let i in sites) {
				status.push({
					service: urls[i].service,
					status: sites[i].data.status.description
				});
			}
		});

	return status;
}

async function checkAtlassianStatus(url: string): Promise<any> {
	let status = [];

	await axios.get(url).then((res: any) => {
		status.push({
			service: "Overview",
			status: res.data.status.description
		});

		for (let i in res.data.components) {
			status.push({
				service:
					res.data.components[i].name +
					(res.data.components[i].description
						? " - " + res.data.components[i].description
						: ""),
				status: titleCase(res.data.components[i].status)
			});
		}
	});
	return status;
}

module.exports.config = {
	name: "status",
	discordCommand: true
};
