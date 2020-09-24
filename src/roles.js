const { getRoleFromCategory } = require('./util')

/**
 *
 * @param {Discord.Guild} guild
 */
const possibleRolesArrayFromGuild = (guild) => {
  const rolesFromCategories = guild.channels.cache
    .filter(({ type, name }) => type === "category" && name.startsWith('📚'))
    .map(({ name }) => getRoleFromCategory(name));

  const existingRoles = guild.roles.cache;

  const acualRoles = existingRoles.filter((role) =>
    rolesFromCategories.includes(role.name)
  );
  if (rolesFromCategories.length !== acualRoles.size) {
    console.log(
      "Something is wrong, rolesFromCategories did not match the size of acualRoles",
      rolesFromCategories, rolesFromCategories.length, acualRoles.map(({ name }) => name), acualRoles.size
    );
  }
  return acualRoles;
};

/**
 *
 * @param {Discord.GuildMember} user
 * @param {String} roleString
 * @param {Discord.Guild} guild
 */
const removeRole = async (user, roleString, guild) => {
  const role = possibleRolesArrayFromGuild(guild).find(
    (role) => role.name === roleString
  );
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
  const role = possibleRolesArrayFromGuild(guild).find(
    (role) => role.name === roleString
  );
  if (!role) return;
  user.roles.add(role);
};

module.exports = {
  addRole,
  removeRole,
};
