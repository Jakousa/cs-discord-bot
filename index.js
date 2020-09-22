require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const BOT_TOKEN = process.env.BOT_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const JOIN_COURSE_MESSAGE = "join";
const LEAVE_COURSE_MESSAGE = "leave";
const INITIALIZE_COURSE_MESSAGE = "init";

/**
 *
 * @param {Discord.GuildMember} user
 * @param {String} roleString
 * @param {Discord.Guild} guild
 */
const removeRole = async (user, roleString, guild) => {
  const possibleRoles = guild.channels.cache
    .filter(({ type }) => type === "category")
    .map(({ name }) => name);
  if (!possibleRoles.includes(roleString)) return;
  const role = guild.roles.cache.find((role) => role.name === roleString);
  if (!role) return;
  user.roles.remove(role);
};

/**
 *
 * @param {Discord.GuildMember} user
 * @param {String} roleString
 * @param {Discord.Guild} guild
 */
const addRole = async (user, roleString, guild) => {
  const possibleRoles = guild.channels.cache
    .filter(({ type }) => type === "category")
    .map(({ name }) => name);
  if (!possibleRoles.includes(roleString)) return;
  const role = guild.roles.cache.find((role) => role.name === roleString);
  if (!role) return;
  user.roles.add(role);
};

/**
 *
 * @param {String} name
 * @param {Discord.Guild} guild
 */
const findOrCreateRoleWithName = async (name, guild) => {
  return (
    guild.roles.cache.find((role) => role.name === name) ||
    (await guild.roles.create({
      data: {
        name,
      },
    }))
  );
};

/**
 *
 * @param {Discord.GuildMember} user
 * @param {String} course
 * @param {Discord.Guild} guild
 */
const createCourse = async (user, course, guild) => {
  // TODO CHECK FOR PERMISSIONS

  const studentRole = await findOrCreateRoleWithName(course, guild);

  const adminRole = await findOrCreateRoleWithName(`${course}_admin`, guild);
  const existing = guild.channels.cache;

  let category =
    existing.find(
      (channel) => channel.type === "category" && channel.name === course
    ) ||
    (await guild.channels.create(course, {
      type: "category",
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: adminRole.id,
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: studentRole.id,
          allow: ["VIEW_CHANNEL"],
        },
      ],
    }));

  const options = {
    parent: category,
  };

  const TEXT_CHANNELS = [
    {
      name: `${course}_announcement`,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ["VIEW_CHANNEL"],
        },
        {
          id: studentRole,
          deny: ["SEND_MESSAGES"],
          allow: ["VIEW_CHANNEL"],
        },
        {
          id: adminRole,
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
        },
      ],
    },
    { name: `${course}_general`, permissionOverwrites: [] },
    { name: `${course}_questions`, permissionOverwrites: [] },
  ];

  TEXT_CHANNELS.forEach((channel) => {
    const alreadyExists = existing.find(
      (c) => c.type === "text" && c.name === channel.name
    );
    if (alreadyExists) return;

    const permissionOverwrites = [
      ...(options.permissionOverwrites || []),
      ...channel.permissionOverwrites,
    ];
    console.log(
      "Overwrites",
      permissionOverwrites,
      options.permissionOverwrites,
      channel.permissionOverwrites
    );
    guild.channels.create(channel.name, {
      ...options,
      permissionOverwrites,
    });
  });

  const VOICE_CHANNELS = [
    { name: `${course}_voice`, permissionOverwrites: [] },
  ];

  VOICE_CHANNELS.forEach((channel) => {
    const alreadyExists = existing.find(
      (c) => c.type === "voice" && c.name === channel.name
    );
    if (alreadyExists) return;
    guild.channels.create(channel.name, {
      ...options,
      type: "voice",
      permissionOverwrites: [
        ...(options.permissionOverwrites || []),
        ...channel.permissionOverwrites,
      ],
    });
  });
};

client.on("message", (msg) => {
  if (
    msg.content.startsWith(`${JOIN_COURSE_MESSAGE} `) ||
    msg.content.startsWith(`${LEAVE_COURSE_MESSAGE} `) ||
    msg.content.startsWith(`${INITIALIZE_COURSE_MESSAGE} `)
  ) {
    const [action, course] = msg.content
      .split(" ")
      .map((text) => text.toLowerCase());
    const who = msg.member;
    const guild = msg.guild;

    switch (action) {
      case JOIN_COURSE_MESSAGE:
        return addRole(who, course, guild);
      case LEAVE_COURSE_MESSAGE:
        return removeRole(who, course, guild);
      case INITIALIZE_COURSE_MESSAGE:
        return createCourse(who, course, guild);
      default:
        return;
    }
  }
});

/**
 * Delete channels
 */

client.login(BOT_TOKEN);
