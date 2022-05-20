const axios = require('axios');
const qs = require('qs');

require('dotenv').config()

accessToken = null;
refreshToken = null;

async function login () {
    if (accessToken == null || refreshToken == null) {
        var data = qs.stringify({
            'userName': process.env.EMAIL,
            'password': process.env.PASSWORD,
            'countryCode': '1',
            'bizType': 'smart_life',
            'from': 'tuya' 
         });
    
          var config = {
            method: 'post',
            url: process.env.BASE_URL + 'auth.do',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
          
          await axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            accessToken = response.data.access_token;
            refreshToken = response.data.refresh_token;
          })
          .catch(function (error) {
            console.log(error);
          });
    }
}


function toggleDevice(onOff) {
    console.log(accessToken)
    var data = JSON.stringify({
        "header": {
          "name": "turnOnOff",
          "namespace": "control",
          "payloadVersion": 1
        },
        "payload": {
          "accessToken": accessToken,
          "devId": process.env.LANDING,
          "value": onOff
        }
      });
      
      var config = {
        method: 'post',
        url: process.env.BASE_URL + "skill",
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
}

// Start function
(async() => {
    await login().then(() => toggleDevice(0));
})();