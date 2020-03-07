# BlockchainManager
  A simple electron app to create a blockchain, and to add nodes to contribute towards the blockchain. The hashing algorithm used is SHA-256.
  
## [Releases](https://github.com/t348575/BlockchainManager/releases)

## Configuration and use:
   1) Provide a key to be used during communication between nodes
   2) Set port and multicast address (better to leave as default)
   3) Use 'Find new nodes' on the 'Manage nodes' page to find and add new nodes
   4) Once the nodes have successfully connected, add blocks to the chain, and the chain should get transmited to all nodes

## Todo:
   - [ ] Create seperate API for blockchain tasks
   - [ ] Use web worker threads were possible
   - [ ] Use node C++ addons instead of using [BasicBlockChain](https://github.com/t348575/BasicBlockChain)
   - [ ] Verify blocks upon being recieved
