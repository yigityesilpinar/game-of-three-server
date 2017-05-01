/**
 * Created by Yigit Yesilpinar on 29.04.2017.
 *
 * Connect to MongoDB and return the GameModel
 *
 */

"use strict";

import {GameSchema} from "./schemas";
import connectionProvider                                        from "./connectionProvider";
import {serverSettings}                                          from "../settings";

export const getGameModel = async function () {
    try {
        const conn = await connectionProvider(serverSettings.serverUrl, serverSettings.database, serverSettings.dbUser, serverSettings.dbPass);
        // return connection to datas collection from MongoDB
        return conn.model("game", GameSchema);
    } catch (err) {
        throw err;
    }
};
