import { MessageEmbed } from "discord.js";
import axios from "Axios";
import { ssDB } from "../db";

const checkStatus = function (urls: any) {
	return new Promise((resolve, reject) => {
		if (!urls) {
			reject(new Error("No url passed"));
			return;
		}

		let status = [];

		axios
			.all(
				urls.map((service) => {
					return axios.get(service.url);
				})
			)
			.then((sites: any) => {
				for (let i in sites) {
					status.push({
						service: urls[i].service,
						status: sites[i].data.status.description,
					});
				}
				resolve(status);
			});
	});
};

module.exports = {
	slash: false,
	testOnly: true,
	description: "Returns current status of a service",
	minArgs: 1,
	expectedArgs: "<Service>",
	callback: async ({ message, args }) => {
		const service = args.join(" ");
		const sites = ssDB.collection("site");
		let urlsToCheck = [];
		let embed = new MessageEmbed().setTitle(`${service} Status`);

		sites.find({ name: service }).toArray(async (err, item) => {
			if (item.length == 0) {
				embed
					.addFields({
						name: "SERVER ERROR",
						value: "CANNOT FETCH SERVICE",
					})
					.setColor("#e24138");
			} else {
				urlsToCheck = item[0].sites.map((item) => {
					return item;
				});
			}

			checkStatus(urlsToCheck).then((sites: any) => {
				sites.forEach((site: any) => {
					embed
						.addFields({
							name: site.service,
							value: site.status,
						})
						.setColor("#00866e");
				});
				message.reply(embed);
			});
		});
	},
};
