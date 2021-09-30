function getRecipientEmail (users, userLoggedIn) {
  return users?.filter(userToFilter => userLoggedIn?.email)[1];
}

export default getRecipientEmail;