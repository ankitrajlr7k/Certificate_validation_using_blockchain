// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateStorage {
    mapping(bytes32 => bool) private certificateHashes;

    event CertificateHashStored(bytes32 indexed hash);

    function storeCertificateHash(bytes32 hash) public {
        //require(!certificateHashes[hash], "Certificate hash already exists");
        certificateHashes[hash] = true;
        emit CertificateHashStored(hash);
    }

    function verifyCertificateHash(bytes32 hash) public view returns (bool) {
        return certificateHashes[hash];
    }
}
