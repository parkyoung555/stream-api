const server = require('http').createServer();

server.on('request', (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET'
  };

  res.writeHead(200, headers);

  const apis = [
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 1'
        });
      }, 5000);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 2'
        });
      }, 1000);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 3'
        });
      }, 3000);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 4'
        });
      }, 6000);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 5'
        });
      }, 500);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 6'
        });
      }, 7000);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 7'
        });
      }, 4000);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 8'
        });
      }, 5500);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 9'
        });
      }, 2500);
    }),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: 'Data from api 10'
        });
      }, 7200);
    })
  ];

  res.write(JSON.stringify({
    expect: apis.length
  }));
  res.flushHeaders();

  apis.forEach(api => {
    api.then(data => {
      console.log(data);
      res.write(JSON.stringify(data));
      res.flushHeaders();
    });
  });

  Promise.all(apis).then(() => {
    res.end();
  });
});

server.listen(8000);
