if (process.argv.length > 6) {
    console.log(`That's too many arguments! :( \nThe proper way to use this script is: node ${process.argv[1]} [server IP] (optional: [server port] [name] [version])`);
    process.exit(1);
}
if (process.argv.length < 3) {
    console.log(`Oh hi! You must be new :)\nThe proper way to use this script is the following:\n node ${process.argv[1]} [server IP] (optional: [server port] [name] [version])`);
    process.exit(1);
}
console.log("Loading Mineflayer...");
import { createBot } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { sleep, botStates, } from "./helper.js";
const { pathfinder, Movements, goals } = pathfinderPkg;
const botName = process.argv[4] ? process.argv[4] : "Solzr";
const serverIp = process.argv[2];
const serverPort = process.argv[3] ? process.argv[3] : 25565;
const prefix = '>';
const version = process.argv[5] ? process.argv[5] : "1.18.2";
const owner = "Solazr";
const user_skin_name = "Solazr";
const knownSpamBots = [
    "uwu",
    "fTcxOGld"
];
let hash;
let hashy;
let goal;
let kickCount = 0;
let player;
console.log("Joining server...");
const options = {
    host: serverIp,
    port: serverPort,
    username: botName,
    version: version
};
const bot = createBot(options);
bot.loadPlugin(pathfinder);
function generateRandomCode(length) {
    let characters = 'abcdefghimnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}
async function onSpawn() {
    console.log(`${botName} successfully connected to the server ${serverIp}:${serverPort}`);
    hash = generateRandomCode(12);
    hashy = generateRandomCode(20);
    runGreeting();
    bot.on("chat", async (name, message) => {
        if (name == botName)
            return;
        if (message == `End ${hashy}`) {
            bot.chat(`peace`);
            process.exit(127);
        }
		if (message == `Can I has hashbrown?`) {
            console.log(hash);
			bot.chat("Logged hashbrown to console")
        }
		if (message == `Can I has hashy?`) {
            console.log(hashy);
			bot.chat("Logged hashy to console")        
		}
        if (message == "?") {
            console.log(`[Chat] ${name}: ${message}`);
            return;
        }
        if (message == "I hate Solzr") {
            bot.chat(`>util filter ${name} ${hash}`);
        }
        console.log(`[Chat] ${name}: ${message}`);
        if (message.charAt(0) == prefix) {
            const words = message.trim().split(/\s+/);
            const command = words.shift();
            if (command == undefined)
                return;
            const commandName = command.replace(prefix, "");
            const args = words;
            const inputHash = args.pop();
            hash = await handleCommand(name, commandName, args, inputHash, hash);
        }
    });
}
const publicCommands = [
    "countdown",
    "validate",
    "help",
	"echo"
];
async function handleCommand(username, commandName, args, inputHash, hash) {
    if (commandName == "[object Undefined]") {
        console.log(`[ERR] Bot username: ${username}\nInput hash: ${inputHash}\nCurrent hash: ${hash}`);
        console.trace(`The command returned undefined. Tracing now:`);
        return hash;
    }
    console.log(`[Debug] Command: ${commandName}`);
    if (publicCommands.includes(commandName)) {
        console.log(`Public command used: ${commandName}`);
        switch (commandName) {
            case 'validate':
                if (hash == inputHash) {
                    bot.chat(`Valid`)
                    hash = generateRandomCode(12);
                    console.log(`Hashbrown: ${hash}`);
                }
                else {
                    bot.chat('Invalid hashbrown :(');
                }
                break;
            case 'help':
                bot.chat("-- Help --");
                sleep(100);
                bot.chat("Public:");
                sleep(100);
                bot.chat(">echo [message] - echo! echo! echo, echo....");

                bot.chat(">countdown [optional message] - 3... 2... 1...");
                sleep(100);
                bot.chat(">validate [hash] - Hashbrown taster 3000");
                sleep(100);
                bot.chat(">help - if I need to explain this than you have a problem");
                sleep(100);
                bot.chat(`&4&lHashy people:`);
                sleep(100);
                bot.chat(">util [args]");
				sleep(100);
                bot.chat(">stop [following, pathfinding, filter]");
				sleep(100);
                bot.chat(">selfcare");
                sleep(100);
                bot.chat(">cspy [optional ON/OFF]");
                sleep(100);
                bot.chat(">cloop [clear, list, add, remove] [command] [ms] - CURRENTLY BROKEN");
                sleep(100);
                bot.chat(">pathfind [x] [y] [z]");
                sleep(100);
                bot.chat(">follow [username]");
                sleep(100);
                bot.chat("-- End Help --");
                break
            case 'countdown':
                if (args.length != 0) {
                    bot.chat('3');
                    await sleep(1000);
                    bot.chat('2');
                    await sleep(1000);
                    bot.chat('1');
                    await sleep(1000);
                    bot.chat(`${args.join(" ")}`);
                }
                else {
                    bot.chat('3');
                    await sleep(1000);
                    bot.chat('2');
                    await sleep(1000);
                    bot.chat('1');
                    await sleep(1000);
                    bot.chat('Countdown complete');
                }
                break;
            case 'echo':
                if (args.length != 0) {
                    bot.chat(args.join(" "));
                }
                else {
                    bot.chat('Invalid args');
                }
                break;
        }
        return hash;
    }
    else {
        console.log(`[Debug] Input hash: ${inputHash}\n[Debug] Current hash: ${hash}`);
    }
    if (inputHash === hash) {
        console.log(`[Debug] Command used: ${commandName}`);
        switch (commandName) {
            case 'selfcare':
                if (args.length == 0) {
                    bot.chat('/op @s');
                    await sleep(200);
                    bot.chat('/gamemode creative');
                    await sleep(200);
                }
                else {
                    bot.chat('Invalid args');
                }
                break;
            case 'commandspy':
                if (args.length = 0) {
                    bot.chat("/cspy");
                }
                else {
                    bot.chat(`/cspy ${args[0]}`);
                }
                break;
            case 'stop':
                if (args.length = 0) {
                    bot.chat("Stop what?")
                }
                else if (args.length > 2) {
                    bot.chat("Too many args");
                }
                else {
                    bot.chat(await stop(args[0], args[1] ? args[1] : undefined));
                }
                break;
            case 'util':
                if (args.length == 0) {
                    bot.whisper(username, "No specified player");
                }
                else if (args.length == 1) {
                    bot.whisper(username, "Add some more args?");
                }
                else if (args.length == 2 && args[0] == "filter") {
                    var callbackID = setInterval(() => runBackgroundTask(args[0], botName, args[1]), 500);
                    console.log(`${callbackID} is the callbackID for this mute.`);
                }
				else if (args[0] == "spam") {
                    runBackgroundTask(args[0], args[1]);
					bot.chat(args[0])
					bot.chat(args[1])
				}
                break;
            case 'tpowner':
                bot.chat(`/tp ${botName} ${username}`);
                console.log(`${botName} teleported to ${username}.`);
                bot.setControlState('back', true);
                sleep(500);
                bot.setControlState('back', false);
                break;
            case 'pathfind':
                if (botStates.following) {
                    bot.chat("Sorry, but I'm currently running a task.");
                    break;
                }
                else if (botStates.moving) {
                    bot.chat("Still pathfinding...");
                    break;
                }
                else {
                    bot.chat("Please wait!");
                    bot.setControlState('sprint', true);
                    botStates.moving = true;
                    goal = new goals.GoalGetToBlock(args[0], args[1], args[2]);
                    await bot.pathfinder.goto(goal);
                    break;
                }
            case 'follow':
                bot.setControlState("sprint", true);
                botFollowPlayer(username, 2);
                break;
            default:
                bot.chat(`${commandName} isn't a command`);
        }
        const newhash = generateRandomCode(12);
        console.log(`New hashbrown: ${newhash}`);
        return newhash;
    }
    else if (inputHash != hash) {
        bot.chat("Invalid hashbrown");
        return hash;
    }
    else {
        bot.chat("That's not a command");
        return hash;
    }
}
async function botFollowPlayer(username, range) {
    botStates.following = true;
    player = bot.players[username];
    if (botStates.following) {
        bot.chat("Command already run.");
		await sleep(400)
		bot.chat("(Or not, there's a bug that I hate)")
    }
    if (botStates.moving) {
        bot.chat("I'm pathfinding, can't follow rn.");
    }
    botStates.following = true;
    if (!player?.entity) {
        bot.chat(`${username} not in range`);
        botStates.following = false;
        return;
    }
    while (botStates.following) {
        try {
            if (bot.entity.position.distanceTo(player.entity.position) + 0.15 <= range) {
                await lookAtEntity(player.entity, true);
                botStates.looking = true;
                bot.setControlState('sprint', false);
            }
            else {
                botStates.looking = false;
                bot.setControlState('sprint', true);
            }
            await sleep(200);
            const goal = new goals.GoalFollow(player.entity, range);
            await bot.pathfinder.goto(goal);
        }
        catch (err) {
            console.log(String(err?.message));
            bot.chat('Error, please retry');
            return;
        }
    }
}
bot.once('spawn', onSpawn);
function runBackgroundTask(task, bot_name, player, command) {
    if (!task)
        return;
    if (!player)
        return;
    if (!bot_name)
        return;
    if (task == "filter") {
        bot.chat(`/mute ${player} Filtered by ${bot_name}`);
		sleep(500);
        bot.chat(`/deop ${player}`);
		sleep(500);
        bot.chat(`/gamemode spectator ${player}`);
		sleep(500);
    }
	if (task == "spam") {
        bot.chat(bot_name);
		console.log('chatted ', bot_name);
		sleep(100);
        bot.chat(bot_name);
		console.log('chatted ', bot_name);
		sleep(100);
        bot.chat(bot_name);
		console.log('chatted ', bot_name);
		sleep(100);
    }
    if (task == "command_loop") {
        bot.chat(`/${command}`);
    }
}
async function runGreeting() {
//	bot.chat("/login solzrBotBEST");
    await sleep(1000); 
    bot.chat("/username Hashbrown&f");
    await sleep(400);
	bot.chat("/nick Hashbrown")
	await sleep(400);
    bot.chat("/cspy on");
	await sleep(400)
	bot.chat("/effect clear");
    await sleep(400);
    bot.chat(`/skin ${user_skin_name}`);
    await sleep(1200);
    bot.chat(`/sudo ${owner} skin ${user_skin_name}`);
	console.log(bot.players);
    console.log(`Hashbrown: ${hash}\nHashy: ${hashy}`);	
}
async function lookAtEntity(entity, force = false) {
    await bot.lookAt(entity.position.offset(0, entity.height, 0), force);
}
async function stop(option, callbackID) {
    if (option === "following") {
        if (!botStates.following) {
            return "I'm not following anyone";
        }
        botStates.following = false;
        bot.pathfinder.stop();
    }
    if (option === "pathfinding") {
        bot.pathfinder.stop();
        botStates.moving = false;
        return "Stopped pathfinding";
    }
    if (option === "filter" && callbackID != undefined && typeof callbackID == "number") {
        clearInterval(callbackID);
        return `Filter num ${callbackID} stopped`;
    }
    else if (option === "filter" && callbackID == undefined) {
        return "Can't un-filter without a filter ID";
    }
    else
        return "No task currently. (Or this is that stupid bug with mineflayer)";
}
function removeMSFromArgs(args) {
    args.replace(`${args[0]} `, "");
    return args.join(" ");
}
