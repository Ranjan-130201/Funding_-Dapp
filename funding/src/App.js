import React,{useEffect,useState} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import {loadContract} from './utils/load-contract';

function App() {
  const [web3Api,setWebApi]= useState({
    provider: null,
    web3:null,
    contract: null,
  });
  console.log(web3Api)
  const [account,setAccount]= useState(null);
  const [balance,setBalance]= useState(null);
  const [reload,setReload]= useState(null);
  const [ammount,setAmmount]= useState(null);

  
  const reloadEffect=()=>setReload(!reload);
  useEffect(()=>{
    const loadProvider= async()=>{
      const provider = await detectEthereumProvider();
      const contract= await loadContract('Funder',provider)
      if(provider){
        provider.request({method:'eth_requestAccounts'})
        setWebApi({
              web3: new Web3(provider),
              provider,
              contract
            })
      }else {
        console.error('Please install MetaMask!')
      }

    }; 
    loadProvider();
  },[])

  useEffect(()=>{
    const changeNetwork=async ()=>{
    await web3Api.provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x5' }],
    });
  }
  web3Api.web3 && changeNetwork();
  });

    useEffect(()=>{
      const loadBalance=async()=>{
        const {contract,web3}= web3Api;
        const balance= await web3.eth.getBalance(contract.address);
        setBalance(web3.utils.fromWei(balance,"finney"));
      };
      web3Api.contract && loadBalance();
    },[web3Api,reload]);

    useEffect(()=>{
      const getAccount= async()=>{
        const accounts= await web3Api.web3.eth.getAccounts()
        setAccount(accounts[0])
      }
      web3Api.web3 && getAccount();
    },[web3Api.web3]);

    const transferFunds= async()=>{
    const {web3,contract}=web3Api;
    await contract.transfer({
      from: account,
      value:web3.utils.toWei("2","micro"),
    });
    reloadEffect();
    }
    const handleChangeammount=(e)=>{
      try{
      setAmmount(e.target.value);
      
      }catch(e){
          console.log("error in ammount",e)
      }
  }
    const WithdrawFund= async()=>{
      try {
      const {contract,web3}=web3Api;
     
        const WithdrawAmt= await web3.utils.toWei(ammount,"micro");
   
      await contract.withdraw(WithdrawAmt,{
        from:account
      });
    }catch(e){
      alert("minimum withdraw of 2 ethers",e)
    }
      reloadEffect();
    }
  return (
    <>
      <div class="card text-center">
        <div class="card-header">Funding</div>
        <div class="card-body">
          <h5 class="card-title">Balance: {balance} micro ETH </h5>
          <p class="card-text">
            Account : {account? account.substring(0,5)+'...'+account.substring(38,42):'not Connected'}
          </p>
          &nbsp;
          <button type="button" class="btn btn-success " onClick={transferFunds}>
            Transfer
          </button>
          &nbsp;
          <div style={{display:'flex',justifyContent:"center"}}>
          <input type="text" placeholder='Enter the value to withdraw' 
          id="ammount"
          name="ammount"
          onChange={handleChangeammount}
          value={ammount}
          style={{width:"30%",height:"30px",margin:"10px 0 25px",display:"block"}}/>
          </div>
          <button type="button" class="btn btn-primary " onClick={WithdrawFund}>
            Withdraw
          </button>
        </div>
        <div class="card-footer text-muted"><p>Minimum transfer of 2 micro eth</p>
                                            <p>Max withdraw of 2 eth</p>
                                            <p>Network: Goerli</p>
        </div>
      </div>
    </>
  );
}

export default App;
