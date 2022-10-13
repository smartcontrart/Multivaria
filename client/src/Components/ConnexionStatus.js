import React from "react";

function ConnexionStatus() {
        return(
            <>
                <span className='connexion_info'>Contract address <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS}>{process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS}</a></b></span><br/>
                <span className='connexion_info'>Mint Contract address <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_MINT_CONTRACT_ADDRESS}>{process.env.REACT_APP_MAINNET_MINT_CONTRACT_ADDRESS}</a></b></span>
            </>
        )
}

export default ConnexionStatus;