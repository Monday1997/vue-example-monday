export function debounce<T extends (arg: any) => any>(fn: T, deplay?: number, immediate?: boolean) {
  let timmer: number | null = null
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timmer) {
      clearTimeout(timmer)
    }
    timmer = setTimeout(() => {
      clearTimeout(timmer!)
      timmer = null
      fn.apply(this, args)
    }, deplay || 200)
    if (!timmer && immediate) {
      fn.apply(this, args)
    }
  }
}

export function throllte<T extends (args: any) => any>(fn: T, deplay: number = 200, options: { leading?: boolean; trailing?: boolean } = {
  leading: true, trailing: true
}) {
  let timmer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: ThisParameterType<T> | null = null
  let lastExecTime = 0

  const { leading = true, trailing = true } = options

  function exec(context: ThisParameterType<T>, args: Parameters<T>) {
    lastExecTime = Date.now()
    fn.apply(context, args)
    lastArgs = null
    lastThis = null
  }
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now()
    lastArgs = args
    lastThis = this

    // 如果第一次调用且leading为true，立即执行
    if (leading && lastExecTime === 0) {
      exec(this, args);
      return;
    }


    const remaining = deplay - (now - lastExecTime)
    if (remaining <= 0 || remaining > deplay) {
      if (timmer) {
        clearTimeout(timmer)
        timmer = null;
      }
      exec(this, args)
    } else if (trailing && !timmer) {
      timmer = setTimeout(() => {
        if (lastArgs !== null && lastThis !== null) {
          exec(lastThis, lastArgs)
        }
        timmer = null
      }, remaining)
    }
  }
}

