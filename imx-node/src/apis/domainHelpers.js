exports.matchSingleName = (firstName, ownerNames) => {
  const firstNameRegExp = new RegExp(firstName, "gi");
  if (ownerNames.search(firstNameRegExp) != -1) {
    return firstName;
  }
  return "";
};
exports.matchNickname = (nicknames, ownerNames) => {
  let nameRegExp = new RegExp();
  return nicknames.filter(name => {
    nameRegExp = new RegExp(name, "gi");
    if (ownerNames.search(nameRegExp) !== -1) {
      return name;
    }
  });
};
exports.matchInitial = (firstName, nicknames, ownerNames) => {
  let nameSet = [...nicknames, firstName];
  let initial = "";
  let nameRegExp = new RegExp();
  return nameSet.map(name => {
    initial = name.slice(0, 1);

    nameRegExp = new RegExp(initial, "i");
    if (ownerNames.search(nameRegExp) != -1) {
      return initial;
    }
  });
};

exports.processNameData = (lastName, ownerNames) => {
  /* Must account for: Type, pattern, regex
   * 1 surname; firstname /\w+; \w+/gi
   * 2 first middle & first middle lastname /\w+(\w & \w)\w+/gi
   * 3 surname
   * 4 BODY CORPORATE FOR Company Name TITLES SCHEME 12345 /BODY CORPORATE/gi
   */
  /*
   * Types:
   * 1. Single owner
   * 2. Two owners
   * 3. Unknown/company
   * 4. Body corporate
   */
  const ownerType = getPatternType(ownerNames);

  if (ownerType >= 4) {
    return {
      matchName: null,
      ownerNames: null,
      type: { error: "Corporate Owner" }
    };
  }
  return {
    ownerNames: ownerNames.toLowerCase().replace(lastName, " "),
    type: ownerType
  };
};

function getPatternType(str) {
  // return order: 4,2,1,3
  if (str.match(/PTY LTD/gi)) {
    return 5;
  }
  if (str.match(/BODY CORPORATE/gi)) {
    return 4;
  }
  if (str.match(/\w+(\w & \w)\w+/gi)) {
    return 2;
  }
  if (str.match(/\w+; \w+/gi)) {
    return 1;
  }

  return 3;
}
