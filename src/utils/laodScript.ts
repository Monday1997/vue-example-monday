/**
 * 加载script文件
 * @param src
 * @param checkFunc
 */
const loadScript = (src: string, checkFunc: () => boolean) => {
  return new Promise((resolve) => {
    if (checkFunc()) {
      resolve('ok')
    } else {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = src
      const head = document.querySelector('head')
      if (head) {
        head.appendChild(script)
      }
      script.onload = () => {
        if (checkFunc()) {
          console.log('成功')
          resolve('ok')
        } else {
          console.error(`加载${src}失败,请检查您的配置地址URL填写是否正确!`)
        }
      }
    }
  })
}
/** xlsx 库静态引入 */
export function loadXLSX() {
  return loadScript(
    // 'https://img1.rrzuji.cn/js/cdn/xlsx.mini.min.js',
    'https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.core.min.js',
    () => !!window.XLSX,
  )
}
