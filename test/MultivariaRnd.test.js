const Multivaria_contract = artifacts.require("./Multivaria.sol");
const MultivariaMint_contract = artifacts.require("./MultivariaMint.sol");
const assert = require('assert');
const { default: BigNumber } = require('bignumber.js');

contract("MultivariaRnd", accounts => {

  var BN = web3.utils.BN;
  let signer = web3.eth.accounts.wallet[0];
  let AL = {};
  let WL;
  let contractAddress;

  beforeEach(async() =>{
    Multivaria = await Multivaria_contract.deployed();
    MultivariaMint = await MultivariaMint_contract.deployed();
    await web3.eth.accounts.wallet.create(1)
    signer = web3.eth.accounts.wallet[0]
  });
  
  
  it("... should provide random values", async ()=>{
    let results = []
    for(let i=0; i<200; i++){
      await Multivaria.getPseudoRndTier({gas: 200000})
      let result = await Multivaria._test.call()
      // console.log(`iteration ${i+1}: returned: ${result}`)
      results.push(result);
    }

    const occurrences = results.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    console.log(occurrences)
  })

  // it("... should provide random values", async () => {
  //   let results = []
  //   let maxGas = 0;
  //   for(let i=0 ; i<200; i++){
  //     let ubsCopy = []
  //     let receipt = await Multivaria.getPseudoRndTier({from: accounts[0], gas: 100000})
  //     // console.log(`Transaction cost: ${receipt.receipt.gasUsed}`)
  //     // maxGas = receipt.receipt.gasUsed > maxGas ? receipt.receipt.gasUsed : maxGas
  //     // console.log(`Price @10Gwei: ${(receipt.receipt.gasUsed)*10*10**9/(10**18)} ETH`)
  //     // console.log(`Price @20Gwei: ${(receipt.receipt.gasUsed)*20*10**9/(10**18)} ETH`)
  //     // console.log(`Price @30Gwei: ${(receipt.receipt.gasUsed)*30*10**9/(10**18)} ETH`)
  //     // console.log(`rnd: ${await Multivaria._rnd.call()}`)
  //     for(let j=0; j<10;j++){
  //       await Multivaria.getUBS(j)
  //       ubsCopy.push(await Multivaria._ubsIndex.call())
  //     }
  //     // console.log(`UBS: ${ubsCopy}`)
  //     results.push(await Multivaria._test.call())
  //     // console.log(await Multivaria._editionsLeft.call())
  //   }
  //   console.log(results)
  //   // console.log(results.length)

  //   const occurrences = results.reduce(function (acc, curr) {
  //     return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
  //   }, {});
    
  //   console.log(occurrences)
  //   console.log(maxGas)
  // });



  
});
