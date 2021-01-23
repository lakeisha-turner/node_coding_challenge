/* eslint-disable no-console */
'use strict';

// This is a test script for the challenge. It should be runnable on (almost)
// any version of Node. To use it, simply start your server and then execute
// this script. If your server is not listening on 8080, change the `PORT`
// variable below.

var http = require('http');


var HOST = 'localhost';
var PORT = 8080;

http.createServer(function (req, res) {
    request('PUT', '/game', function(err, res) {
      if (!res || typeof res.id !== 'string') {
        console.error('PUT /game must return the new game id as a string.');
        process.exit(1);
      }

      var ticks = 0;
      process.stdout.write('Battles: 0 ');
      play(checkTurn);

      function checkTurn(err, res) {
        process.stdout.write((new Array(String(ticks).length + 2).join('\b')));
        process.stdout.write((++ticks) + ' ');

        if (!res) {
          console.error('POST /game/:id/play must return the play results.');
          process.exit(2);
        }

        if (typeof res.winner !== 'string') {
          console.error('Play must respond with the winner.');
          console.error('Response was: %s', JSON.stringify(res, null, 2));
          process.exit(2);
        }

        if (!res.playerOne || typeof res.playerOne.deck !== 'number') {
          console.error('Play must respond with size of first player\'s deck.');
          console.error('Response was: %s', JSON.stringify(res, null, 2));
          process.exit(2);
        }
        if (!res.playerTwo || typeof res.playerTwo.deck !== 'number') {
          console.error('Play must respond with size of second player\'s deck.');
          console.error('Response was: %s', JSON.stringify(res, null, 2));
          process.exit(2);
        }

        status(function(err, res2) {
          if (!res2) {
            console.error('GET /game/:id must return the status of the game.');
            process.exit(3);
          }

          if (typeof res2.playerOne !== 'number' || typeof res2.playerTwo !== 'number') {
            console.error('Game status must include the player deck size.');
            console.error('Response was: %s', JSON.stringify(res2, null, 2));
            process.exit(3);
          }

          if (res2.playerOne > 0 && res2.playerTwo > 0) {
            play(checkTurn);
          } else {
            console.log('\nSuccess!');
          }
        });
      }

      function play(cb) {
        request('POST', '/game/' + res.id + '/play', cb)
      }

      function status(cb) {
        request('GET', '/game/' + res.id, cb)
      }
    });

    function request(method, path, cb) {
      var req = http.request({
        host: HOST,
        port: PORT,
        method: method,
        path: path
      }, function(res) {
        var body = '';

        res.on('data', function(d) {
          body += d.toString('utf8')
        });

        res.on('error', function(err) {
          console.error('Failed to get response from server.');
          console.error(method + ' http://' + HOST + ':' + PORT + path);
          console.error(err);
          process.exit(-1);
        })

        res.on('end', function() {
          var result = null
          try {
            result = JSON.parse(body)
          } catch (err) {
            console.error('Response from server is not valid JSON.');
            console.error(method + ' http://' + HOST + ':' + PORT + path);
            console.error(body);
            console.error(err);
            process.exit(-1);
          }
          cb(null, result);
        });
      });

      req.on('error', function(err) {
        console.error('Failed to make request to server.');
        console.error(method + ' http://' + HOST + ':' + PORT + path);
        console.error(err);
        process.exit(-1);
      });

      req.end();
    }
}).listen(8080);
