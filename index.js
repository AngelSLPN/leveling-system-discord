const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = ''; //token bot
const PREFIX = '_';

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Discord.db'); //tệp SQLite

const options = {
  cooldown: 60,
  xpmin: 10,
  xpmax: 20,
  lvlupXP: 500
}

const LevelSystem = require('./levelSystem.js');
const levelSystem = new LevelSystem(client, db);

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async msg => {
  if (msg.author.bot) return;
  
  if (msg.content.toLowerCase().startsWith(PREFIX))
	{
		const args = msg.content.slice(PREFIX.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (command == null) return;
		try {
			command.execute(msg, args, client, db);
		} catch (error) {
			return msg.reply(`Xảy ra lỗi khi thực hiện lệnh này:\n\`${error.message}\``);
		}
	}
}

client.login(TOKEN)
