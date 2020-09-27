require("dotenv").config();
const Discord = require("discord.js");
const { createCourse } = require("./courses");
const { addRole, removeRole } = require("./roles");
const updateGuide = require("./updateGuide");
const updateFaculty = require("./updateFaculty");
const client = new Discord.Client();
const BOT_TOKEN = process.env.BOT_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const JOIN_COURSE_MESSAGE = "!join";
const LEAVE_COURSE_MESSAGE = "!leave";
const PRINT_INSTRUCTORS_MESSAGE = "!instructors";
const INITIALIZE_COURSE_MESSAGE = "!init";
const UPDATE_GUIDE_MANUALLY = "!update_guide";

const handleCommand = async (action, courseString, msg) => {
  const who = msg.member;
  const guild = msg.guild;

  switch (action) {
    case JOIN_COURSE_MESSAGE:
      const roleAdded = await addRole(who, courseString, guild);
      updateGuide(guild);
      return roleAdded;
    case LEAVE_COURSE_MESSAGE:
      const roleRemoved = await removeRole(who, courseString, guild);
      updateGuide(guild);
      return roleRemoved;
    case INITIALIZE_COURSE_MESSAGE:
      const courseCreated = await createCourse(who, courseString, guild);
      updateGuide(guild);
      return courseCreated;
    case UPDATE_GUIDE_MANUALLY:
      updateFaculty(guide);
      return updateGuide(guild);
    default:
      return;
  }
};

client.on("message", (msg) => {
  if (msg.content.startsWith("!")) {
    // Keep guide clean, but allow commands to be sent there.
    if (msg.channel.name === "guide" && !msg.author.bot) msg.delete();

    const [action, ...args] = msg.content.split(" ");
    const courseString = args.join(" ");

    handleCommand(action, courseString, msg)
      .then((success) => msg.react("✅"))
      .catch((err) => msg.react("❌"));
  }
});

client.login(BOT_TOKEN);
