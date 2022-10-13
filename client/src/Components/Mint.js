import React, {useState, useContext} from "react";
import {Container, Row, Col, Button, Spinner, Alert, Form} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import Connect from "./Connect";
import ConnexionStatus from "./ConnexionStatus";
import background from '../images/background.png'
import mint_header from '../images/MINT HEADER.png'

import '../App.css'

function Mint() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const [privateQuantity, setPrivateQuantity] = useState(0)
    const [publicQuantity, setPublicQuantity] = useState(0)
    // const [price, setPrice] = useState(1)

    async function handleMint(type){
        let isCollector = accountInfo.collectorSignedMessage ? true : false;
        let quantity;
        accountInfo.updateAccountInfo({walletETHBalance: await accountInfo.web3.eth.getBalance(accountInfo.account)})
        if(type === 'public'){
            quantity = publicQuantity
        }else if(type === 'private'){
            quantity = privateQuantity
        }
        if(!quantity || quantity>2 || quantity <1){
            displayAlert(`Please select a valid quantity`, 'warning')
        }else{
            let price = (isCollector && type === 'private') ? accountInfo.collectorPrice : accountInfo.publicPrice
            if(accountInfo.walletETHBalance < quantity * price){
                displayAlert(`You don't have enough ETH to mint, you need ${(price*quantity)/10**18} Eth`, 'warning')
            }else{
                accountInfo.updateAccountInfo({userFeedback: `Minting ${quantity} Multivaria for ${(quantity*price)/10**18} ETH...`})
                if(type === 'public'){
                    try{
                        await accountInfo.MultivariaMintInstance.methods.publicMint(
                            quantity).send({from: accountInfo.account, value: price*quantity});
                        displayAlert('Mint successful!', 'success')
                        accountInfo.updateAccountInfo({publicTokenMinted: parseInt(await accountInfo.MultivariaMintInstance.methods._publicTokenMinted(accountInfo.account).call())})
                    }catch(error){
                        displayAlert(error.message, 'warning')
                    }
                }else{
                    if(isCollector){
                        let signature = accountInfo.collectorSignedMessage
                        try{
                            await accountInfo.MultivariaMintInstance.methods.collectorMint(
                                signature.v, signature.r, signature.s, quantity
                                    ).send({from: accountInfo.account, value: price*quantity});
                            displayAlert('Mint successful!', 'success')
                            accountInfo.updateAccountInfo({ALTokensMinted: parseInt(await accountInfo.MultivariaMintInstance.methods._ALTokensMinted(accountInfo.account).call())})
                        }catch(error){
                            displayAlert(error.message, 'warning')
                        }
                    }else{
                        let signature = accountInfo.signedMessage
                        try{
                            await accountInfo.MultivariaMintInstance.methods.ALMint(
                                signature.v, signature.r, signature.s, quantity
                                    ).send({from: accountInfo.account, value: price*quantity});
                            displayAlert('Mint successful!', 'success')
                            accountInfo.updateAccountInfo({ALTokensMinted: parseInt(await accountInfo.MultivariaMintInstance.methods._ALTokensMinted(accountInfo.account).call())})
      
                        }catch(error){
                            displayAlert(error.message, 'warning')
                        }
                    }
                }
            }
        }
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
    }

    function handleChange(event, type){
        if(type === 'public'){
            setPublicQuantity(event.target.value)
        }else if(type === 'private'){
            setPrivateQuantity(event.target.value)
        }
    }

    function renderQuantityDropdown(type){
        let style = {width: '160px'};
        if(type === 'public'){
            style = {color: 'white', backgroundColor: 'black', width: '160px'}
        }
        return(
            <Form.Select style={style} onChange={(e) => handleChange(e, type)}>
                <option value='invalid'>Quantity to mint</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
            </Form.Select>
        )
    }

    function renderPrivateMint(){
        if(accountInfo.ALTokensMinted >=2){
            if(accountInfo.publicTokenMinted >= 2){
                return null
            }else{
                return <div>Thank you for minting the private sale. You can mint 2 more tokens during the public sale when opened</div>
            }
        }else{
            if(accountInfo.ALMintOpened && (accountInfo.signedMessage || accountInfo.collectorSignedMessage)){
                return (
                    <Row>
                        <Col  xs={{ span: 12, order: 1}} lg={{ span: 6, order: 2}} className='d-flex justify-content-center align-items-center mb-2'>
                            {renderQuantityDropdown('private')}
                        </Col>
                        <Col xs={{ span: 12, order: 2}} lg={{ span: 6, order: 1}} className='mb-2'>
                            <Button variant="light" style={{width: '150px'}} onClick={()=>handleMint('private')}>{`Private Mint`}</Button>
                        </Col>
                    </Row>
                )
            }
        }
    }

    function renderPublicMint(){
        if(accountInfo.publicMintOpened){
            if(accountInfo.publicTokenMinted >= 2){
                return <div>Thank you for minting Multivaria!</div>
            }else{
                return(
                <Row>
                    <Col xs={{ span: 12, order: 1}} lg={{ span: 6, order: 2}} className='d-flex justify-content-center align-items-center mb-2'>
                        {renderQuantityDropdown('public')}
                    </Col>
                    <Col xs={{ span: 12, order: 2}} lg={{ span: 6, order: 1}} className='mb-2'>
                        <Button variant="outline-light" style={{width: '150px'}} onClick={()=>handleMint('public')}>{`Public Mint`}</Button>
                    </Col>
                </Row>
                )
            }
        }
    }

    function renderUserInterface(){

        if(!window.ethereum || !accountInfo.account){
            return null
        }else{
            return(
                <Container>
                    <Row>
                        <Col className="d-flex align-items-center justify-content-center m-2">
                            {renderPrivateMint()}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex align-items-center justify-content-center m-2">
                            {renderPublicMint()}
                        </Col>
                    </Row>
                </Container>
            )
        }
    }

    function renderUserFeedback(){
        if(accountInfo.userFeedback){
            return(
                <React.Fragment>
                    <div>
                        <Spinner animation="grow" variant="light"/>
                    </div>
                    <div>{accountInfo.userFeedback}</div>
                </React.Fragment>
            )
        }
    }

    function renderAlert(){
        if(alert.active){
            return(
            <Col className='m-3'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }

    }

    function renderMintStatus(){
        if(accountInfo.publicMintOpened){
            return <div>Public mint opened</div>
        }else if(accountInfo.ALMintOpened){
            return <div>Collectors and Allow List mint opened. <br/>Public mint opens on 10/16</div>
        }else{
            return <div>Drop currently closed.<br/>Collectors and AL mints open on 10/14<br/>Public mint Open on 10/16</div>
        }
    }

    return ( 
            <Container fluid className='d-flex flex-column justify-content-center mint-background' style={{backgroundImage: `url(${background})`, minHeight: '90vh', paddingLeft: 0, paddingRight: 0, marginLeft: 0, marginRight: 0}}>
                <Row className="mb-4">
                    <Col xs={12}>
                    <h3 className=""><img className="header" src={mint_header} alt='mint_header' width="300"></img></h3>
                    </Col>
                    <Col xs={12}>
                        {renderMintStatus()}
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={12} >
                        <div >
                            <div className="mb-2"><b>Price</b></div>
                            <span>Metavaria collectors: 0.05 ETH</span><br/>
                            <span>Public: 0.08 ETH</span><br/>
                        </div>
                    </Col>
                </Row>
                <Row xs={12} className="d-flex justify-content-center align-items-center">
                    {renderUserInterface()}
                </Row>
                <Row xs={12} className='m-3'>
                    {renderUserFeedback()}
                </Row>
                <Row xs={12} className="Home_row">
                    {renderAlert()}
                </Row>
                <Row className='d-flex justify-content-center align-items-center mb-2'>
                    <Col>
                        <Connect/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ConnexionStatus/>
                    </Col>
                </Row>
            </Container>
     );
}

export default Mint;


