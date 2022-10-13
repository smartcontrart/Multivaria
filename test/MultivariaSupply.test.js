// const Multivaria_contract = artifacts.require("./Multivaria.sol");
// const MultivariaMint_contract = artifacts.require("./MultivariaMint.sol");
// const OSContract_contract = artifacts.require("./OSContract.sol");
// const assert = require('assert');
// const { default: BigNumber } = require('bignumber.js');

// contract("MultivariaSupply", accounts => {

//   var BN = web3.utils.BN;
//   let signer = web3.eth.accounts.wallet[0];
//   let AL = {};
//   let WL;
//   let contractAddress;

//   beforeEach(async() =>{
//     Multivaria = await Multivaria_contract.deployed();
//     MultivariaMint = await MultivariaMint_contract.deployed();
//     OSContract = await OSContract_contract.deployed();
//     await web3.eth.accounts.wallet.create(1)
//     signer = web3.eth.accounts.wallet[0]
//   });


//   it("... should sell out ", async ()=>{
//     assert(await Multivaria.approveAdmin(MultivariaMint.address), "Could not approve admin")
//     contractAddress = await Multivaria.address;
//     assert(await MultivariaMint.setMultivariaAddress(contractAddress),"Could not set Multivaria Address")
//     await assert.rejects(MultivariaMint.publicMint(1, {from: accounts[5], value: 0.08*10**18}), "Could mint with closed publicMint");
//     assert(await MultivariaMint.togglePublicMintOpened({from: accounts[0]}))
//     for(let i=1; i<=100; i++){
//       assert(await MultivariaMint.publicMint(2, {from: accounts[i], value: 2*0.8*10**18}), "Could not mint when should have");
//     }
//   })


//   it("... should allow to shift the supply", async ()=>{
//     assert(await Multivaria.toggleShiftActivated(), "Could not activate shift")
//     for(let i=1; i<=100; i++){

//       let receipt1 = await Multivaria.shift({from: accounts[i], gas: 150000});
//       // let receipt2 = await Multivaria.shift({from: accounts[i], gas: 150000});
//       console.log(receipt1)
//       let gasUsed1 = receipt1.receipt.gasUsed;
//       // let gasUsed2 = receipt2.receipt.gasUsed;
//       console.log(`GasUsed1: ${gasUsed1}`);
//       // console.log(`GasUsed2: ${gasUsed2}`);
//       // assert(await Multivaria.shift({from: accounts[i], gas: 150000}), "Couldn't shift");
//     }
//     ;
//   })

// });
