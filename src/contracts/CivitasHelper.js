import web3 from '@/js/web3';
const address = '0x5066352f9C0872ce6f55e288b7E2ee1b7C7C864A';
const abi =
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "accountManagerAddress",
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
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "AccountManagerUpdated",
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
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes21",
				"name": "nip",
				"type": "bytes21"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeLinked",
				"type": "uint256"
			}
		],
		"name": "CivitasAccountLinked",
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
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUnlinked",
				"type": "uint256"
			}
		],
		"name": "CivitasAccountUnlinked",
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
				"internalType": "bytes21",
				"name": "nip",
				"type": "bytes21"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "CivitasCreated",
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
				"internalType": "bytes21",
				"name": "oldNIP",
				"type": "bytes21"
			},
			{
				"indexed": false,
				"internalType": "bytes21",
				"name": "newNIP",
				"type": "bytes21"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "CivitasNIPUpdated",
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
				"internalType": "bytes21",
				"name": "nip",
				"type": "bytes21"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
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
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "CivitasUpdated",
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
				"internalType": "bytes21",
				"name": "nip",
				"type": "bytes21"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeAdded",
				"type": "uint256"
			}
		],
		"name": "DosenAdded",
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
				"internalType": "bytes21",
				"name": "nip",
				"type": "bytes21"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "DosenStatusChanged",
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
				"name": "account",
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
				"internalType": "uint256",
				"name": "timeLinked",
				"type": "uint256"
			}
		],
		"name": "MahasiswaAccountLinked",
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
				"name": "account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUnlinked",
				"type": "uint256"
			}
		],
		"name": "MahasiswaAccountUnlinked",
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
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "prodi",
				"type": "bytes"
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
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "MahasiswaCreated",
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
				"name": "oldNIM",
				"type": "bytes12"
			},
			{
				"indexed": false,
				"internalType": "bytes12",
				"name": "newNIM",
				"type": "bytes12"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "MahasiswaNIMUpdated",
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
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
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
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "MahasiswaUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes21",
				"name": "nip",
				"type": "bytes21"
			},
			{
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "ipfsHash",
				"type": "bytes"
			},
			{
				"internalType": "bool",
				"name": "isDosen",
				"type": "bool"
			}
		],
		"name": "createCivitas",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes12",
				"name": "nim",
				"type": "bytes12"
			},
			{
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "ipfsHash",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "prodi",
				"type": "bytes"
			}
		],
		"name": "createMahasiswa",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "dosenAktif",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes21",
				"name": "NIP",
				"type": "bytes21"
			}
		],
		"name": "getCivitas",
		"outputs": [
			{
				"internalType": "bytes21",
				"name": "",
				"type": "bytes21"
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
				"internalType": "bytes12",
				"name": "NIM",
				"type": "bytes12"
			}
		],
		"name": "getMahasiswa",
		"outputs": [
			{
				"internalType": "bytes12",
				"name": "",
				"type": "bytes12"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "getNIMMahasiswa",
		"outputs": [
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
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "getNIPCivitas",
		"outputs": [
			{
				"internalType": "bytes21",
				"name": "",
				"type": "bytes21"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getNIPDosen",
		"outputs": [
			{
				"internalType": "bytes21",
				"name": "",
				"type": "bytes21"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes21",
				"name": "",
				"type": "bytes21"
			}
		],
		"name": "isCivitasExist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes12",
				"name": "",
				"type": "bytes12"
			}
		],
		"name": "isMahasiswaExist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
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
				"internalType": "bytes21",
				"name": "nip",
				"type": "bytes21"
			}
		],
		"name": "linkCivitasAccount",
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
				"name": "nim",
				"type": "bytes12"
			}
		],
		"name": "linkMahasiswaAccount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "unlinkCivitasAccount",
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
			}
		],
		"name": "unlinkMahasiswaAccount",
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
				"internalType": "bytes21",
				"name": "nip",
				"type": "bytes21"
			},
			{
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "newIpfsHash",
				"type": "bytes"
			}
		],
		"name": "updateCivitasData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"name": "updateDosenStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes12",
				"name": "nim",
				"type": "bytes12"
			},
			{
				"internalType": "bytes32",
				"name": "fullName",
				"type": "bytes32"
			},
			{
				"internalType": "bytes",
				"name": "newIpfsHash",
				"type": "bytes"
			}
		],
		"name": "updateMahasiswaData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes12",
				"name": "oldNIM",
				"type": "bytes12"
			},
			{
				"internalType": "bytes12",
				"name": "newNIM",
				"type": "bytes12"
			}
		],
		"name": "updateNIMMahasiswa",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes21",
				"name": "oldNIP",
				"type": "bytes21"
			},
			{
				"internalType": "bytes21",
				"name": "newNIP",
				"type": "bytes21"
			}
		],
		"name": "updateNIPCivitas",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
// THE ABI END HERE
const instance = new web3.eth.Contract(abi, address);

export default instance;
