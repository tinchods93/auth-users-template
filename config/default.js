module.exports = {
  authorizer: {
    'us-east-1': {
      arn: 'arn:aws:lambda:us-east-1:066342185209:function:aws-custom-authorizer-develop-authorizer',
    },
  },
  // definimos una lista de scopes habilitados para el grupo de usuarios Admin
  cognitoGroupsRoles: {
    Admin: 'write.users read.users write.licenses read.licenses',
    User: 'write.users read.users read.licenses',
  },
};
