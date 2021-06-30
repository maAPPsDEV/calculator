const Calculator = artifacts.require("Calculator");

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Calculator);
};
