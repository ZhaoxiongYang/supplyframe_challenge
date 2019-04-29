# supplyframe_challenge

##### get hackaday crendentials
# create ".env.api" file under server/
fill the .env.api with the hackday crendentials in below format:
CLIENT_ID = <your client ID>
CLIENT_SECRET = <your client secrey>
USER_KEY =  <your user key>

##### install packages
## npm install
## npm install nodemon --save-dev
## npm install custom-env --save
## npm install express
## npm insatll eslint

##### run code
## cd server/
## node server.js
## go to "loaclhost:3000" in your browser
## Have fun

##### run tests
## cd test/
## npm install 
## download most recent chromedriver from https://chromedriver.storage.googleapis.com/index.html?path=2.33/
## download selenium server from https://www.seleniumhq.org/download/
## From Downloaded folder, move both files — Selenium-Standalone-3.x.x. jar and chromedriver to /lib/drivers directory on your project.
## node nightwatch -e chrome (note you need to have chrome installed)