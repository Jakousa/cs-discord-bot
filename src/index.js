require("dotenv").config();
const Discord = require("discord.js");
const { createCourse } = require('./courses')
const { addRole, removeRole } = require('./roles')
const updateGuide = require('./updateGuide') 
const client = new Discord.Client();
const BOT_TOKEN = process.env.BOT_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const JOIN_COURSE_MESSAGE = "!join";
const LEAVE_COURSE_MESSAGE = "!leave";
const INITIALIZE_COURSE_MESSAGE = "!init";
const UPDATE_GUIDE_MANUALLY = "!update_guide";

client.on("message", (msg) => {
  if (msg.content.startsWith("!")) {
    const [action, ...args] = msg.content.split(" ");
    const courseString = args.join(" ");
    const who = msg.member;
    const guild = msg.guild;
    switch (action) {
      case JOIN_COURSE_MESSAGE:
        return addRole(who, courseString, guild);
      case LEAVE_COURSE_MESSAGE:
        return removeRole(who, courseString, guild);
      case INITIALIZE_COURSE_MESSAGE:
        return createCourse(who, courseString, guild);
      case UPDATE_GUIDE_MANUALLY:
        return updateGuide(guild)
      default:
        return;
    }
  }
});

client.login(BOT_TOKEN);
