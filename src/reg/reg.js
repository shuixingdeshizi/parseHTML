const ncname = '[a-aA-Z_][\\w]*'

const qnamcCapture = '(' + ncname + ')'

const startTagOpen = new RegExp('^<' + qnamcCapture)

const startTagClose = new RegExp('^\s*(\/?)>')

const endTag = new RegExp('^<\/' + qnamcCapture + '>')

export {
  startTagOpen,
  startTagClose,
  endTag
}