export type UserType = {
  username: string;
  temporaryPassword: string;
  email: string;
  role?: string;
};

export type UserEntityType = {
  username: string;
  email: string;
  role?: string;
  licence?: string;
};

export type UserEntityConstructorType = UserEntityType & {
  temporaryPassword: string;
};
