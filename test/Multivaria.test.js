const Multivaria_contract = artifacts.require("./Multivaria.sol");
const MultivariaMint_contract = artifacts.require("./MultivariaMint.sol");
const OSContract_contract = artifacts.require("./OSContract.sol");
const assert = require('assert');
const { default: BigNumber } = require('bignumber.js');

contract("Multivaria", accounts => {

  var BN = web3.utils.BN;
  let signer = web3.eth.accounts.wallet[0];
  let AL = {};
  let collectorAL = {};
  let WL;
  let collectorWL
  let contractAddress;

  beforeEach(async() =>{
    Multivaria = await Multivaria_contract.deployed();
    MultivariaMint = await MultivariaMint_contract.deployed();
    OSContract = await OSContract_contract.deployed();
    await web3.eth.accounts.wallet.create(1)
    signer = web3.eth.accounts.wallet[0]
  });
  
  it("... should create a WL", async ()=>{
    WL = [
      {"address": accounts[1]},
      {"address": accounts[2]},
      {"address": accounts[3]},
      {"address": accounts[4]}]
    contractAddress = await Multivaria.address;
    const mintOpenedCheck = true;
    assert(await MultivariaMint.setSigner(signer.address),"Could not set the signer");
    for(i=0; i < WL.length ;i ++){
      assert(web3.utils.toChecksumAddress(WL[i].address),"error")
      assert(web3.utils.toChecksumAddress(signer.address),"error")
      AL[WL[i].address] = await web3.eth.accounts.sign(web3.utils.soliditySha3(WL[i].address, contractAddress, mintOpenedCheck ,'80000000000000000', true), signer.privateKey)
    }
  })

  it("... should create a collector WL", async ()=>{
    collectorWL = [
      {"address": accounts[8]},
      {"address": accounts[9]}]
    contractAddress = await Multivaria.address;
    const mintOpenedCheck = true;
    assert(await MultivariaMint.setSigner(signer.address),"Could not set the signer");
    for(i=0; i < collectorWL.length ;i ++){
      assert(web3.utils.toChecksumAddress(collectorWL[i].address),"error")
      assert(web3.utils.toChecksumAddress(signer.address),"error")
      collectorAL[collectorWL[i].address] = await web3.eth.accounts.sign(web3.utils.soliditySha3(collectorWL[i].address, contractAddress, mintOpenedCheck, '50000000000000000', true), signer.privateKey)
    }
  })
  
  it("... should give deployment costs", async () => {
    let MultivariaInstance = await Multivaria_contract.new();
    let MultivariaMintInstance = await MultivariaMint_contract.new();
    let receiptMultivaria = await web3.eth.getTransactionReceipt(MultivariaInstance.transactionHash);
    let receiptMultivariaMint = await web3.eth.getTransactionReceipt(MultivariaMintInstance.transactionHash);

    console.log(`Multivaria gas deployement cost: ${receiptMultivaria.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptMultivaria.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptMultivaria.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptMultivaria.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`MultivariaMint gas deployement cost: ${receiptMultivariaMint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptMultivariaMint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptMultivariaMint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptMultivariaMint.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`Total deployement cost: ${receiptMultivaria.gasUsed + receiptMultivariaMint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptMultivaria.gasUsed + receiptMultivariaMint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptMultivaria.gasUsed + receiptMultivariaMint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptMultivaria.gasUsed + receiptMultivariaMint.gasUsed)*30*10**9/(10**18)} ETH`)
  });

  // it("... should have previous collectors", async ()=>{
  //   let tokenIdID1 = '20120243526926311683519745435316742329827468478987451852585008394345891495947';
  //   let tokenIdID2 = '20120243526926311683529745335316742329827468478987451852585008394345891495947';
  //   assert(await OSContract.mint(accounts[3], tokenIdID1, 1), "Could not mint token with this shitty ID")
  //   assert(await OSContract.mint(accounts[4], tokenIdID2, 1), "Could not mint token with this secoond shitty ID")
  //   assert(await OSContract.mint(accounts[3], 1, 1), "Could not mint token with this shitty ID")
  //   assert(await OSContract.mint(accounts[4], 2, 1), "Could not mint token with this secoond shitty ID")
  //   assert(await MultivariaMint.setMetavariaAddress(OSContract.address),"Could not set Metavaria Address")
  //   assert(await MultivariaMint.setMetavariaV2Address(OSContract.address),"Could not set MetavariaV2 Address")
  //   assert.equal(await OSContract.balanceOf(accounts[3], tokenIdID1), 1, "Not the expected number of OS tokens")
  //   assert.equal(await OSContract.balanceOf(accounts[4], tokenIdID2), 1, "Not the expected number of OS tokens")
  // })

  it("... should allow to Mint with AL", async ()=>{
    let multivariaMintAddress = await MultivariaMint.address
    assert(await Multivaria.approveAdmin(multivariaMintAddress), "Could not approve admin")
    assert(await MultivariaMint.setSigner(signer.address),"Could not set signer")
    assert(await MultivariaMint.setMultivariaAddress(contractAddress),"Could not set Multivaria Address")
    let signature = AL[accounts[1]]
    await assert.rejects(MultivariaMint.ALMint(signature.v, signature.r, signature.s, 2, {from: accounts[1], value: 2*0.08*10**18}), "Could mint when drop closed");
    assert(await MultivariaMint.toggleALMintOpened({from: accounts[0]}))

    await assert.rejects(MultivariaMint.ALMint(signature.v, signature.r, signature.s, 3, {from: accounts[1], value: 3*0.08*10**18}), "Could mint more than 2 Multivaria when shouldn't have");
    assert(await MultivariaMint.ALMint(signature.v, signature.r, signature.s, 2, {from: accounts[1], value: 2*0.08*10**18}), "Could not mint 2 Multivaria when should have");
    await assert.rejects(MultivariaMint.ALMint(signature.v, signature.r, signature.s, 1, {from: accounts[1], value: 0.08*10**18}), "Could mint more than 2 Multivaria when shouldn't have");
    
    signature = AL[accounts[2]]
    await assert.rejects(MultivariaMint.ALMint(signature.v, signature.r, signature.s, 1, {from: accounts[5], value: 0.08*10**18}), "Could mint when not on the AL");
    assert(await MultivariaMint.ALMint(signature.v, signature.r, signature.s, 1, {from: accounts[2], value: 0.08*10**18}), "Could not mint 1 Multivaria when should have");
    assert(await MultivariaMint.ALMint(signature.v, signature.r, signature.s, 1, {from: accounts[2], value: 0.08*10**18}), "Could not mint 1 Multivaria when should have");
    await assert.rejects(MultivariaMint.ALMint(signature.v, signature.r, signature.s, 1, {from: accounts[2], value: 0.08*10**18}), "Could mint more than 2 Multivaria when shouldn't have");

    assert.equal(await Multivaria.balanceOf(accounts[1],12),2,"Account 1 didn't have 2 tier 12 multivaria");
    assert.equal(await Multivaria.balanceOf(accounts[1],13),2,"Account 1 didn't have 2 shift cards");

    assert.equal(await Multivaria.balanceOf(accounts[2],12), 2,"Account 2 didn't have 2 tier 12 multivaria");
    assert.equal(await Multivaria.balanceOf(accounts[2],13), 2,"Account 2 didn't have 2 shift cards");
  })

  it("... should allow to collectors to mint at discount with AL", async ()=>{    
    signature = collectorAL[accounts[8]]
    await assert.rejects(MultivariaMint.collectorMint(signature.v, signature.r, signature.s, 1, {from: accounts[5], value: 0.05*10**18}), "Could mint when not on the AL");
    assert(await MultivariaMint.collectorMint(signature.v, signature.r, signature.s, 1, {from: accounts[8], value: 0.05*10**18}), "Could not mint 1 Multivaria when should have");
    assert(await MultivariaMint.collectorMint(signature.v, signature.r, signature.s, 1, {from: accounts[8], value: 0.05*10**18}), "Could not mint 1 Multivaria when should have");
    await assert.rejects(MultivariaMint.collectorMint(signature.v, signature.r, signature.s, 1, {from: accounts[8], value: 0.05*10**18}), "Could mint more than 2 Multivaria when shouldn't have");

    assert.equal(await Multivaria.balanceOf(accounts[8],12),2,"Account 8 didn't have 2 tier 12 multivaria");
    assert.equal(await Multivaria.balanceOf(accounts[8],13),2,"Account 8 didn't have 2 shift cards");
  })

  it("... should allow to public Mint", async ()=>{
    await assert.rejects(MultivariaMint.publicMint(1, {from: accounts[5], value: 0.08*10**18}), "Could mint with closed publicMint");
    assert(await MultivariaMint.togglePublicMintOpened({from: accounts[0]}))
    await assert.rejects(MultivariaMint.publicMint(3, {from: accounts[5], value: 3*0.8*10**18}), "Could mint more than 2 Multivaria when shouldn't have");
    assert(await MultivariaMint.publicMint(2, {from: accounts[5], value: 2*0.8*10**18}), "Could not mint when should have");
    await assert.rejects(MultivariaMint.publicMint(1, {from: accounts[5], value: 0.8*10**18}), "Could mint more than 2 Multivaria when shouldn't have");
    assert(await MultivariaMint.publicMint(1, {from: accounts[6], value: 0.8*10**18}), "Could not mint when should have");
    assert(await MultivariaMint.publicMint(1, {from: accounts[6], value: 0.8*10**18}), "Could not mint when should have");
    await assert.rejects(MultivariaMint.publicMint(1, {from: accounts[6], value: 0.8*10**18}), "Could mint more than 2 Multivaria when shouldn't have");

    assert.equal(await Multivaria.balanceOf(accounts[5],12), 2,"Account 5 didn't have 2 tier 12 multivaria");
    assert.equal(await Multivaria.balanceOf(accounts[5],13), 2,"Account 5 didn't have 2 shift cards");

    assert.equal(await Multivaria.balanceOf(accounts[6],12), 2,"Account 6 didn't have 2 tier 12 multivaria");
    assert.equal(await Multivaria.balanceOf(accounts[6],13), 2,"Account 6 didn't have 2 shift cards");
  })

  it("... should allow collectors and AL to public Mint", async ()=>{
    assert(await MultivariaMint.publicMint(2, {from: accounts[1], value: 0.8*10**18}), "Could not mint when should have");
    assert(await MultivariaMint.publicMint(1, {from: accounts[2], value: 0.8*10**18}), "Could not mint when should have");
    assert(await MultivariaMint.publicMint(2, {from: accounts[8], value: 0.8*10**18}), "Could not mint when should have");

    assert.equal(await Multivaria.balanceOf(accounts[1],12), 4,"Account 1 didn't have 4 tier 12 multivaria");
    assert.equal(await Multivaria.balanceOf(accounts[1],13), 4,"Account 1 didn't have 4 shift cards");

    assert.equal(await Multivaria.balanceOf(accounts[2],12), 3,"Account 2 didn't have 3 tier 12 multivaria");
    assert.equal(await Multivaria.balanceOf(accounts[2],13), 3,"Account 2 didn't have 3 shift cards");

    assert.equal(await Multivaria.balanceOf(accounts[8],12), 4,"Account 8 didn't have 4 tier 12 multivaria");
    assert.equal(await Multivaria.balanceOf(accounts[8],13), 4,"Account 8 didn't have 4 shift cards");
  })

  it("... should allow to shift", async ()=>{
    await assert.rejects(Multivaria.shift({from: accounts[1]}), "Shifted when shift not activated");
    assert(await Multivaria.toggleShiftActivated(), "Could not activate shift")
    assert(await Multivaria.shift({from: accounts[1]}), "Couldn't shift");
    assert(await Multivaria.shift({from: accounts[1]}), "Cannot shift when not activated");
    assert(await Multivaria.shift({from: accounts[1]}), "Couldn't shift");
    assert(await Multivaria.shift({from: accounts[1]}), "Cannot shift when not activated");
    await assert.rejects(Multivaria.shift({from: accounts[1]}), "Shifted when shift not activated");
  })

  it("... should allow to unique shift", async ()=>{
    assert(await Multivaria.mint(accounts[8],1,1,{from: accounts[0]}), "Couldn't mint token 1 ");
    assert(await Multivaria.mint(accounts[8],7,1,{from: accounts[0]}), "Couldn't mint token 7 ");
    assert.equal(await Multivaria.uri(1),"14.json","Did not return the right uri for the advanced card");
    assert(await Multivaria.uniqueShift(7,{from: accounts[8]}), "Couldn't shiftAdvancedCard");
    assert.equal(await Multivaria.uri(1),"1.json","Did not return the right uri for the Tier 1 multivaria");
  })

  it("... should allow to do admin stuff", async ()=>{
    // Set URI
  })

});
