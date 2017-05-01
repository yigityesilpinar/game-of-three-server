/**
 * Created by Yigit Yesilpinar on 29.04.2017.
 *
 * Top level route configuration
 *
 */

"use strict";

import cors from "cors";
// socket implementation instead
//import gameRouter from '../routes/gameRouter';

export default function ConfigApiRoutes(app) {
    app.use(cors());
    //app.use(gameRouter);
}
