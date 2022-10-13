import React, { Component } from "react";
import Web3 from "web3";
import { Button } from "react-bootstrap";
import { AccountInfoContext } from '../Context/AccountInfo'
import Multivaria  from "../contracts/Multivaria.json";
import MultivariaMint  from "../contracts/MultivariaMint.json";
import AL from '../AL/signedList.json'
import collectorAL from '../AL/signedCollectorList.json'

class Connect extends Component {
  
  static contextType =  AccountInfoContext
  
  componentDidMount = async () => {

    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3  = new Web3(window.web3.currentProvider);
    }else{
      var provider = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID1}`
      var web3Provider = new Web3.providers.HttpProvider(provider);
      this.web3 = new Web3(web3Provider);
    };
    this.context.updateAccountInfo({web3: this.web3})
    if(this.web3){
      await this.setNetwork();
      await this.getContractsInstances();
      if(window.ethereum || window.web3){
        await this.setAccount();
      }
    }
  }

  async getContractsInstances(){
    this.networkId = await this.web3.eth.getChainId();
    this.context.updateAccountInfo({networkId: this.networkId})
    this.MultivariaInstance = new this.web3.eth.Contract(
      Multivaria.abi,
      parseInt(process.env.REACT_APP_MAINNET_NETWORK) && process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS
    )
    this.MultivariaMintInstance = new this.web3.eth.Contract(
      MultivariaMint.abi,
      parseInt(process.env.REACT_APP_MAINNET_NETWORK) && process.env.REACT_APP_MAINNET_MINT_CONTRACT_ADDRESS
    )
    
    this.context.updateAccountInfo({MultivariaInstance: this.MultivariaInstance})
    this.context.updateAccountInfo({MultivariaMintInstance: this.MultivariaMintInstance})
    this.getContractData();
    this.context.updateAccountInfo({instancesLoaded: true})
  }

  async setNetwork(){
      let networkId = await this.web3.eth.getChainId();
      this.context.updateAccountInfo({networkId: networkId})
  }

  async getContractData(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({ALMintOpened: await this.MultivariaMintInstance.methods._ALMintOpened().call()})
      this.context.updateAccountInfo({publicMintOpened: await this.MultivariaMintInstance.methods._publicMintOpened().call()})
      this.context.updateAccountInfo({publicPrice: parseInt(await this.MultivariaMintInstance.methods._publicPrice().call())})
      this.context.updateAccountInfo({collectorPrice: parseInt(await this.MultivariaMintInstance.methods._collectorPrice().call())})
      this.context.updateAccountInfo({editionsLeft: parseInt(await this.MultivariaInstance.methods._editionsLeft().call())})
    }
  }

  async getAccountsData(account){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({walletETHBalance: await this.web3.eth.getBalance(this.context.account)});
      let signedMessage = await this.findSignedMessageAL(account);
      this.context.updateAccountInfo({signedMessage: signedMessage})
      let collectorSignedMessage = await this.findCollectorSignedMessageAL(account);
      this.context.updateAccountInfo({collectorSignedMessage: collectorSignedMessage})
      this.context.updateAccountInfo({ALTokensMinted: parseInt(await this.MultivariaMintInstance.methods._ALTokensMinted(this.context.account).call())})
      this.context.updateAccountInfo({publicTokenMinted: parseInt(await this.MultivariaMintInstance.methods._publicTokenMinted(this.context.account).call())})
      // this.context.updateAccountInfo({potentialBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '105845931096682572427946598072662762270254995660517606353266006696358429327361').call())})
      // this.context.updateAccountInfo({controlBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '105845931096682572427946598072662762270254995660517606353266006697457940955143').call())})
      // this.context.updateAccountInfo({shadowBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '105845931096682572427946598072662762270254995660517606353266006698557452582926').call())})
      // this.context.updateAccountInfo({integrateBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '1').call())})
      // this.context.updateAccountInfo({reverieBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '2').call())})
      // this.context.updateAccountInfo({gratitudeBalance: parseInt(await this.OSContractInstance.methods.balanceOf(account, '3').call())})
  
    }
  }

  async setAccount(){
    if(this.context.networkId !== null){
      let accounts = await this.web3.eth.getAccounts();
      await this.context.updateAccountInfo({account: accounts[0]});
      if(this.context.account) this.getAccountsData(accounts[0])
    }else{
      this.resetAccountData();
    }
  }

  resetAccountData(){
    this.context.updateAccountInfo({
      account: null,
    })
  }

  async connectWallet(){
    this.context.updateAccountInfo({transactionInProgress: true})
    try{
      window.ethereum.enable()
    }catch(error){
      console.log(error)
    }
    this.context.updateAccountInfo({transactionInProgress: false})
  }

  getAccountStr(account){
    let response = account.slice(0, 5) +  '...' + account.substring(account.length - 2)
    return response
  }

  renderUserInterface(){
    if(!this.context.account){
      if(window.ethereum || window.web3){
        return <Button className="connect_button" variant="outline-light" onClick={() => this.connectWallet()}>Connect</Button>
      }else{
        return <div>No wallet detected</div>
      }
    }else if(parseInt(this.context.networkId) !== parseInt(process.env.REACT_APP_MAINNET_NETWORK)){
      console.log(this.context.networkId)
      return <p style={{color: 'white'}}>Please connect to {parseInt(this.context.networkId) === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ? "Ethereum Mainnet" : "the GOERLI Network"}</p>
    }else return <p className="mt-3 connexion_info">Connected as {this.context.account}</p>
  }

  async findSignedMessageAL(account){
    let signedMessage = null
    for(let i=0;i<AL.length;i++){
      let key = Object.keys(AL[i])[0]
      if(key.toLowerCase() === account.toLowerCase()){
        signedMessage = AL[i][key]
      }
    }
    return signedMessage
  }

  async findCollectorSignedMessageAL(account){
    let signedMessage = null
    for(let i=0;i<collectorAL.length;i++){
      let key = Object.keys(collectorAL[i])[0]
      if(key.toLowerCase() === account.toLowerCase()){
        signedMessage = collectorAL[i][key]
      }
    }
    return signedMessage
  }

  render() {
    if(window.ethereum || window.web3){
      if(this.web3){
        window.ethereum.on('accountsChanged', async () => {
          await this.setAccount()
        })
        window.ethereum.on('chainChanged', async () => {
          await this.setNetwork();
          await this.setAccount();
        });
      }
    }
    return this.renderUserInterface()
  }
  
}


export default Connect;
