var apiData = {};

require('custom-env').env('api')
apiData.clientId = process.env.CLIENT_ID;
apiData.clientSecret = process.env.CLIENT_SECRET;
apiData.userKey = process.env.USER_KEY;

apiData.apiKey = '?api_key=' + apiData.userKey;
apiData.apiUrl = 'https://api.hackaday.io/v1';
apiData.apiAuthUrl = 'https://api.hackaday.io/v1/me' + apiData.apiKey;
apiData.oAuthRedirect = 'https://hackaday.io/authorize?client_id=' + apiData.clientId + '&response_type=code';
apiData.createTokenUrl = function (code) {
    return ('https://auth.hackaday.io/access_token?' +
        'client_id=' + this.clientId +
        '&client_secret=' + this.clientSecret +
        '&code=' + code +
        '&grant_type=authorization_code');
};

if (!apiData.userKey || !apiData.clientId || !apiData.clientSecret) {
    console.log('Please fill in your client data!  See line 10 in server.js.');
    console.log('Ending node process.');
    process.exit();
}

var http = require('http'),
    express = require('express'),
    request = require('request'),
    app = express(),
    server = http.createServer(app),
    port = 3000;

server.listen(port);
console.log('Listening on port: ', port);

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    console.log('\ninside /projects');
    var url = apiData.apiUrl + '/projects' + apiData.apiKey + "&per_page=9";
    console.log('\nProject Data Query: ', url);
    request.get(url, function (error, response, body) {
        var bodyData = parseJSON(body);
        for (var i = 0; i < bodyData.projects.length; i++) {
            (function (i) {
                var url_user = apiData.apiUrl + '/users/' + bodyData.projects[i].owner_id + apiData.apiKey;
                request.get(url_user, function (error_users, response_users, body_users) {
                    var bodyData_users = parseJSON(body_users);
                    bodyData.projects[i].user = bodyData_users;
                    if (i == bodyData.projects.length - 1) {
                        res.render('../client/view/homepage.ejs', {
                            dataType: 'Projects',
                            apiData: bodyData,
                        });
                    }
                });
            })(i);
        };
    });
});

function parseJSON(value) {
    var parsed;
    try {
        parsed = JSON.parse(value);
    } catch (e) {
        console.log('Error parsing JSON: ', e, '\nInput: ', value);
    }
    return parsed || false;
}