import assert from 'assert'
import matcher from '../matcher.js'
import css2rn from '@startupjs/css-to-react-native-transform'

function p (styleName, cssStyles, inlineStyles) {
  return matcher(
    styleName,
    css2rn.default(cssStyles, { parseMediaQueries: true, parsePartSelectors: true }),
    inlineStyles
  )
}

describe('Pure usage without attributes', () => {
  it('simple', () => {
    assert.deepStrictEqual(p(
      'root',
      /* css */`
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
    ), [
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
    assert.deepStrictEqual(p(
      'root',
      /* css */`
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
      {}
    ), {
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
    assert.deepStrictEqual(p(
      'root',
      /* css */`
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
      {
        style: {
          marginLeft: 10
        }
      }
    ), {
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
  it('multiple classes', () => {
    assert.deepStrictEqual(p(
      'root active card',
      /* css */`
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
      {
        style: {
          marginLeft: 10
        }
      }
    ), {
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
    assert.deepStrictEqual(p(
      'root',
      /* css */`
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .root::part(input) {
          background-color: black;
          color: blue;
        }
      `,
      {}
    ), {
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
    assert.deepStrictEqual(p(
      'root active card',
      /* css */`
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
      {
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
    ), {
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
