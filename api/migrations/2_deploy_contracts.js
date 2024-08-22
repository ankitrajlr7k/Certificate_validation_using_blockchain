// migrations/2_deploy_contracts.js

const MyContract = artifacts.require("CertificateStorage");

export default function (deployer) {
  deployer.deploy(MyContract);
}
