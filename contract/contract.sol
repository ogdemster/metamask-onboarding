//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract hello{

    string public ata = "";

    function helloWorld() public view returns (string memory){
        return ata;
    }

    function writeNewHello(string memory newAta) public {
        ata= newAta;
    }
}