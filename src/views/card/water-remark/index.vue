<template>
  <PageLayout :navs="['其他', '水印']" title="水印">
    <div class="water-mask">
      <div>
        这是重要内容这是重要内容,这是重要内容这是重要内容,这是重要内容这是重要内容,这是重要内容
      </div>
      <div>
        这是重要内容这是重要内容,这是重要内容这是重要内容,这是重要内容这是重要内容,这是重要内容
      </div>
      <div>
        这是重要内容这是重要内容,这是重要内容这是重要内容,这是重要内容这是重要内容,这是重要内容
      </div>
      <div>
        这是重要内容这是重要内容,这是重要内容这是重要内容,这是重要内容这是重要内容,这是重要内容
      </div>
    </div>

    <SelfSpace>
      <div>模拟a-sapce</div>
      <div>模拟a-sapce</div>
    </SelfSpace>
  </PageLayout>
</template>

<script setup lang="ts">
import SelfSpace from './self-space.tsx'
function createImg(content: string[] | string): string {
  const canvas = document.createElement('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  canvas.width = 150
  canvas.height = 100
  if (ctx) {
    ctx.rotate((-10 * Math.PI) / 180)
    ctx.font = '18px Arial'
    ctx.fillStyle = 'rgba(100,100,100,0.2)'
    const contentList = Array.isArray(content) ? content : [content]
    contentList.forEach((str, index) => {
      ctx.fillText(str, 10, (index + 1) * 35)
    })
  }
  return canvas.toDataURL('image/png')
}
function drawWaterMask(img: string, className: string) {
  const style = document.createElement('style')
  style.innerHTML = `
    .${className} {
      position:relative
    }
      .${className}:after{
      position:absolute;
      top:0;
      left:0;
      content:'';
      display:block;
      background-image:url(${img});
      background-repeat:repeat;
      width:100%;
      height:100%;
      pointer-events:none;
    }
  `
  document.head.appendChild(style)
}
function observeCanvas(className: string) {
  const waterMask = document.querySelector(`.${className}`) as HTMLElement
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        const curClassVal = waterMask.getAttribute('class') || ''
        if (!curClassVal.includes(className)) {
          waterMask.classList.add(className)
        }
      }
    }
  })
  observer.observe(waterMask as Node, { attributes: true })
}
onMounted(() => {
  const img = createImg(['这是水印内容'])
  const className = 'water-mask'
  drawWaterMask(img, className)
  observeCanvas(className)
})
</script>

<style scoped>
.water-mask {
  padding: 50px;
}
</style>
