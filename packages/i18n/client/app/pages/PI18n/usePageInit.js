// import { useMemo, useLayoutEffect, useEffect } from 'react'
// import escapeRegExp from 'lodash/escapeRegExp'
// import {
//   getTranslationType,
//   getTranslationFilter
// } from './../../helpers'
// import usePage from './../../../usePage'
// import useLangs from './../../../useLangs'
// import { decodePath } from './../../../../isomorphic'
// import { NO_TYPE } from './../../constants'
// import useTranslations from './useTranslations'
// import useI18nTranslations from './useI18nTranslations'
//
// export default function usePageInit () {
//   const [{ type, filter, search }, $page] = usePage()
//   const translations = useTranslations()
//   // if two people open the page at the same time for the first time
//   // this hook can crash the page
//   const i18nTranslations = useI18nTranslations()
//   const langs = useLangs({ exceptDefault: true })
//
//   // set initial filter value
//   useLayoutEffect(() => {
//     $page.set('type', NO_TYPE)
//   }, [])
//
//   // const noFilterTranslations = useMemo(() => {
//   //   return Object.keys(translations).map(translationKey => {
//   //     const subTranslations = Object.keys(translations[translationKey])
//   //       .map(subTranslationKey => ({
//   //         key: subTranslationKey,
//   //         langs: supportedLangs.map(supportedLang => {
//   //           return { lang: supportedLang }
//   //         })
//   //       }))
//   //     return { key: translationKey, subTranslations }
//   //   })
//   // }, [])
//
//   // calculating metadata that is displayed on the page
//   const {
//     pageTranslations,
//     countersByType,
//     countersByFilter
//   } = useMemo(() => {
//     console.time('calculate')
//     const countersByType = {}
//     const countersByFilter = {
//       pending: 10
//     }
//
//     const pageTranslations = []
//
//     for (const translationKey in translations) {
//       const subTranslations = []
//
//       for (const subTranslationKey in translations[translationKey]) {
//         const langTranslations = []
//
//         for (const lang of langs) {
//           const type = getTranslationType(
//             translationKey,
//             subTranslationKey,
//             lang
//           )
//           const filter = getTranslationFilter(
//             translationKey,
//             subTranslationKey,
//             lang
//           )
//           countersByType[type] = (countersByType[type] || 0) + 1
//           const langTranslation = { lang, type }
//           langTranslations.push(langTranslation)
//         }
//
//         subTranslations.push({
//           key: subTranslationKey,
//           langs: langTranslations
//         })
//       }
//
//       pageTranslations.push({
//         key: translationKey,
//         subTranslations
//       })
//     }
//
//     // for (const translationKey in translations) {
//     //   const subTranslations = translations[translationKey]
//     //   const _subTranslations = []
//     //   const props = {}
//     //
//     //   for (const subTranslationKey in subTranslations) {
//     //     const langs = []
//     //     const subProps = {}
//     //     for (const supportedLang of supportedLangs) {
//     //       const type = getTranslationType(
//     //         translationKey,
//     //         subTranslationKey,
//     //         supportedLang
//     //       )
//     //       const filter = getTranslationFilter(
//     //         translationKey,
//     //         subTranslationKey,
//     //         supportedLang
//     //       )
//     //       const lang = { lang: supportedLang, [type]: true }
//     //       if (filter) lang[filter] = true
//     //       langs.push(lang)
//     //       if (!props[filter] && filter) props[filter] = true
//     //       if (!subProps[filter] && filter) subProps[filter] = true
//     //     }
//     //     _subTranslations.push({
//     //       key: subTranslationKey,
//     //       langs,
//     //       ...subProps
//     //     })
//     //   }
//     //
//     //   trans.push({
//     //     key: translationKey,
//     //     ...props,
//     //     subTranslations: _subTranslations
//     //   })
//     // }
//
//     console.timeEnd('calculate')
//     return { pageTranslations, countersByType, countersByFilter }
//   }, [JSON.stringify(i18nTranslations)])
//
//   useEffect(() => {
//     $page.setDiffDeep('countersByFilter', countersByFilter)
//   }, [JSON.stringify(countersByFilter)])
//
//   useEffect(() => {
//     $page.setDiffDeep('countersByType', countersByType)
//   }, [JSON.stringify(countersByType)])
//
//   console.log(pageTranslations, 'pageTranslations')
//   // useEffect(() => {
//   //   console.time('all')
//   //   let displayTranslations = trans
//   //   if (filter) {
//   //     console.time('start')
//   //     const translations = []
//   //     for (const tran of displayTranslations) {
//   //       if (!tran[filter]) continue
//   //       const subTrans = tran.subTranslations
//   //       const _subTranslations = []
//   //       for (const subTran of subTrans) {
//   //         if (!subTran[filter]) continue
//   //         _subTranslations.push({
//   //           key: subTran.key,
//   //           langs: subTran.langs.filter(lang => !!lang[filter])
//   //         })
//   //       }
//   //       translations.push({ key: tran.key, subTranslations: _subTranslations })
//   //     }
//   //     console.log(translations)
//   //     displayTranslations = translations
//   //     console.timeEnd('start')
//   //     // displayTranslations = displayTranslations.filter(tran => {
//   //     //   if (!tran[filter]) return false
//   //     //   const subResult = tran.subTranslations.filter(sub => {
//   //     //     if (!sub[filter]) return false
//   //     //     const result = sub.langs.filter(lang => {
//   //     //       return lang[filter]
//   //     //     })
//   //     //     console.log(result.length, 'result')
//   //     //     return !!result.length
//   //     //   })
//   //     //   console.log(subResult.length, 'subResult')
//   //     //   return !!subResult.length
//   //     // })
//   //     // console.log(displayTranslations, 'filter displayTranslations')
//   //   }
//   //   if (search) {
//   //     displayTranslations = displayTranslations.filter(({ key }) => {
//   //       return new RegExp(escapeRegExp(search), 'i').test(decodePath(key))
//   //     })
//   //   }
//   //   console.timeEnd('all')
//   //   $page.set('displayTranslations', displayTranslations)
//   // }, [JSON.stringify(trans), type, filter, search])
// }
