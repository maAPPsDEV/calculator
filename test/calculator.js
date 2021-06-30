const Machine = artifacts.require("Machine");
const Calculator = artifacts.require("Calculator");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Calculator", function ([_owner]) {
  let machine;
  let calculator;

  beforeEach(async function () {
    machine = await Machine.new();
    calculator = await Calculator.new();
  });

  it("should call", async function () {
    const result = await machine.addValuesWithCall(calculator.address, 1, 2);
    expect(result.receipt.status).to.be.equal(true);
    expect(result.logs[0].args._signature).to.be.equal(
      web3.eth.abi.encodeFunctionCall(
        {
          name: "add",
          type: "function",
          inputs: [
            {
              type: "uint256",
              name: "a",
            },
            {
              type: "uint256",
              name: "b",
            },
          ],
        },
        [1, 2],
      ),
    );
    const log = web3.eth.abi.decodeLog(
      [
        { type: "address", name: "txOrigin", indexed: true },
        { type: "address", name: "msgSenderAddress", indexed: true },
        { type: "address", name: "_this", indexed: true },
        { type: "uint256", name: "calculateResult" },
      ],
      result.receipt.rawLogs[1].data,
      result.receipt.rawLogs[1].topics.slice(1),
    );
    expect(log.txOrigin).to.be.equal(_owner);
    expect(log.msgSenderAddress).to.be.equal(machine.address);
    expect(log._this).to.be.equal(calculator.address);
    expect(log.calculateResult).to.be.equal("3");
    expect(await machine.calculateResult()).to.be.bignumber.equal(new BN(0));
    expect(await machine.user()).to.be.equal(ZERO_ADDRESS);
    expect(await machine.calculator()).to.be.equal(ZERO_ADDRESS);
    expect(await calculator.calculateResult()).to.be.bignumber.equal(new BN(3));
    expect(await calculator.user()).to.be.equal(machine.address);
    expect(await calculator.calculator()).to.be.equal(calculator.address);
    expect(await calculator.consecutiveCalls()).to.be.bignumber.equal(new BN(1));

    const consecutiveCalls = await web3.eth.getStorageAt(machine.address, 3);
    expect(consecutiveCalls).to.be.equal("0x0");
  });

  it("should delegatecall", async function () {
    const result = await machine.addValuesWithDelegateCall(calculator.address, 1, 2);
    expect(result.receipt.status).to.be.equal(true);
    expect(result.logs[0].args._signature).to.be.equal(
      web3.eth.abi.encodeFunctionCall(
        {
          name: "add",
          type: "function",
          inputs: [
            {
              type: "uint8",
              name: "a",
            },
            {
              type: "uint8",
              name: "b",
            },
          ],
        },
        [1, 2],
      ),
    );
    const log = web3.eth.abi.decodeLog(
      [
        { type: "address", name: "txOrigin", indexed: true },
        { type: "address", name: "msgSenderAddress", indexed: true },
        { type: "address", name: "_this", indexed: true },
        { type: "uint256", name: "calculateResult" },
      ],
      result.receipt.rawLogs[1].data,
      result.receipt.rawLogs[1].topics.slice(1),
    );
    expect(log.txOrigin).to.be.equal(_owner);
    expect(log.msgSenderAddress).to.be.equal(_owner);
    expect(log._this).to.be.equal(machine.address);
    expect(log.calculateResult).to.be.equal("3");
    expect(await machine.calculateResult()).to.be.bignumber.equal(new BN(3));
    expect(await machine.user()).to.be.equal(_owner);
    expect(await machine.calculator()).to.be.equal(machine.address);
    expect(await calculator.calculateResult()).to.be.bignumber.equal(new BN(0));
    expect(await calculator.user()).to.be.equal(ZERO_ADDRESS);
    expect(await calculator.calculator()).to.be.equal(ZERO_ADDRESS);
    expect(await calculator.consecutiveCalls()).to.be.bignumber.equal(new BN(0));

    const consecutiveCalls = await web3.eth.getStorageAt(machine.address, 3);
    expect(consecutiveCalls).to.be.equal("0x01");
  });
});
