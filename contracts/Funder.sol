pragma solidity >=0.4.22 <0.9.0;

contract Funder {
    uint256 public numOfFunders;

    mapping(uint256 => address) private funders;

    receive() external payable {}

    function transfer() external payable {
        funders[numOfFunders] = msg.sender;
    }

    function withdraw(uint256 withdrawAmount) external {
        require(
            withdrawAmount <= 2000000000000000000,
            "Cannot withdraw more than 2 ether"
        );
        payable(msg.sender).transfer(withdrawAmount);
    }
}
// goerli:
//  transaction hash:    0x174c8caa288a10e013fae91e54babc19d8994699e5f5a2f02a0c06ce6b306a2b
// contract address:    0xB87fc2F529d34Fd9633B736F964AFeD9F68665f0
