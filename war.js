/***
 * DISCLAIMER:  I am not familiar with the card game WAR so I had to look up how to play this game.  I am not a card player.
 */

const express = require('express')
const app = express()
const port = 8000
const host = 'localhost'

app.get('/', (req, res) => {
  res.send(showRoutes(app._router.stack))
})

app.put('/game', function (req, res) {
    res.send({id:getGameId()})
  })

app.get('/game/:id', function (req, res) {
    res.send(gameStatus(req.params.id))
  })

app.post('/game/:id/play', function (req, res) {
    res.send(getWinner(req.params.id))
})

app.listen(port, () => {
  console.log(`Listening at http://${host}:${port}`)
})

//initialize Game id
let game, game_id, winner;

const showRoutes = (stacks) =>{
    let routes = [];
     stacks.map(function (stack) {
        if(stack.name == "bound dispatch"){
            routes.push({
                path: stack.route.path,
                method: stack.route.stack[0].method
            })
        }  
      });
    return {paths:routes}
}

//Game functions
const getGameId = () => {
    game_id = Math.floor(Math.random() * Math.floor(1000000))
    return game_id;
}
const gameStatus = (gameId) =>{
    let playerOne = Math.floor(Math.random() * Math.floor(26));
    let playerTwo = Math.floor(Math.random() * Math.floor(26));
    
    //add played winner cards to other player
    if(playerOne > playerTwo){
        playerOne = playerOne + (26 - playerTwo)
    }else if(playerTwo > playerOne){
        playerTwo = playerTwo + (26 - playerOne)
    }

    game = {
        id: gameId,
        playerOne:playerOne,
        playerTwo:playerTwo
    }

    //catch invalid game id
    if(gameId != game_id){
        game = {
            error:"Invalid game id"
        }
    } 

    return game;
}

const getCards = (numCards,excludeArray) =>{
    let cards=[];
    let cardsTypes = ["Ace of Clubs","Two of Clubs ","Three of Clubs","Four of Clubs","Five of Clubs","Six of Clubs","Seven of Clubs","Eight of Clubs","Nine of Clubs","Ten of Clubs","King of Clubs","Queen of Clubs","Jack of Clubs","Ace of Diamonds","Two of Diamonds","Three of Diamonds","Four of Diamonds","Five of Diamonds","Six of Diamonds","Seven of Diamonds","Eight of Diamonds","Nine of Diamonds","Ten of Diamonds","King of Diamonds","Queen of Diamonds","Jack of Diamonds","Ace of Hearts","Two of Hearts","Three of Hearts","Four of Hearts","Five of Hearts","Six of Hearts","Seven of Hearts","Eight of Hearts","Nine of Hearts","Ten of Hearts","King of Hearts","Queen of Hearts","Jack of Hearts","Ace of Spades","Two of Spades","Three of Spades","Four of Spades","Five of Spades","Six of Spades","Seven or Spades","Eight of Spades","Nine of Spades","Ten of Spades","King of Spades","Queen of Spades","Jack of Spades"]

    
    //remove excluded cards because they are in the other players deck
    if(excludeArray.length > 0){ 
        for( let i = 0; i < excludeArray.length; i++){ 
            index = cardsTypes.indexOf(excludeArray[i]);
            cardsTypes.splice(index, 1); 
        }  
    }

    // Get the cards in the current deck
    for (let j = 0; j < numCards; j++){
        let card = Math.floor(Math.random() * Math.floor(cardsTypes.length));
        //remove duplicates
        while (cards.indexOf(cardsTypes[card]) != -1) {
            card = Math.floor(Math.random() * Math.floor(cardsTypes.length));
        }
            cards.push(cardsTypes[card])
    }
        

    //return the players cards and the excluded cards
     return {
         cards: cards,
         excludes: cards
     }
}

const determineWinner = (gameId,numCardsPlayer1,numCardsPlayer2) => {

    if(numCardsPlayer1 > numCardsPlayer2){
        return "PLAYER 1"
    }else if(numCardsPlayer1 < numCardsPlayer2 ){
        return "PLAYER 2"
    }else{
        //it there is a tie then break ny reshuffling cards 
        gameStatus(gameId);
        getWinner(gameId);
    }

}

const getWinner = (id) => {
    //catch invalid game id
    if(id != game_id){
        winner = {
            error:"Invalid game id"
        }
    }else if(typeof game != 'object'){
        winner = {
            error:`You must start a game first initialize a game first, call /game/${id}`
        }
    } else{
        numCards1 = game.playerOne;
        numCards2 = game.playerTwo;

        playerOneCards = getCards(numCards1,[]);
        playerTwoCards = getCards(numCards2,playerOneCards.excludes);
        
        //the winner has the most cards
        winner = {
            winner: determineWinner(id,numCards1,numCards2), 
            playerOne: {
                deck: numCards1, 
                cards: playerOneCards.cards
            }, 
            playerTwo: {
                deck: numCards2, 
                cards: playerTwoCards.cards
            }
        }
    }
    

    
    return winner
}