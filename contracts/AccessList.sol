// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract AccessList {
    Call target;
    uint value;

    constructor(Call _addr) {
        target = _addr;
    }

    function sstore(uint256 _value) public {
        value = _value;
    }

    function callSSTORE(uint _value) public {
        target.sstore(_value);
    }

    // removed the view for testing
    function callSLOAD() public returns (uint) {
        return target.sload();
    }
}

contract Call {
    uint value = 1;

    function sstore(uint _value) public {
        value = _value;
    }

    function sload() public view returns (uint) {
        return value;
    }
}

contract CallDeploy {
    constructor(Call _addr) {
        _addr.sstore(5);
    }
}
