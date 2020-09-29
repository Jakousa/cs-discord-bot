const GUILD_ID = '757581218085863474'

const context = {
  ready: false
}
/**
 * Expects role to be between parenthesis e.g. (role)
 * @param {String} string
 */
const getRoleFromCategory = (categoryName) => {
  const cleaned = categoryName.replace("📚", "").trim();
  const regExp = /\(([^)]+)\)/;
  const matches = regExp.exec(cleaned);
  return matches?.[1] || cleaned;
};

/**
 *
 * @param {String} name
 */
const findOrCreateRoleWithName = async (name) => {
  const { guild } = context
  return (
    guild.roles.cache.find((role) => role.name === name) ||
    (await guild.roles.create({
      data: {
        name,
      },
    }))
  );
};

const initializeApplicationContext = async (client) => {
  context.guild = await client.guilds.fetch(GUILD_ID)

  context.ready = true
  console.log('Initialized')
}


module.exports = {
  initializeApplicationContext,
  getRoleFromCategory,
  findOrCreateRoleWithName,
  context,
};
