module.exports = {
  // definimos una lista de scopes habilitados para el grupo de usuarios Admin
  cognitoGroupsRoles: {
    Admin: 'write.users read.users write.licenses read.licenses',
    User: 'write.users read.users read.licenses',
  },
};
