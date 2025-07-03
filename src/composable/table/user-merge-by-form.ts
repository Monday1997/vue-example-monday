import type { ColumnProps } from 'ant-design-vue/es/table'
import type {
  TFormGroupItem,
  TForm,
  MergeFormProps,
  TSelectConfig,
  TColumnUPdateArg,
  anyObj,
} from './type'
import { getDynamicColumn, getGolumnFn } from './columns'
export function userMergeByForm<T = any>(options: MergeFormProps<T>) {
  const { getSelectOptionApi, fixColumns = [], formGroup } = options

  let dynamicColumn: ColumnProps[] = []
  // 根据传入的formGroup生成表单
  function generateForm() {
    return formGroup.reduce((pre: TForm, cur: TFormGroupItem) => {
      pre[cur.key] = []
      return pre
    }, {})
  }

  const form = reactive<TForm>(generateForm())
  let oldForm = JSON.parse(JSON.stringify(form))

  const resultColumns = ref<ColumnProps[]>([])
  const resultList = ref<anyObj[]>([])

  // 缓存变化过的数据
  let cacheColsTableMap: Record<string, anyObj> = {}
  /**
   * 根据form生成表格数据
   */
  function permuteForm(): anyObj[] {
    if (dynamicColumn.length === 0) {
      return []
    }
    const keys: string[] = dynamicColumn.map((item) => item.dataIndex as string)
    let result: (number | string)[][] = [[]]

    for (const key of keys) {
      const values = form[key]
      const newResult: (number | string)[][] = []
      for (const prevCombination of result) {
        for (const value of values!) {
          newResult.push([...prevCombination, value])
        }
      }
      result = newResult
    }
    let type: 'add' | 'del' | 'udpate' = 'add'
    if (resultList.value.length === result.length) {
      type = 'udpate'
    }
    const colsTableMapCpoy = cacheColsTableMap
    cacheColsTableMap = {}
    return result.map((combination, index) => {
      const obj: { [key: string]: unknown } = {}
      const colsValue = combination.join('')
      if (type === 'add') {
        if (colsTableMapCpoy[colsValue]) {
          cacheColsTableMap[colsValue] = colsTableMapCpoy[colsValue]
          return cacheColsTableMap[colsValue]
        }
      }
      keys.forEach((key, keyIndex) => {
        obj[key] = combination[keyIndex]
        obj[`${key}_label`] = formValueLabelMap[combination[keyIndex]]
      })
      cacheColsTableMap[colsValue] = obj
      getFixValue(obj)
      // 更新时固定值不刷新
      if (type === 'udpate') {
        fixColumns.map((item) => {
          obj[item.dataIndex] = resultList.value[index][item.dataIndex]
        })
      }
      return obj
    })
  }

  function getFixValue(record: anyObj) {
    fixColumns.map((item) => {
      record[item.dataIndex] = ''
      const currentFixColumnsConfig = options.fixColumnsConfig?.[item.dataIndex]
      if (currentFixColumnsConfig) {
        record[item.dataIndex] =
          typeof currentFixColumnsConfig === 'function'
            ? currentFixColumnsConfig(record)
            : currentFixColumnsConfig
      }
    })
  }

  function getColumns() {
    return getGolumnFn(dynamicColumn, resultList.value, fixColumns)
  }

  function updateOldForms() {
    oldForm = JSON.parse(JSON.stringify(form))
  }
  /**
   * 找到被影响的列信息，同时修改行
   * @param key 影响到的key
   * @param oldLength 修改前from长度
   * @param dynamicIndex 影响到的列索引
   */
  function onlyColumnUpdate(
    key: string,
    oldLength: number,
    dynamicIndex: number,
  ): TColumnUPdateArg {
    resultList.value = resultList.value.map((item) => {
      if (oldForm[key].length === 0) {
        item[`${key}_label`] = formValueLabelMap[form[key][0]]
        item[key] = form[key][0]
      } else {
        delete item[key]
      }
      return item
    })
    const handlerType = oldLength === 0 ? 'addColumn' : 'delColumn'
    updateOldForms()
    return {
      handlerType,
      key,
      index: dynamicIndex,
    }
  }
  // list1长 list2短
  function findDelValue<T extends string | number>(list1: T[], list2: T[]) {
    let l = 0,
      r = 0
    while (l < list1.length && r < list2.length) {
      if (list1[l] === list2[r]) {
        l++
        r++
      } else {
        return list1[l]
      }
    }
    return list1[l]
  }
  /**
   * 删除一行
   */
  function delARow(key: string, dynamicIndex: number): TColumnUPdateArg {
    const delValue = findDelValue(oldForm[key], form[key])
    resultList.value = resultList.value.filter((item) => {
      return item[key] !== delValue
    })
    updateOldForms()
    return {
      handlerType: 'ListUpdate',
      key,
      index: dynamicIndex,
    }
  }
  /**
   * form改变导致添加多行
   * @param {string|undefined} keyBefore 前一列的key(避免两行相邻出现bug) ,
   * @param key 影响到的key
   * @param newLength 修改后from长度
   * @param dynamicIndex 影响到的列索引
   */
  function addSomeRow(
    keyBefore: string | undefined,
    key: string,
    newLength: number,
    dynamicIndex: number,
  ): TColumnUPdateArg {
    const newArr = [...resultList.value]
    let offSet = 0,
      count = 0
    let lastColumnValue = resultList.value[0]?.[keyBefore!]
    resultList.value.forEach((item, index) => {
      // 与当前新增选项所属同个属性 说明除当前选项外都相同
      const isSameAttr = item[key] === form[key][newLength - 2]
      // 用于判断前一列的值是否相同
      const isSameKeyBefore = item[keyBefore!] === lastColumnValue
      if (isSameAttr && isSameKeyBefore) {
        count++
      } else if (count > 0) {
        const insertOption = resultList.value.slice(index - count, index)
        insertOption.forEach((insertItem) => {
          const record = {
            ...insertItem,
            [`${key}_label`]: formValueLabelMap[form[key][newLength - 1]],
            [key]: form[key][newLength - 1],
          }
          getFixValue(record)
          // 最好deepclone
          newArr.splice(index + offSet, 0, record)
          offSet++
        })
        count = isSameAttr ? 1 : 0
        lastColumnValue = item[keyBefore!]
      }
    })
    if (count > 0) {
      const insertOption = [...newArr.slice(-count)]
      insertOption.map((item) => {
        const record = {
          ...item,
          [`${key}_label`]: formValueLabelMap[form[key][newLength - 1]],
          [key]: form[key][newLength - 1],
        }
        getFixValue(record)
        newArr.push(record)
      })
    }
    resultList.value = newArr
    updateOldForms()
    return {
      handlerType: 'ListUpdate',
      key,
      index: dynamicIndex,
    }
  }

  /**
   * 处理行并返回对应的列操作参数
   */
  function updateList(): TColumnUPdateArg | void {
    if (dynamicColumn.length === 0) {
      resultList.value = []
    }
    if (resultList.value.length === 0) {
      init()
    } else {
      let dynamicIndex = 0
      for (let i = 0; i < formGroup.length; i++) {
        const preKey = formGroup[i - 1]?.key
        const { key } = formGroup[i]
        const oldLength = oldForm[key].length
        const newLength = form[key].length
        if (oldLength > 0) {
          dynamicIndex++
        }
        if (newLength + oldLength === 1) {
          return onlyColumnUpdate(key, oldLength, dynamicIndex)
        } else if (oldLength !== newLength) {
          return oldLength > newLength
            ? delARow(key, dynamicIndex)
            : addSomeRow(preKey, key, newLength, dynamicIndex)
        }
      }
      // 兜底
      return { handlerType: 'update' }
    }
  }
  function updateColumns({
    handlerType,
    key: handlerKey,
    index: handlerIndex,
  }: {
    handlerType: 'addColumn' | 'delColumn' | 'ListUpdate' | 'update'
    key?: string
    index?: number
  }) {
    if (handlerType === 'addColumn' && typeof handlerIndex === 'number') {
      const customCell =
        handlerIndex > 0
          ? resultColumns.value[handlerIndex - 1].customCell
          : (_, index?: number) => ({
              rowSpan: index! > 0 ? 0 : resultList.value.length,
            })
      // @ts-expect-error 忽略一下报错
      resultColumns.value.splice(handlerIndex, 0, {
        dataIndex: `${handlerKey}_label`,
        title: formGroup[handlerIndex].label,
        customCell,
      })
    } else if (handlerType === 'delColumn') {
      resultColumns.value.splice(handlerIndex! - 1, 1)
    } else {
      resultColumns.value = getColumns()
    }
  }

  function init() {
    dynamicColumn = getDynamicColumn(formGroup, form)
    resultList.value = permuteForm()
    resultColumns.value = getColumns()
  }
  watch(
    () => form,
    (val) => {
      dynamicColumn = getDynamicColumn(formGroup, val)
      const handlerColumnArgs = updateList()
      if (handlerColumnArgs) {
        updateColumns(handlerColumnArgs)
      }
    },
    {
      deep: true,
    },
  )

  // 设置form的value与label映射
  const formValueLabelMap: Record<number | string, string> = {}
  async function loadSelectOption() {
    const res = await getSelectOptionApi()
    const selectConfig: TSelectConfig =
      options.setSelectOptions?.(res) || (res as any).selectConfig || {}
    const initForm: TForm =
      options.setInitForm?.(res) || (res as any).initForm || {}
    // key与label的映射
    Object.entries(selectConfig).forEach(([_, value]) => {
      value.forEach((item: any) => {
        formValueLabelMap[item.value] = item.label
      })
    })
    Object.entries(initForm).forEach(([key, value]) => {
      form[key] = value
    })
    updateOldForms()
  }

  return {
    resultColumns,
    resultList,
    form,
    loadSelectOption,
  }
}
