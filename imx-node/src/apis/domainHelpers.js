exports.matchSingleName = (firstName, ownerNames) => {
  const firstNameRegExp = new RegExp(firstName, "gi");
  if (ownerNames.search(firstNameRegExp) != -1) {
    return true;
  }
  return false;
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
  return nameSet.filter(name => {
    initial = name.slice(0, 1);

    nameRegExp = new RegExp(initial, "i");
    if (ownerNames.search(nameRegExp) != -1) {
      return initial;
    }
  });
};

exports.processNameData = (lastName, ownerNames) => {
  /*
   * Types:
   * 1. Personal/Joint owner
   * 2. Unknown/Corporate owner
   */
  return {
    ownerNames: ownerNames.toLowerCase(),
    corporate: getPatternType(ownerNames)
  };
};

function getPatternType(str) {
  // 1 if individual, 2 if unknown/corporate
  const corpTerms = [
    "Corporation",
    "corp",
    "pty",
    "ltd",
    "limited",
    "proprietary",
    "nl",
    "No Liability",
    "co-operative",
    "co-op",
    "securities",
    "Inc",
    "incorporated",
    "body corporate",
    "trust",
    "trustee",
    "trading as",
    "chartered",
    "university",
    "acn",
    "abn",
    "pty ltd",
    "pt",
    "holdings",
    "P/L"
  ];
  let termRegex;
  let results = [];
  corpTerms.forEach(term => {
    termRegex = new RegExp(term, "gi");
    if (str.match(termRegex)) {
      results.push(true);
      //console.log(str.match(termRegex));
    }
  });
  if (results.length > 0) {
    return true;
  }
  return false;
}
