import { Meta, Story } from '@storybook/vue3/types-6-0'
import { Icon, IconProps } from '../../src/components/Icon'
import '../../src/styles/index.less'

export default {
  title: 'Icon',
  component: Icon
} as Meta

// @ts-ignore
const Template: Story<IconProps> = (args) => (<Icon {...args} />)

export const Default = Template.bind({})
Default.args = {
  type: 'alarm',
  spin: false
}
