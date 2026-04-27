const httpParserJs = require('http-parser-js')

const originalBinding = process.binding

process.binding = function(name) {
  if (name === 'http_parser') {
    return {
      HTTPParser: httpParserJs.HTTPParser,
      kOnHeaders: httpParserJs.HTTPParser.kOnHeaders,
      kOnHeadersComplete: httpParserJs.HTTPParser.kOnHeadersComplete,
      kOnBody: httpParserJs.HTTPParser.kOnBody,
      kOnMessageComplete: httpParserJs.HTTPParser.kOnMessageComplete,
      methods: httpParserJs.methods
    }
  }
  return originalBinding.call(process, name)
}
