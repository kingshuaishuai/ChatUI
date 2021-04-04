import { Story, Meta } from '@storybook/vue3/types-6-0'
import { Avatar, AvatarProps } from '../../src'
import '../../src/components/Avatar/style.less'
import '@vue/babel-plugin-jsx'

export default {
  title: 'Avatar',
  component: Avatar,
  argTypes: {
    shape: {
      control: { type: 'radio' },
      options: ['square', 'circle'],
      defaultValue: 'square',
      description: '形状',
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
      description: '大小',
    },
    src: {
      control: {
        type: 'text',
      },
      description: '图片地址'
    },
    url: {
      control: {
        type: 'text',
      },
      description: '头像链接地址：如果有设置则使用a标签包裹img，否则使用span'
    },
    alt: {
      control: {
        type: 'text',
      },
      description: 'img标签alt属性，图片加载失败展示信息'
    },
  }
} as Meta

const Template: Story<AvatarProps> = (args) => {
  return (
    <Avatar {...args} />
  )
}

export const Default = Template.bind({})
Default.args = {
  src: '//gw.alicdn.com/tfs/TB1U7FBiAT2gK0jSZPcXXcKkpXa-108-108.jpg',
  alt: 'name',
}