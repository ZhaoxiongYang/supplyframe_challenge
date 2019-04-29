require('./apiData.js');
require('./parseJSON.js');

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
let http = require('http'),
    express = require('express'),
    request = require('request'),
    app = express(),
    server = http.createServer(app),
    port = 3000;

server.listen(port);

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    let url = apiData.apiUrl + '/projects' + apiData.apiKey + "&per_page=9";
    request.get(url, function (error, response, body) {
        let bodyData = parseJSON(body);
        for (let i = 0; i < bodyData.projects.length; i++) {
            (function (i) {
                let url_user = apiData.apiUrl + '/users/' + bodyData.projects[i].owner_id + apiData.apiKey;
                request.get(url_user, function (error_users, response_users, body_users) {
                    let bodyData_users = parseJSON(body_users);
                    bodyData.projects[i].user = bodyData_users;
                    if (i == bodyData.projects.length - 1) {
                        res.render('../client/view/homepage.ejs', {
                            dataType: 'Projects',
                            apiData: bodyData,
                        });
                    }
                });
            })(i);
        }
    });
});

app.get('/pages', function (req, res) {
    let page = req.query.pageid,
        url = apiData.apiUrl + '/projects' + apiData.apiKey + "&per_page=9&page=" + page;
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
        }
    });
});

app.get('/projects/:page', function (req, res) {
    let page = req.params.page,
        url = apiData.apiUrl + '/projects' + apiData.apiKey + "&per_page=9&page=" + page;
    request.get(url, function (error, response, body) {
        let bodyData = parseJSON(body);
        for (let i = 0; i < bodyData.projects.length; i++) {
            (function (i) {
                let url_user = apiData.apiUrl + '/users/' + bodyData.projects[i].owner_id + apiData.apiKey;
                request.get(url_user, function (error_users, response_users, body_users) {
                    let bodyData_users = parseJSON(body_users);
                    bodyData.projects[i].user = bodyData_users;
                    if (i == bodyData.projects.length - 1) {
                        res.render('../client/view/projects_grids.ejs', {
                            layout: false,
                            dataType: 'Projects',
                            projects: bodyData.projects,
                        });
                    }
                });
            })(i);
        }
    });
});

app.get('/project/:id', function (req, res) {
    let id = req.params.id,
        url = apiData.apiUrl + '/projects/' + id + apiData.apiKey;
    request.get(url, function (error, response, body) {
        let bodyData = parseJSON(body);
        let url_user = apiData.apiUrl + '/users/' + bodyData.owner_id + apiData.apiKey;
        request.get(url_user, function (error_users, response_users, body_users) {
            let bodyData_users = parseJSON(body_users);
            bodyData.user = bodyData_users;
            let url_recp = apiData.apiUrl + '/projects/' + bodyData.id + '/tags' + apiData.apiKey;
            request.get(url_recp, function (error_recp, response_recp, body_recp) {
                let bodyData_recp = parseJSON(body_recp);
                bodyData.tagsp = bodyData_recp.tags;
                let list = '';
                if (bodyData.tagsp[0]) {
                    list = bodyData.tagsp[0].id;
                    for (let i = 1; i < bodyData.tagsp.length; i++) {
                        list = list + ',' + bodyData.tagsp[i].id;
                    }
                }
                url = apiData.apiUrl + '/projects/batch' + apiData.apiKey + '&ids=' + list;
                request.get(url, function (error_recps, response_recps, body_recps) {
                    let bodyData_recps = parseJSON(body_recps);
                    bodyData.tagsp = bodyData_recps;
                    let url_recu = apiData.apiUrl + '/users/' + bodyData.owner_id + '/tags' + apiData.apiKey;
                    request.get(url_recu, function (error_recu, response_recu, body_recu) {
                        let bodyData_recu = parseJSON(body_recu);
                        bodyData.tagsu = bodyData_recu.tags;
                        let list = '';
                        if (bodyData.tagsu[0]) {
                            list = bodyData.tagsu[0].id;
                            for (let i = 1; i < bodyData.tagsu.length; i++) {
                                list = list + ',' + bodyData.tagsu[i].id;
                            }
                            url = apiData.apiUrl + '/users/batch' + apiData.apiKey + '&ids=' + list;
                        }
                        request.get(url, function (error_recus, response_recus, body_recus) {
                            let bodyData_recus = parseJSON(body_recus);
                            bodyData.tagsu = bodyData_recus;
                            res.render('../client/view/project_detail.ejs', {
                                dataType: 'Projects_detail',
                                apiData: bodyData,
                            });
                        });
                    });
                });
            })
        });
    });
});