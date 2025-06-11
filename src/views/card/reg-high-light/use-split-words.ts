import { ref } from 'vue'
import type { Ref } from 'vue'
type TReturn = {
  textData: Ref<string[]>
}
/**
 *
 * @param str string 要被处理的文字
 * @param reg string[]|RegExp 需要筛选的文字数组|自定义正则
 */
function useSplitWrords(str: string, keysOrReg: RegExp | string[]): TReturn {
  const textData = ref<string[]>([])
  const reg: RegExp = isReg(keysOrReg) ? keysOrReg : new RegExp(`(${keysOrReg.join('|')})`, 'g')
  let result: RegExpExecArray | null = null
  let currentIndex = 0, regIndex = -1
  const returnData: string[] = []
  while ((result = reg.exec(str)) && regIndex !== result!.index) {
    returnData.push(str.slice(currentIndex, result.index))
    returnData.push(result[1])
    currentIndex = result.index + result[0].length
    regIndex = result.index
  }
  if (str.length > currentIndex) {
    returnData.push(str.slice(currentIndex, str.length))
  }
  textData.value = returnData
  return {
    textData
  }
}
function isReg(data: any): data is RegExp {
  const isRegExp = Object.prototype.toString.call(data) === '[object RegExp]'
  return isRegExp
}
export default useSplitWrords
