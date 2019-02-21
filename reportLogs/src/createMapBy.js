
function reduceBy(list, by, cb, defaultRtn) {
    return list.reduce((acc, item, i) => {
      const val = item[by];
      return cb(acc, val, item, i);
    }, defaultRtn);
  }
  
exports.createMapBy = function (list, by) {
    return reduceBy(
      list,
      by,
      (map, val, item) => {
        const group = map.get(val) || [];
        group.push(item);
        map.set(val, group);
        return map;
      },
      new Map()
    );
}
  