import assert from 'assert'
import matcher from '../matcher.js'
import css2rn from '@startupjs/css-to-react-native-transform'

function p (tagName, styleName, cssStyles, inlineStyles) {
  return matcher(
    tagName,
    styleName,
    css2rn.default(cssStyles, { parseMediaQueries: true, parsePartSelectors: true }),
    inlineStyles
  )
}

describe('Pure usage without attributes', () => {
  it('simple', () => {
    assert.deepStrictEqual(p(
      'Card',
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
      'Card',
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
      'Card',
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
  it('empty root. Pipe inline styles only', () => {
    assert.deepStrictEqual(p(
      'Card',
      '',
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
        style: [
          {
            marginLeft: 10
          }, {
            marginRight: 20
          }
        ],
        cardStyle: {
          marginRight: 10
        },
        barStyle: 'dark-content'
      }
    ), {
      style: [
        [ // inline styles
          {
            marginLeft: 10
          }, {
            marginRight: 20
          }
        ]
      ],
      cardStyle: {
        marginRight: 10
      },
      barStyle: 'dark-content'
    })
  })
  it('multiple classes', () => {
    assert.deepStrictEqual(p(
      'Card',
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
      'Card',
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
      'Card',
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

describe('Tags with parts', () => {
  it('simple', () => {
    assert.deepStrictEqual(p(
      'Card',
      'root active',
      /* css */`
        .root.active {
          color: violet;
        }
        Card.root.active {
          color: black;
        }
        Card.root {
          color: green;
        }
        Card.root::part(input) {
          color: pink;
        }
        .root {
          color: red;
          font-weight: bold;
          padding-left: 10px;
        }
        .root::part(input) {
          background-color: black;
          color: blue;
        }
        Card {
          color: yellow;
          margin-left: 20px;
        }
        Card::part(input) {
          color: orange;
          margin-right: 30px;
        }
      `,
      {}
    ), {
      style: [
        [{ // tag styles. specificity 1
          color: 'yellow',
          marginLeft: 20
        }],
        [{ // specificity 10 (1 class)
          color: 'red',
          fontWeight: 'bold',
          paddingLeft: 10
        }],
        [{ // specificity 11 (1 tag, 1 class)
          color: 'green'
        }],
        [{ // specificity 20 (2 classes)
          color: 'violet'
        }],
        [{ // specificity 21 (1 tag, 2 classes)
          color: 'black'
        }]
      ],
      inputStyle: [
        [{ // tag styles. specificity 1
          color: 'orange',
          marginRight: 30
        }],
        [{ // specificity 10 (1 class)
          backgroundColor: 'black',
          color: 'blue'
        }],
        [{ // specificity 11 (1 tag, 1 class)
          color: 'pink'
        }]
      ]
    })
  })
})
