
userTrim = function (user) {
  let {id, name, surname, phone, email, referral, photo, bill, id_settlement, registerAt, role} = user;
  return {id, name, surname, phone, email, referral, photo, bill, id_settlement, registerAt, role}
}

module.exports = {
  userTrim
};
