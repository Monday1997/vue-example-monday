import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    space: {
      type: Number,
      default: 8,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex-wrap">
        {slots.default &&
          slots
            .default()
            .map((item) => (
              <div style={`margin-right:${props.space}px`}>{item}</div>
            ))}
      </div>
    )
  },
})
