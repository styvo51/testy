function compareRecords(matchKeys, imxData, domainData) {
  return matchKeys.filter((key) => {
    if (!domainData[key]) return; // Do nothing if the key doesn't exist in the domain data
    if (imxData[key] != domainData[key]) {
      return key;
    }
  });
}
function generateNewRecord(model, currentData, freshData) {
  const diff = compareRecords(model, currentData, freshData);
  if (diff.length > 0) {
    const record = {};
    model.forEach((key) => {
      record[key] = currentData[key];
    });
    diff.forEach((key) => {
      record[key] = freshData[key];
    });
    return record;
  }
  return false;
}

module.exports.compareRecords = compareRecords;
module.exports.generateNewRecord = generateNewRecord;
