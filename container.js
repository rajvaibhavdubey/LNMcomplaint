const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDependancies = [
    ['_','lodash'],
    ['mongoose','mongoose'],
    ['passport','passport'],    //A Node.js module for login authentication vagaira vagaira.
    ['formidable','formidable'], //A Node.js module for parsing form data, especially file uploads.
    ['async','async'], 
    ['Users', './models/user']

];

simpleDependancies.forEach(function(val){
    container.register(val[0],function(){
        return require(val[1]);
    });
});

container.load(path.join(__dirname,'/controllers'));

container.register('container',function(){
    return container;
});

module.exports = container;