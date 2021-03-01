const functions = require('firebase-functions');
var https = require('https');
var axios = require('axios');

exports.properties = functions.https.onRequest(
  (request: any, response: any) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST');

    var address = encodeURIComponent(request.query.address);
    var citystate_zip = encodeURIComponent(request.query.citystate_zip);

    // var address = encodeURIComponent('1091 Grandeview Blvd');
    // var citystate_zip = encodeURIComponent('35824');

    var url = `https://qvmservices-test.quantarium.com/QDataService/QueryPropertiesByAddress?u=KnoxHoldings-Test&k=fP0uwn%3BK73Jgs%3Ddg&address=${address}&citystate_zip=${citystate_zip}`;

    axios.get(url).then((result: any) => {
      response.send(result.data);
    });
  }
);

exports.info = functions.https.onRequest((request: any, response: any) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');

  var parseString = require('xml2js').parseString;

  var xmlToJson = (url: string, callback: any) => {
    https.get(url, function (res: any) {
      var xml = '';

      res.on('data', function (chunk: any) {
        xml += chunk;
      });

      res.on('error', function (e: any) {
        callback(e, null);
      });

      res.on('timeout', function (e: any) {
        callback(e, null);
      });

      res.on('end', function () {
        parseString(xml, function (err: any, result: any) {
          callback(null, result);
        });
      });
    });
  };

  var id = encodeURIComponent(request.query.id);
  var propertyUrl = `https://qvmservices-test.quantarium.com/QDataService/GetPropertyRecordsXml?u=KnoxHoldings-Test&k=fP0uwn%3BK73Jgs%3Ddg&id=${id}`;
  xmlToJson(propertyUrl, function (err: any, data: any) {
    if (err) {
      console.log(err);
      response.send({});
    } else {
      response.send(data);
    }
  });
});
