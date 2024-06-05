module.exports = {
  // definimos una lista de scopes habilitados para el grupo de usuarios Admin
  cognitoGroupsRoles: {
    Admin:
      'users.profile users.create users.update users.delete users.list licences.assign',
    User: 'users.profile users.update',
  },
};
