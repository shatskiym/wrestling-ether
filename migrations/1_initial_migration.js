var Migrations = artifacts.require("./Migrations.sol");
var Wrestling = artifacts.require("./Wrestling.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Wrestling);
};
