const { getRoleFromCategory, context } = require("./util");

const possibleRolesArrayFromGuild = () => {
  const { guild } = context

  const rolesFromCategories = guild.channels.cache
    .filter(({ type, name }) => type === "category" && name.startsWith("📚"))
    .map(({ name }) => getRoleFromCategory(name));

  const existingRoles = guild.roles.cache;

  const acualRoles = existingRoles.filter((role) =>
    rolesFromCategories.includes(role.name)
  );
  if (rolesFromCategories.length !== acualRoles.size) {
    console.log(
      "Something is wrong, rolesFromCategories did not match the size of acualRoles",
      rolesFromCategories,
      rolesFromCategories.length,
      acualRoles.map(({ name }) => name),
      acualRoles.size
    );
  }
  return acualRoles;
};

/**
 *
 * @param {Discord.GuildMember} user
 * @param {String} roleString
 */
const removeRole = async (user, roleString) => {
  const role = possibleRolesArrayFromGuild().find(
    (role) => role.name === roleString
  );
  if (!role) throw new Error("Role does not exist or is not available");
  user.roles.remove(role);
};

/**
 *
 * @param {Discord.GuildMember} user
 * @param {String} roleString
 */
const addRole = async (user, roleString) => {
  const role = possibleRolesArrayFromGuild().find(
    (role) => role.name === roleString
  );
  if (!role) throw new Error("Role does not exist or is not available");
  user.roles.add(role);
};

module.exports = {
  addRole,
  removeRole,
};
