

module.exports = {
  tags: ['homepage'],
  'homepage test' : function (browser) {
    browser
      .url('http://localhost:3000/')
      .assert.title("HAD Challenge")
      .end()
  }
};