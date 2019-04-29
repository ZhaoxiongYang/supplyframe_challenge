module.exports = {
  tags: ['detailpage'],
  'detailpage title test' : function (browser) {
    browser
      .url('http://localhost:3000/')
      .assert.title("HAD Challenge")
      .end()
  },
  'detailpage load test' : function (browser){
    browser
      .url('http://localhost:3000/project/19035')
      .waitForElementVisible('body',100000)
      .end()
  },
};