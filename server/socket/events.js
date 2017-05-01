/**
 * Created by Yigit Yesilpinar on 29.04.2017.
 *
 * Server socket events for the Game of Three
 */
import {GameController} from '../controllers/gameController';
import {GAME_STATUS} from '../constants/index';
/* eslint-disable no-console*/
export function registerEvents(socket) {

    let gameController = new GameController();
    // When server is up remove all documents (games) from database games collection
    gameController.clearGames();

    // New player
    socket.on('connection', function(client){


        // to display remaining user that his/her opponent just left, Not Implemented
        client.on('disconnect',function(){
            gameController.removeClient({
                id: client.id
            }).then(game => socket.emit('GAME_DISCONNECT', game ));
        });


        // initial request from a client
        client.on('REQUEST_GAME', function () {
            gameController.getAvailableGame().then(game =>  {
                if(game !== null){
                    gameController.addClientToGame(client, game)
                        .then(gameJoined => {
                            setTimeout(()=> socket.emit('GAME_START', gameJoined),2000);
                        });
                }
                else{
                    if(client.id){
                        gameController.createGame({
                            id: client.id
                        });
                    }
                    else{
                        console.error("ERROR#2343 ERror client");
                    }

                }

            });

        }); // ON REQUEST GAME


        client.on("GAME_PLAY", function (gameOp) {
            gameController.playGame(gameOp).then(
                game =>{
                    socket.emit('GAME_PLAYED', game);
                    // CHECK WIN CONDITION
                    if(game.currentNum === 1){
                        socket.emit('GAME_WON', game);
                        gameController.updateGame(game, {clients: [], status: GAME_STATUS.END, currentNum: Math.floor(Math.random()*100 +50)});
                    }
                }
            );
        });

        client.on("CLIENT_REJOIN", function (client) {
            // try to join the same game
           gameController.getGamEnded().then(
              game =>  {
                  if(game !== null){
                      gameController.addClientToGame(client, game).then(
                          game => {
                              const status = game.clients.length >1 ? GAME_STATUS.BEGIN : GAME_STATUS.WAIT;
                              gameController.updateGame(game, {status:status, turnIndex:1, lastOp:null}).then(
                                  game=> setTimeout(()=> socket.emit('GAME_START', game),1000)
                              );
                          }
                      );
                  }
                  else {
                      gameController.getGameWaiting().then(
                          game =>  {

                              if(game !== null){
                              gameController.addClientToGame(client, game).then(
                                  game => {
                                      const status = game.clients.length >1 ? GAME_STATUS.BEGIN : GAME_STATUS.WAIT;
                                      gameController.updateGame(game, {status:status, turnIndex:1, lastOp:null}).then(
                                          game=> setTimeout(()=> socket.emit('GAME_START', game),1000)
                                      );
                                  }
                              );
                              }
                              else{
                                  if(client.id){
                                      gameController.createGame({
                                          id: client.id
                                      });
                                  }
                              }
                          }
                      );
                  }
              }
           );
        });
    });
}