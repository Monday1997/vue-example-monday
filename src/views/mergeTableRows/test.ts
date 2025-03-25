function permuteForm(form: { [key: string]: string[] }): string[][] {
  const keys = Object.keys(form);
  if (keys.length === 0) {
    return [];
  }
  // keys=['attr1',attr2','attr3]
  let result: string[][] = [[]];

  for (const key of keys) {
    const values = form[key];
    const newResult: string[][] = [];
    for (const prevCombination of result) {
      for (const value of values) {
        newResult.push([...prevCombination, value]);
      }
    }
    console.log(newResult)
    result = newResult;
  }

  return result;
}

// 测试示例
const form = {
  attr1: ['1', '4', '6'],
  attr2: ['8', '13', '49'],
  attr3: ['9', '123', '459'],
};

const permutations = permuteForm(form);
console.log(permutations);
