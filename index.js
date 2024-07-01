// Import the mineflayer library
const mc = require('mineflayer');

// Created with hard work, by @spyingcreeper09 :)

// Bot setup constants
const botName = 'Solzr'; // Replace with a username to your liking for your bot
const serverIp = 'chipmunk.land'; // Replace with your server's IP address (or leave this untouched if you just want to run your bot locally)
const serverPort = 25565; // Replace with your server's port (in case of local LAN, input the port Minecraft sends to you)
const prefix = '!'; // Command prefix used to identify commands to this bot
let hash
const hashLength = 1 // length of the validation code
// Create Minecraft client object
const client = mc.createBot({
    host: serverIp,
    port: serverPort,
    version: "1.18.2",
    username: botName,
    checkTimeoutInterval: 690 * 1000 // Set timeout interval for connection checks
});

function onSpawn() {
    // Log successful connection to the server
    console.log(`${botName} successfully connected to the server ${serverIp}:${serverPort}`)
    // Generate a hash for the owner to use
    let hash = generateRandomCode(hashLength); // The number is how long the code is
    // Now tell the user what his/her hash is
    console.log(`Hash: ${hash}`);
    client.on("chat", async (name, message) => {
        if (name == botName) return
        console.log(`[Chat] ${name}: ${message}`) // Add "// " (yes, with the space) behind this line of code (behind console.log) to disable chat echo. Want a user-friendly simple bot? This repo isn't for you, please go to SonicandTailsCD's own repo. :)
        // Check if message starts with command prefix
        if (message.charAt(0) == prefix) {
            // Extract command name and arguments from the message
            const words = message.trim().split(/\s+/);
            const command = words.shift();
            const commandName = command.replace("!", "");
            const args = words;
            // Get the hash from the message
            const inputHash = args.pop();
            try {
                // Check if the hash matches
                if (inputHash == hash) {
					client.chat('Hash Successful.')
                    // Generate a new hash
                    hash = generateRandomCode(hashLength);
                    console.log(`New hash: ${hash}`);
                    console.log(`\nCommand: ${commandName}\nArguments: ${args.join(" ")}`) // Remove the "//" from " console.log" if you have a problem with commands being run - could help you bug report it later
                    // Asynchronously call the command handler function, with already-parsed command name and arguments
                    await handleCommand(client, commandName, args); // Below this function shows the command handler, edit it to your liking
                } else {
                    // Reject and don't do anything if hash is invalid
                    client.chat('Invalid hash :(');
                }
            }
            catch (err) {
                client.chat("Unable to reach hash variable :(") 
                console.log(String(err?.message)) // In case of failure, the bot catches it and comments it to the console. Use the command output to report a bug, and don't forget to report bugs!
            }
        }
    });
}

// Async function to handle different commands
async function handleCommand(client, commandName, args) {
    // Check for different commands
    switch (commandName) {
        case 'countdown':
            // Check if no arguments are provided
            if (args.length == 0) {
                // Inform user of incorrect command usage
                client.chat('Invalid arguments for this command. Usage: !countdown [message to output] (Counts down from 3)'); // Later on, I will introduce an option to choose how many seconds the bot counts to
            } 
            else {
                // count down from 3
                client.chat('3');
                await sleep(100); // Delay to prevent rapid chat commands
                client.chat('2');
                await sleep(100); // Delay in milliseconds
                client.chat('1');
                await sleep(1000);
                client.chat(args.join(" "));
            }
            break;
        // Command to perform self-care actions in Minecraft
        case 'selfcare':
            // Check if no arguments are provided
            if (args.length == 0) {
                // Perform self-care actions: make player an operator and switch to creative mode
                client.chat('/op @s[type=player]');
                await sleep(200); // Delay to prevent rapid chat commands in miliseconds
                client.chat('/gmc');
                await sleep(200); // Delay to prevent rapid chat commands in milliseconds
                client.chat('Selfcare Complete');
            } else {
                // Inform user of incorrect command usage
                client.chat('Invalid arguments for selfcare command. Usage: !selfcare');
            }
            break;
        // Validate your hash
        case 'validate':
            if (hash == args.pop()){
                client.chat('Valid hash');
                hash = generateRandomCode(hashLength);
                console.log(`Hash: ${hash}`);
            } else {
                client.chat('Invalid hash');
            }
            break;
        
        // Command to echo a message in Minecraft chat
        case 'echo':
            // Check if arguments are provided
            if (args.length != 0) {
                // Concatenate arguments into a single string and send it to chat
                client.chat(args.join(" "));
            } else {
                // Inform user of incorrect command usage
                client.chat('Invalid arguments for echo command. Usage: !echo <phrase to echo>');
            }
            break;
        // Add more cases for other commands here
        default:
            // Log unknown commands to console
            client.chat(`${commandName} isn't a command :()`);
    }
}

// Function to generate a random alphanumeric code of a specified length
function generateRandomCode(length) {
    // Define all possible characters for the code
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // Initialize an empty string to store the code
    let code = '';
    // Loop to generate code of specified length
    for (let i = 0; i < length; i++) {
        // Generate a random index to select a character from 'characters' string
        let randomIndex = Math.floor(Math.random() * characters.length);
        // Append the randomly selected character to the code
        code += characters.charAt(randomIndex);
    }
    // Return the generated code
    return code;
}

// Event listener for successful login
client.once('spawn', onSpawn);
