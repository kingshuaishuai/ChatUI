import { Story, Meta } from '@storybook/vue3/types-6-0'
import { defineComponent } from '@vue/runtime-core'
import { Button, ButtonProps } from '../../src/components/Button'
import '../../src/styles/index.less'

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    color: {
      control: {
        type: 'text',
      },
      defaultValue: 'primary'
    },
    variant: {
      control: {
        type: 'select',
      },
      options: ['text', 'null'],
    },
    size: {
      control: {
        type: 'radio'
      },
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md'
    },
    block: {
      control: {
        type: 'boolean'
      },
      defaultValue: false
    },
    loading: {
      control: {
        type: 'boolean'
      },
      defaultValue: false
    },
    disabled: {
      control: {
        type: 'boolean'
      },
      defaultValue: false
    },
    onClick: {
      action: 'clicked',
      handler: (event) => {
        console.log('click: ', event)
      }
    },
  },
} as Meta

const Template: Story<ButtonProps> = (args) => defineComponent({
  setup() {
    // @ts-ignore
    return () => <Button {...args} />
  }
})

export const Primary = Template.bind({})
Primary.args = {
  label: 'primary'
}