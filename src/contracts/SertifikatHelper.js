import web3 from '@/js/web3';
const address = '0xbbcc6a8176eef067e797ddf7ecda1e095ac06f2f';
const abi =
[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idCertificate",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "assignedSigner",
				"type": "address"
			},
			{
				"internalType": "bytes9",
				"name": "role",
				"type": "bytes9"
			}
		],
		"name": "assignSigner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "accountManagerAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "civitasHelperAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "akademikHelperAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "idCertificate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "asignedSigner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes9",
				"name": "role",
				"type": "bytes9"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeAssigned",
				"type": "uint256"
			}
		],
		"name": "AssignSignerToCertificate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes12",
				"name": "ownerNim",
				"type": "bytes12"
			},
			{
				"indexed": false,
				"internalType": "bytes16",
				"name": "jenisSertifikat",
				"type": "bytes16"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "signedTimes",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "signRequired",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "CertificateCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timePublished",
				"type": "uint256"
			}
		],
		"name": "CertificatePublished",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "signer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes9",
				"name": "role",
				"type": "bytes9"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "signedTimes",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeSigned",
				"type": "uint256"
			}
		],
		"name": "CertificateSigned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "signer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeSigned",
				"type": "uint256"
			}
		],
		"name": "CertificateSignedByOwner",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "newIpfsHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "oldIpfsHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isUpdateNINAData",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "CertificateUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "riwayatId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "semesterId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ampuId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dosenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes21",
				"name": "dosenNip",
				"type": "bytes21"
			},
			{
				"internalType": "bytes2",
				"name": "nilai",
				"type": "bytes2"
			}
		],
		"name": "changeNilaiRiwayatStudi",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bytes12",
				"name": "ownerNim",
				"type": "bytes12"
			},
			{
				"internalType": "bytes16",
				"name": "jenisSertifikat",
				"type": "bytes16"
			},
			{
				"internalType": "uint8",
				"name": "signRequired",
				"type": "uint8"
			},
			{
				"internalType": "bytes",
				"name": "ipfsHash",
				"type": "bytes"
			},
			{
				"internalType": "address[]",
				"name": "signerList",
				"type": "address[]"
			},
			{
				"internalType": "bytes9[]",
				"name": "roleList",
				"type": "bytes9[]"
			}
		],
		"name": "createSertifikat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes17",
				"name": "noIjazah",
				"type": "bytes17"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "IjazahDinomorkan",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "oldAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes2",
				"name": "jenis",
				"type": "bytes2"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "InterfaceUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes12",
				"name": "nim",
				"type": "bytes12"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "isLulus",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "MahasiswaLulusUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "semesterId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ampuId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dosenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes21",
				"name": "dosenNip",
				"type": "bytes21"
			},
			{
				"internalType": "bytes12",
				"name": "mahasiswaNim",
				"type": "bytes12"
			},
			{
				"internalType": "bytes2",
				"name": "nilai",
				"type": "bytes2"
			},
			{
				"internalType": "uint8",
				"name": "sks",
				"type": "uint8"
			}
		],
		"name": "pengisianNilaiMatkul",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes17",
				"name": "noIjazah",
				"type": "bytes17"
			}
		],
		"name": "penomoranIjazah",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			}
		],
		"name": "publishCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes12",
				"name": "nim",
				"type": "bytes12"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ampuId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes2",
				"name": "nilai",
				"type": "bytes2"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "RiwayatCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes2",
				"name": "oldNilai",
				"type": "bytes2"
			},
			{
				"indexed": false,
				"internalType": "bytes2",
				"name": "newNilai",
				"type": "bytes2"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "RiwayatUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes12",
				"name": "NIM",
				"type": "bytes12"
			},
			{
				"internalType": "bool",
				"name": "statusLulus",
				"type": "bool"
			},
			{
				"internalType": "uint8",
				"name": "requiredSKS",
				"type": "uint8"
			}
		],
		"name": "setMahasiswaLulus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes9",
				"name": "role",
				"type": "bytes9"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "signCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "signCertificateByOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAddress",
				"type": "address"
			}
		],
		"name": "updateAccountManager",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAddress",
				"type": "address"
			}
		],
		"name": "updateAkademikHelper",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idCertificate",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "newIpfsHash",
				"type": "bytes"
			},
			{
				"internalType": "bool",
				"name": "isUpdateNINAData",
				"type": "bool"
			}
		],
		"name": "updateCertificateData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAddress",
				"type": "address"
			}
		],
		"name": "updateCivitasHelper",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			}
		],
		"name": "getCertificateOfOwner",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bytes16",
				"name": "",
				"type": "bytes16"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes9",
				"name": "role",
				"type": "bytes9"
			}
		],
		"name": "getCertificateOfSigner",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bytes16",
				"name": "",
				"type": "bytes16"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			}
		],
		"name": "getNomorIjazah",
		"outputs": [
			{
				"internalType": "bytes17",
				"name": "",
				"type": "bytes17"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "ipfsHash",
				"type": "bytes"
			}
		],
		"name": "getPublishedCertificate",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bytes16",
				"name": "",
				"type": "bytes16"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "riwayatId",
				"type": "uint256"
			}
		],
		"name": "getRiwayatStudi",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bytes2",
				"name": "",
				"type": "bytes2"
			},
			{
				"internalType": "bytes12",
				"name": "",
				"type": "bytes12"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes9",
				"name": "role",
				"type": "bytes9"
			}
		],
		"name": "getSignature",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "bytes9",
				"name": "",
				"type": "bytes9"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "ownerSignature",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			},
			{
				"internalType": "bytes9",
				"name": "role",
				"type": "bytes9"
			},
			{
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "verifyCertificate",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "certificateId",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "verifyCertificateOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "signature",
				"type": "bytes"
			}
		],
		"name": "verifySignature",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
];
// THE ABI END HERE
const instance = new web3.eth.Contract(abi, address);

export default instance;