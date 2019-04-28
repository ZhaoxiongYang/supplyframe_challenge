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

app.get('/pages', function (req, res) {
    console.log('\ninside /pages');
    var page = req.query.pageid,
        url = apiData.apiUrl + '/projects' + apiData.apiKey + "&per_page=9&page=" + page;
    console.log('\npages Data Query: ', url);
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

app.get('/projects/:page', function (req, res) {
    console.log('\ninside /projects/page');
    var page = req.params.page,
        url = apiData.apiUrl + '/projects' + apiData.apiKey + "&per_page=9&page=" + page;
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
                        res.render('../client/view/projects_grids.ejs', {
                            layout: false,
                            dataType: 'Projects',
                            projects: bodyData.projects,
                        });
                    }
                });
            })(i);
        };
    });
});

app.get('/project/:id', function (req, res) {
    console.log('\ninside /project/detail_page');
    var id = req.params.id,
        url = apiData.apiUrl + '/projects/' + id + apiData.apiKey;
    console.log('\nProject detail Data Query: ', url);
    request.get(url, function (error, response, body) {
        var bodyData = parseJSON(body);
        var url_user = apiData.apiUrl + '/users/' + bodyData.owner_id + apiData.apiKey;
        request.get(url_user, function (error_users, response_users, body_users) {
            var bodyData_users = parseJSON(body_users);
            bodyData.user = bodyData_users;
            var url_recp = apiData.apiUrl + '/projects/' + bodyData.id + '/tags' + apiData.apiKey;
            console.log('\nProject recommand Data Query: ', url_recp);
            request.get(url_recp, function (error_recp, response_recp, body_recp) {
                var bodyData_recp = parseJSON(body_recp);
                bodyData.tagsp = bodyData_recp.tags;
                var list = '';
                if (bodyData.tagsp[0]) {
                    console.log('here');
                    list = bodyData.tagsp[0].id;
                    for (var i = 1; i < bodyData.tagsp.length; i++) {
                        list = list + ',' + bodyData.tagsp[i].id;
                    }
                }
                url = apiData.apiUrl + '/projects/batch' + apiData.apiKey + '&ids=' + list;
                request.get(url, function (error_recps, response_recps, body_recps) {
                    var bodyData_recps = parseJSON(body_recps);
                    bodyData.tagsp = bodyData_recps;
                    var url_recu = apiData.apiUrl + '/users/' + bodyData.owner_id + '/tags' + apiData.apiKey;
                    console.log('\nUser recommand Data Query: ', url_recu);
                    request.get(url_recu, function (error_recu, response_recu, body_recu) {
                        var bodyData_recu = parseJSON(body_recu);
                        bodyData.tagsu = bodyData_recu.tags;
                        var list = '';
                        if (bodyData.tagsu[0]) {
                            list = bodyData.tagsu[0].id;
                            for (var i = 1; i < bodyData.tagsu.length; i++) {
                                list = list + ',' + bodyData.tagsu[i].id;
                            }
                            url = apiData.apiUrl + '/users/batch' + apiData.apiKey + '&ids=' + list;
                        }
                        request.get(url, function (error_recus, response_recus, body_recus) {
                            var bodyData_recus = parseJSON(body_recus);
                            bodyData.tagsu = bodyData_recus;
                            res.render('project_detail', {
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