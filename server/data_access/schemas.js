"use strict";

import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const GameSchema = new Schema({
    _id:{ type: Schema.Types.ObjectId, require: true},
    id:{ type: String, require: true},
    clients: { type: [String], require: true},
    wholeNumber: { type: Number, require: true},
    turnIndex: { type: Number, require: true},
    currentNum:  { type: Number, require: true},
    lastOp: { type: Object, require: true},
    status: {type:String, require: true},
    room: {type: String, require: true}
});