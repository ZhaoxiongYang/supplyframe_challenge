module.exports = {
  tags: ['homepage'],
  'homepage title test' : function (browser) {
    browser
      .url('http://localhost:3000/')
      .assert.title("HAD Challenge")
      .end()
  },
  'homepage load test' : function (browser){
    browser
      .url('http://localhost:3000/')
      .waitForElementVisible('body',100000)
      .end()
  },
};