# War Server Code Challenge

## Getting Started

`npm install`

`node war.js`

### Start Game

Using Postman make a request to:

http://localhost:8000 - view all the possitble routes

http://localhost:8000/game - starts a new game

http://localhost:8000/game/:id - checks status of game

http:localhost:8000/game/:id/play - shows the games winner, deck and cards

## Description

Your goal is to implement a server that plays the card game
[War for 2 players](https://www.pagat.com/war/war.html#two). The server should
have the following three endpoints:

- `PUT /game` -> `{"id": <string>}`

  Starts a new game of war and returns the game's id.

- `GET /game/:id` -> `{"playerOne": <number>, "playerTwo": <number>}`

  Gets the status of the identified game, returning the number of cards each
  player has in their deck.

- `POST /game/:id/play` -> `{"winner": <string>, "playerOne": {"deck": <number>, "cards": <array>}, "playerTwo": ...}`

  Runs one battle, including resolving any ties. The response should identify
  the winner, and show the cards each player played as well as their new deck
  sizes.

For your convenience, a simple test script is provided that will run a game to
completion and tell you if it is okay.

## Constraints

You may use as much time as you wish, but we expect this challenge to take
around 3 hours. You won't be penalized for using more or less time, but please
let us know roughly how much time you spend on it. (The idea is to keep the
exercise fairly quick and to be respectful of your time investment.)

We look forward to seeing your work!
