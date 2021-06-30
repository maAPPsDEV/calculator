const Machine = artifacts.require("Machine");

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Machine);
};
