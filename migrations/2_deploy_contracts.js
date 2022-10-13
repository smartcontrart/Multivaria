var Multivaria = artifacts.require("./Multivaria.sol");
var MultivariaMint = artifacts.require("./MultivariaMint.sol");
var OSContract = artifacts.require("./OSContract.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Multivaria);
  await deployer.deploy(MultivariaMint);
  await deployer.deploy(OSContract);
};
