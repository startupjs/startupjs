import css2rn from '@startupjs/css-to-react-native-transform'
import assert from 'assert'
import matcher from '../matcher.js'

function p ({ styleName, fileStyles, globalStyles, localStyles, inlineStyleProps, legacy }) {
  if (!legacy) inlineStyleProps = inlineStyleProps || {}
  return matcher(
    styleName,
    fileStyles && css2rn.default(fileStyles, { parseMediaQueries: true, parsePartSelectors: true }),
    globalStyles && css2rn.default(globalStyles, { parseMediaQueries: true, parsePartSelectors: true }),
    localStyles && css2rn.default(localStyles, { parseMediaQueries: true, parsePartSelectors: true }),
    inlineStyleProps
  )
}

describe('Pure usage without attributes', () => {
  it('simple', () => {
    assert.deepStrictEqual(p({
      styleName: 'root',
      fileStyles: /* css */`
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .dummy {
          color: green;
        }
        .root.dummy {
          color: red;
        }
      `,
      legacy: true
    }), [
      [{ // specificity 0 selectors (same as specificity 10 in CSS)
        color: 'red',
        fontWeight: 'bold',
        paddingLeft: 10
      }]
    ])
  })
})

describe('Root styles only', () => {
  it('simple', () => {
    assert.deepStrictEqual(p({
      styleName: 'root',
      fileStyles: /* css */`
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .dummy {
          color: green;
        }
        .root.dummy {
          color: red;
        }
      `
    }), {
      style: [
        [{ // specificity 0 selectors (same as specificity 10 in CSS)
          color: 'red',
          fontWeight: 'bold',
          paddingLeft: 10
        }]
      ]
    })
  })
  it('with inline styles', () => {
    assert.deepStrictEqual(p({
      styleName: 'root',
      fileStyles: /* css */`
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .dummy {
          color: green;
        }
        .root.dummy {
          color: red;
        }
      `,
      inlineStyleProps: {
        style: {
          marginLeft: 10
        }
      }
    }), {
      style: [
        [{ // specificity 0
          color: 'red',
          fontWeight: 'bold',
          paddingLeft: 10
        }],
        { // inline styles
          marginLeft: 10
        }
      ]
    })
  })
  it('empty root. Pipe inline styles only', () => {
    assert.deepStrictEqual(p({
      styleName: '',
      fileStyles: /* css */`
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .dummy {
          color: green;
        }
        .root.dummy {
          color: red;
        }
      `,
      inlineStyleProps: {
        style: [
          {
            marginLeft: 10
          }, {
            marginRight: 20
          }
        ],
        cardStyle: {
          marginRight: 10
        }
      }
    }), {
      style: [
        // inline styles
        {
          marginLeft: 10
        }, {
          marginRight: 20
        }
      ],
      cardStyle: {
        marginRight: 10
      }
    })
  })
  it('empty everything. Pipe inline styles only', () => {
    assert.deepStrictEqual(p({
      styleName: '',
      inlineStyleProps: {
        style: {
          marginLeft: 10
        }
      }
    }), {
      style: {
        marginLeft: 10
      }
    })
  })
  it('pass inline styles as is if it\'s a string', () => {
    assert.deepStrictEqual(p({
      styleName: '',
      inlineStyleProps: {
        style: 'my-magic-style',
        barStyle: 'magic-bar-style'
      }
    }), {
      style: 'my-magic-style',
      barStyle: 'magic-bar-style'
    })
  })
  it('multiple classes', () => {
    assert.deepStrictEqual(p({
      styleName: 'root active card',
      fileStyles: /* css */`
        .active {
          opacity: 0.8;
        }
        .card {
          border-radius: 8px;
        }
        .card.active {
          opacity: 0.9;
        }
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .root.active {
          opacity: 1;
        }
        .root.card.active {
          color: green;
        }
        .dummy {
          color: green;
        }
        .root.dummy {
          color: red;
        }
        .root.card.dummy {
          color: red;
        }
      `,
      inlineStyleProps: {
        style: {
          marginLeft: 10
        }
      }
    }), {
      style: [
        [{ // specificity 0 (1 class)
          opacity: 0.8
        }, {
          borderRadius: 8
        }, {
          color: 'red',
          fontWeight: 'bold',
          paddingLeft: 10
        }],
        [{ // specificity 1 (2 classes)
          opacity: 0.9
        }, {
          opacity: 1
        }],
        [{ // specificity 2 (3 classes)
          color: 'green'
        }],
        { // inline styles
          marginLeft: 10
        }
      ]
    })
  })
})

