import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import Connect from './Components/Connect';
import Home from './Components/Home';
import Mint from './Components/Mint';
// import Shift from './Components/Shift';
// import ConnexionStatus from './Components/ConnexionStatus';
import AccountInfoProvider from './Context/AccountInfo';
import {Routes,Route} from "react-router-dom";
import './App.css'
// import Connect from './Components/Connect';

function App() {
  return (
          <AccountInfoProvider>
              {/* <NavigationBar/> */}
            {/* <div className="background d-flex align-items-center justify-content-center" style={{backgroundImage: `url(${background})`,}}> */}
            <div className="background d-flex align-items-center justify-content-center">
              <div className="App d-flex align-items-center justify-content-center">
                <Container fluid className="d-flex flex-column align-items-center justify-content-center" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Row id='App_row' className="d-flex align-items-center justify-content-center" style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <Col className="d-flex align-items-center justify-content-center" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Routes>
                          <Route path="/" element={<Home/>}/>
                          <Route path="/mint" element={<Mint/>}/>
                          {/* <Route path="/shift" element={<Shift/>} /> */}
                        </Routes>
                      </Col>
                    </Row>
                </Container>
              </div>
            </div>
          </AccountInfoProvider>
  );
}

export default App;