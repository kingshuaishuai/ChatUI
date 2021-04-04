import { Meta, Story } from '@storybook/vue3/types-6-0'
import { IconButton, IconButtonProps } from '../../src/components/IconButton'
import '../../src/styles/index.less'

export default {
  title: 'IconButton',
  component: IconButton,
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
  }
} as Meta

// @ts-ignore
const Template: Story<IconButtonProps> = (args) => (<IconButton {...args} />)

export const Default = Template.bind({})
Default.args = {
  icon: 'alarm',
}
