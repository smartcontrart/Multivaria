import React, { Component, createContext } from 'react';

export const AccountInfoContext = createContext();

class AccountInfoProvider extends Component {
    state = {
        account: null,
        transactionInProgress: false,
        userFeedback: null,
        walletETHBalance: 0,
        ALTokensMinted:0,
        publicTokenMinted: 0,
        signedMessage: null,
        ALMintOpened: false,
        publicMintOpened: false
    }

    updateAccountInfo = (updatedData) =>{
        for (const [key, value] of Object.entries(updatedData)) {
            this.setState(prevState=>({
                ...prevState,
                [key]: value
            }))
        }
    }

    render(){
        return(
            <AccountInfoContext.Provider 
                value={{
                    ...this.state, 
                    updateAccountInfo: this.updateAccountInfo,
                    }}>
                {this.props.children}
            </AccountInfoContext.Provider>
        )
    }

}
export default AccountInfoProvider;