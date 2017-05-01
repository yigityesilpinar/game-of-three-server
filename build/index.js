/**
 * Created by Yigit Yesilpinar on 1.05.2017.
 */
import fs from 'fs';
import chalk from 'chalk';
/* eslint-disable no-console */

function copyFile(source, target, cb) {
    let cbCalled = false;

    let rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    let wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

if(fs.existsSync("./productionServer")){

    // copy paste, read write, move favicon to /production folder
    copyFile('server/favicon.ico', 'productionServer/favicon.ico', (err)=>{
        if(err){
            return console.log(chalk.red.bold("Could not move/copy file ->  server/favicon.ico"));
        }

        console.log(chalk.green.bold("favicon.ico copied to productionServer/favicon.ico"));
    });


    // copy paste production package.json from tools/package.json to production/package.json
    copyFile('build/package.json', 'productionServer/package.json', (err)=>{
        if(err){
            return console.log(chalk.red.bold("Could not move/copy file -> build/package.json"));
        }

        console.log(chalk.green.bold("Production package.json copied to productionServer/package.json"));
    });


}
else{
    console.log(chalk.red.bold('There is no ./productionServer folder to move files in'));
}