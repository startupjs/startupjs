# @startupjs/babel-plugin-react-pug-classnames

Allows to properly parse sub-components in pug:

```pug
Card
  Card.Header.top(styleName={ active } title='Title')
    | Hello world
  Card.Content.middle
  Card.Footer(buttons=['Confirm', 'Cancel'])
```

## License

MIT
