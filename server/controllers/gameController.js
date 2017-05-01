/**
 * Created by Yigit on 29.04.2017.
 *
 * Create, Get, Update, Delete, Count Operations Server API for the games collection in MongoDB
 *
 */
import {getGameModel} from "../data_access/modelFactory";
import mongoose from 'mongoose';
import {GAME_STATUS} from '../constants/index';
/* eslint-disable no-console*/
export class GameController {

    clearGames(){
        return getGameModel().
        then(model => model.remove({}, function (err) {
            if (err) return console.error(err);
            //console.log("CLEANED");
        }));
    }

    deleteGameByClient (id){
        return getGameModel().then(
          model => {
              return  this.getGameByClient(id).
              then(game => model.remove({_id: game._id}, function (err) {
                return !!err;
              }));
          }
        );
    }
    getGameByClient (id){
        return getGameModel().
        then(model => model.findOne({ clients: { "$in" : [id]} }).exec() );
    }

    getAvailableGame(){
        return getGameModel().then(
            model => {
                return model.findOne({$where: 'this.clients.length < 2'});
            });

    }
    getGameCount(){
        return getGameModel().then(
            model => {
                return model.count({}, function( err, count){
                    if(err) console.error(err);
                    return count;
                });
            }
        );
    }
    getGameWaiting(){
        return getGameModel().then(
            model => {
                return model.findOne({status:"WAIT", $where: 'this.clients.length < 2'}).exec();
            });
    }
    getGamEnded(){
        return getGameModel().then(
            model => {
                return model.findOne({status:"END"}).exec();
            });

    }

    getWholeNumber(){
        // range(50-150)
        return Math.floor(Math.random()*100 +50);
    }
    createGame(data){

        const wholeNumber =  this.getWholeNumber();
      return getGameModel().then(
          model => {

              return this.getGameCount().then(
                  count => {

                      const game = new model({
                          _id: mongoose.Types.ObjectId(),
                          id: data.id,
                          clients: [data.id],
                          wholeNumber:wholeNumber,
                          turnIndex:1,
                          currentNum: wholeNumber,
                          lastOp:null,
                          status: GAME_STATUS.WAIT,
                          room: "Room_" + (count+1)
                      });
                      game.save(function (err) {
                          if (err) return console.error;
                          console.log("CREATED");
                      });

                      return game;
                  });

          }
       );
    }

    updateGame(game, changes){
        return getGameModel().then(
            model => {
                model.findByIdAndUpdate(game._id, { $set: changes}, { new: true }, function (err, tank) {
                    if (err)
                    {
                        console.error(err);
                    }
                    //console.log(tank);
                  //  console.log("UPDATED");

                });
                // Game with new client Added
                return Object.assign(game, changes);
            });
    }

    removeClient(options){
        return this.getGameByClient(options.id).then(game=> {
            if(game === null){
                return ;
            }
            if(game.clients.length < 2){
                // no clients left remove
                return this.deleteGameByClient(options.id).then(result => {
                    let resultStr = result ? "SUCCESSFUL" : "FAILED";
                    console.log("DELETE Operation is " + resultStr);
                    return result;
                });
            }
            let clientIndex = game.clients.indexOf(options.id);
            game.clients.splice(clientIndex, 1);
            return this.updateGame(game, {clients: game.clients, status: GAME_STATUS.WAIT, turnIndex:1});
          });
    }

    isClientInGame(client){
        let clientId = client.id;
        return this.getGameByClient(clientId).then(
            game => {
                return (game !== null);
            }
        );
    }
    addClientToGame(client, game){
        let clientId = client.id;
        // only add if client is not already in another game
        return this.isClientInGame(client).then(
            isClientInGame => {
                // if in a game already return default values ( do not add client)
                if(isClientInGame){
                    return {clients:[], status: GAME_STATUS.WAIT, turnIndex:1};
                }else{
                    let newClients = game.clients.concat(clientId);
                    if(newClients.length === 2){
                        return this.updateGame(game, { clients: newClients, status:  GAME_STATUS.BEGIN , turnIndex:1, currentNum: this.getWholeNumber()});
                    }
                    else if(newClients.length === 1){
                        return this.updateGame(game, { clients: newClients, status:  GAME_STATUS.WAIT});
                    }
                }
            });


    }

    divideByThree(value){
        if(value%3 === 0){
            return Math.round(value/3);
        }
        return value;
    }

    playGame(gameOp){

        return this.getGameByClient(gameOp.client).then(game=> {
            return this.updateGame(game, { currentNum: this.divideByThree(game.currentNum + gameOp.value) , lastOp: gameOp , turnIndex: game.turnIndex === 1 ? 0 : 1});
        });
    }

}