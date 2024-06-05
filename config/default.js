module.exports = {
  // definimos una lista de scopes habilitados para el grupo de usuarios Admin
  cognitoGroupsRoles: {
    Admin:
      'write.users read.users write.users_license read.users_license',
    User: 'write.users read.users read.users_license',
  },
};
