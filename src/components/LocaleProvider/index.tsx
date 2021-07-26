import { defineComponent, inject, PropType, provide, reactive, toRefs } from '@vue/runtime-core'
import defaultLocales from './locales'

const LOCALE_CONTEXT = 'localeContext'
const DEFAULT_LOCALE = 'zh-CN';

type ILocales = {
  [k: string]: any;
};

export type ILocaleContext = {
  locale?: string;
  locales?: ILocales;
};

const localeProviderProps = {
  locale: {
    type: String,
    default: DEFAULT_LOCALE
  },
  locales: Object as PropType<ILocales>
}

const LocaleProvider = defineComponent({
  name: 'LocaleProvider',
  props: localeProviderProps,
  setup(props, { slots }) {
    provide(LOCALE_CONTEXT, props)
    return () => (<>{slots.default && slots.default()}</>)
  }
})

function useLocale(comp: string) {
  const localeContext = inject<ILocaleContext>(LOCALE_CONTEXT)
  const locale = localeContext!.locale
  const locales = localeContext!.locales

  const defaultStrings = (locale && (defaultLocales as ILocales)[locale]) || defaultLocales[DEFAULT_LOCALE]

  // 合并传入的locales
  let strings = locales ? { ...defaultStrings, ...locales } : defaultStrings;

  if (comp) {
    strings = strings[comp];
  }

  return reactive({
    locale,
    trans: (key?: string) => (key ? strings[key] : strings),
  });
}

export { LocaleProvider, useLocale };
