import React from "react";
import { Link } from "react-router-dom";
import {Container, Row, Col, Button} from 'react-bootstrap'
import multivaria_header from '../images/MULTIVARIA HEADER.png'
import drop_header from '../images/THE DROP.png'
import shift_header from '../images/SHIFT HEADER.png'
import tier12 from '../images/tier12.mp4'
import shift from '../images/shift.mp4'

import '../App.css'

function Home() {

    function renderMintLink(){
            return(
                <Button id="mint_button"><Link to='/mint' style={{textDecoration: 'none', color: 'black'}}>Go To Mint Page</Link></Button>
            )
    }

    return ( 
        <Container style={{minHeight: '80vh'}} className='d-flex flex-column justify-content-center'>
            <Row xs={12} className='mt-5 mb-3'>
                <Col>
                    <h1 className="mb-3"><img className="header" src={multivaria_header} alt='multivaria_header'></img></h1>
                    <p>A mystery box drop and expansion of the METAVARIA Collections</p>
                    <p>Art and Music by Mike Neff<br/>Mechanism by Smartcontrart</p>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <h1 className=""><img className="header" src={drop_header} alt='mint_header' width="500"></img></h1>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <video
                    className="video"
                        autoPlay
                        loop
                        muted
                        playsInline>
                        <source 
                        src={tier12} 
                        type="video/mp4"
                        />
                    </video>
                </Col>
            </Row>
            <Row className="">
                <Col>
                    <p><i>IDOLOCENE</i></p>
                    <p>IDOLOCENE is the metavarium you will begin with.</p>
                    <p>200 Editions</p>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <video
                    className="video"
                        autoPlay
                        loop
                        muted
                        playsInline>
                        <source 
                        src={shift} 
                        type="video/mp4"
                        />
                    </video>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <p> <i>SHIFT CARD</i></p>  
                    <p>Each edition of IDOLOCENE comes with a SHIFT CARD.<br/>
                    You can mint up to 2 of these sets at each minting phase you are eligible for.</p>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col xs={12}>
                    <p>2 Phases:</p>
                </Col>
                <Col xs={12} lg={3}></Col>
                <Col xs={12} lg={3}>
                    <p><u>Private Sale</u></p>
                    <p>Metavaria Collectors and Allow List</p>
                    <p><i>October 12th, 4PM EST</i></p>
                </Col>
                <Col xs={12} lg={3}>
                    <p><u>Public Sale</u></p>
                    <p>Everyone</p>
                    <p><i>October 14th, 4PM EST</i></p>
                </Col>
                <Col xs={12} lg={3}></Col>
                <hr style={{maxWidth: '200px'}}></hr>
            </Row>
            <Row>
                <Col xs={12} className='mt-4'>
                    <p>Price</p>
                </Col>
                <Col xs={12} lg={3}></Col>
                <Col xs={12} lg={3}>
                    <p>Metavaria Collectors:<br/> 0.05 ETH</p>
                </Col>
                <Col xs={12} lg={3}>
                    <p>Public and Allow List:<br/> 0.08 ETH</p>
                </Col>
                <Col xs={12} lg={3}></Col>
            </Row>
            <Row xs={12} className='my-5'>
                <Col xs={12} lg={3}></Col>
                <Col xs={12} lg={6}>
                    <h1 className="mb-3"><img className="header" src={shift_header} alt='shift_header' width="500"></img></h1>
                    <p>The SHIFT phase is the art reveal.</p>
                    <p>SHIFT by fusing your IDOLOCENE and SHIFT CARD on this website. This will cause a temporal shift within the enclosure displayed by your nft.</p>
                    <p>The new metavarium that drops into your wallet will be determined randomly. The edition size of your new NFT will fall somewhere between 50 editions and 2 editions.</p>
                    <p>SHIFT ON NOVEMBER 16<br/>Price of gas only</p>

                </Col>
                <Col xs={12} lg={3}></Col>
            </Row>
            <Row className="mb-5">
                <Col>
                    {renderMintLink()}
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                Follow us on Twitter:<br/> <a style={{color: 'white'}} href='https://twitter.com/mkeneff'>Mike Neff</a><br/> <a style={{color: 'white'}} href='https://twitter.com/SmartContrart'>Smartcontrart</a>
                </Col>
            </Row>
        </Container>
     );
}

export default Home;


