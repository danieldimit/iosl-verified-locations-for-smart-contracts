const express = require('express');
const app = express();
const detectNetwork = require('web3-detect-network');


(async () => {
 
const network = await detectNetwork(web3.currentProvider)
 
console.log(network)
/*
{
  "id": "4",
  "type": "rinkeby"
}
*/
})();

app.listen(3000);

app.get('/',function (req , res){
 res.send("send file");
});
