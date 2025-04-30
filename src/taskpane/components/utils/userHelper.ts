// src/utils/userHelper.ts

let communicationUser: any = null;

export const setCommunicationUser = (user: any) => {
  communicationUser = user;
  console.log("Communication user set:", user);
};

export const getCommunicationUser = (): any => {
  return communicationUser;
};
