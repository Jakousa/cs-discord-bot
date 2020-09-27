require("dotenv").config();
const Discord = require("discord.js");
const { createCourse } = require("./courses");
const { addRole, removeRole } = require("./roles");
const printInstructors = require("./printInstructors");
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
    case PRINT_INSTRUCTORS_MESSAGE:
      return printInstructors(msg);
    case INITIALIZE_COURSE_MESSAGE:
      const courseCreated = await createCourse(who, courseString, guild);
      updateGuide(guild);
      return courseCreated;
    case UPDATE_GUIDE_MANUALLY:
      updateFaculty(guild);
      return updateGuide(guild);
    default:
      return;
  }
};

client.on("message", async (msg) => {
  if (msg.content.startsWith("!")) {
    const [action, ...args] = msg.content.split(" ");
    const courseString = args.join(" ");
    try {
      await handleCommand(action, courseString, msg)
      await msg.react("✅")
    } catch (err) {
      console.log(err);
      await msg.react("❌");
    } finally {
      // Keep guide clean, but allow commands to be sent there.
      if (msg.channel.name === "guide" && !msg.author.bot) msg.delete();
    }
  }
});

client.login(BOT_TOKEN);
