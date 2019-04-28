let apiData = {};
require('custom-env').env('api')
apiData.clientId = process.env.CLIENT_ID;
apiData.clientSecret = process.env.CLIENT_SECRET;
apiData.userKey = process.env.USER_KEY;
// HAD API URLs:
apiData.apiKey = '?api_key=' + apiData.userKey;
apiData.apiUrl = 'https://api.hackaday.io/v1';
apiData.apiAuthUrl = 'https://api.hackaday.io/v1/me' + apiData.apiKey;
apiData.oAuthRedirect = 'https://hackaday.io/authorize?client_id=' + apiData.clientId + '&response_type=code';

if (!apiData.userKey || !apiData.clientId || !apiData.clientSecret) {
    console.log('Please correct your Hackaday Client ID, Client Secret and API Key ! ');
    console.log('Ending node process.');
    process.exit();
}

global.apiData = apiData;