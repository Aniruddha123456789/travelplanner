const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;


mongoose.connect("mongodb+srv://Aniruddha:.g7gTR!nF4XF2aR@mini-project.c0ery.mongodb.net/?retryWrites=true&w=majority&appName=Mini-project")
.then(() => {
    console.log("Database connection successful");


}).catch((e) => {
    console.error("Database connection error:", e);
});


const LogInSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        // unique: true,

    },
    password:{
        type:String,
        required:true,
    },

},{ timestamps: true });

const collection = new mongoose.model("Collection123", LogInSchema)

module.exports=collection;

