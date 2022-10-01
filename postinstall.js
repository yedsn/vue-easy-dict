var env = process.env

var BANNER = '\x1b[33mThank you for using vue-easy-dict (\x1b[32m https://github.com/yedsn/vue-easy-dict \x1b[96m)\n' +
  '\x1b[35mAuthor: Jam<yedsn@163.com>\x1b[0m\n'

// eslint-disable-next-line no-console,no-control-regex
console.log(env.npm_config_color ? BANNER : BANNER.replace(/\x1b\[\d+m/g, ''))