describe('Parts', () => {
  it('simple', () => {
    assert.deepStrictEqual(p({
      styleName: 'root',
      fileStyles: /* css */`
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .root::part(input) {
          background-color: black;
          color: blue;
        }
      `
    }), {
      style: [
        [{
          color: 'red',
          fontWeight: 'bold',
          paddingLeft: 10
        }]
      ],
      inputStyle: [
        [{
          backgroundColor: 'black',
          color: 'blue'
        }]
      ]
    })
  })
  it('multiple classes', () => {
    assert.deepStrictEqual(p({
      styleName: 'root active card',
      fileStyles: /* css */`
        .active {
          opacity: 0.8;
        }
        .card {
          border-radius: 8px;
        }
        .card.active {
          opacity: 0.9;
        }
        .card::part(header) {
          background-color: green;
        }
        .card.active::part(header) {
          background-color: red;
        }
        .card.active::part(footer) {
          color: orange;
        }
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .root::part(header) {
          font-size: 20px;
        }
        .root::part(footer) {
          font-size: 22px;
        }
        .root.active {
          opacity: 1;
        }
        .root.active::part(footer) {
          background-color: pink;
        }
        .root.card.active {
          color: green;
        }
        .root.card.active::part(footer) {
          background-color: violet;
        }
        .dummy {
          color: green;
        }
        .dummy::part(header) {
          color: magenta;
        }
        .root.dummy {
          color: red;
        }
        .root.card.dummy {
          color: red;
        }
      `,
      inlineStyleProps: {
        style: {
          marginLeft: 10
        },
        headerStyle: {
          marginLeft: 12
        },
        footerStyle: {
          marginLeft: 14
        },
        dummyStyle: {
          marginLeft: 16
        }
      }
    }), {
      style: [
        [{ // specificity 0 (1 class)
          opacity: 0.8
        }, {
          borderRadius: 8
        }, {
          color: 'red',
          fontWeight: 'bold',
          paddingLeft: 10
        }],
        [{ // specificity 1 (2 classes)
          opacity: 0.9
        }, {
          opacity: 1
        }],
        [{ // specificity 2 (3 classes)
          color: 'green'
        }],
        { // inline styles
          marginLeft: 10
        }
      ],
      headerStyle: [
        [{ // specificity 0
          backgroundColor: 'green'
        }, {
          fontSize: 20
        }],
        [{ // specificity 1
          backgroundColor: 'red'
        }],
        { // inline styles
          marginLeft: 12
        }
      ],
      footerStyle: [
        [{ // specificity 0
          fontSize: 22
        }],
        [{ // specificity 1
          color: 'orange'
        }, {
          backgroundColor: 'pink'
        }],
        [{ // specificity 2
          backgroundColor: 'violet'
        }],
        { // inline styles
          marginLeft: 14
        }
      ],
      dummyStyle: {
        marginLeft: 16
      }
    })
  })
})

describe('External and global and local styles', () => {
  it('inline > local > global > external. No matter the specificity', () => {
    assert.deepStrictEqual(p({
      styleName: 'root active',
      fileStyles: /* css */`
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
          padding-right: 10px;
        }
        .root.active {
          color: yellow;
          padding-right: 20px;
        }
        .dummy {
          color: green;
        }
        .root.dummy {
          color: red;
        }
      `,
      globalStyles: /* css */`
        .root {
          color: blue;
          padding-left: 15px;
          padding-right: 15px;
        }
        .root.active {
          color: white;
        }
        .dummy {
          padding-left: 50px;
        }
      `,
      localStyles: /* css */`
        .root {
          color: violet;
        }
        .root.active {
          padding-right: 20px;
        }
        .dummy {
          padding-top: 10px;
        }
      `,
      inlineStyleProps: {
        style: {
          marginLeft: 10
        }
      }
    }), {
      style: [
        [{ // external specificity 0
          color: 'red',
          fontWeight: 'bold',
          paddingLeft: 10,
          paddingRight: 10
        }],
        [{ // external specificity 1
          color: 'yellow',
          paddingRight: 20
        }],
        [{ // global specificity 0
          color: 'blue',
          paddingLeft: 15,
          paddingRight: 15
        }],
        [{ // global specificity 1
          color: 'white'
        }],
        [{ // local specificity 0
          color: 'violet'
        }],
        [{ // local specificity 1
          paddingRight: 20
        }],
        { // inline styles
          marginLeft: 10
        }
      ]
    })
  })
})
