var apiData = {};
require('custom-env').env('api')
apiData.clientId = process.env.CLIENT_ID;
apiData.clientSecret = process.env.CLIENT_SECRET;
apiData.userKey = process.env.USER_KEY;
// HAD API URLs:
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

global.apiData = apiData;