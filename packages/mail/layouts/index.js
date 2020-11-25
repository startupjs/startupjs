const html = `
  <div>
    <p> Hello default layout </p>
    %{content}%
  </div>
`

export function defaultLayout (model, options) {
  // TODO: describe %{content}% var* in docs
  return { html, ignoreUnsubscribed: false }
}
