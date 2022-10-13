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

    // const [price, setPrice] = useState(1)

    async function handleShift(type){
        
           
        try{
            await accountInfo.MultivariaInstance.methods.shift().send({from: accountInfo.account, gasLimit: 200000});
            displayAlert('Shift successful!', 'success')
            accountInfo.updateAccountInfo({publicTokenMinted: parseInt(await accountInfo.MultivariaMintInstance.methods._publicTokenMinted(accountInfo.account).call())})
        }catch(error){
            displayAlert(error.message, 'warning')
        }
        accountInfo.updateAccountInfo({userFeedback: null})
    }

    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
    }


    function renderUserInterface(){

        if(!window.ethereum || !accountInfo.account){
            return null
        }else{
            return(
                <Container>
                    <Row>
                        <Col className="d-flex align-items-center justify-content-center m-2">
                            <Button variant="light" style={{width: '150px'}} onClick={()=>handleShift('private')}>{`Shift`}</Button>
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
            return <div>AL mint opened<br/>Public mint opens on 10/16</div>
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


