import React, { Component, createContext } from 'react';

export const ContractInfoContext = createContext();

class ContractInfoProvider extends Component {
    state = {
        
    }

    updateContractInfo(updatedData){
        for (const [key, value] of Object.entries(updatedData)) {
            this.setState(prevState=>({
                ...prevState,
                [key]: value
            }))
        }
    }

    render(){
        return(
            <ContractInfoContext.Provider 
            value={{
                ...this.state, 
                updateContractInfo: this.state.updateContractInfo,
                }}>
                {this.props.children}
            </ContractInfoContext.Provider>
        )
    }

}
export default ContractInfoProvider;