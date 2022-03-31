const { expect } = require("chai");
const { ethers } = require("hardhat");
const {isCallTrace} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")

describe("Voting Contract", function() {
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let Voting;
    let voting;

    beforeEach(async function(){
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        Voting = await ethers.getContractFactory("VoteContract");
        //[owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        //[owner, acc1, acc2, acc3] = await ethers.getSigners();
        //const VotingContract = await ethers.getContractFactory("VoteContract", owner);
        voting = await Voting.deploy();
        await voting.deployed();
    })

    // async function vote(contractID, ){
    //     const amount = 10000000000000000
    //     const txData = {
    //         to: acc1,
    //         value: amount
    //     }
    //     const tx = await sender.sendTransaction(txData)
    //     await tx.wait();
    //     return [tx, value]
    // }

    describe("Deployment", function () {

        it("should be deployed", async function () {
            expect(voting.address).to.be.properAddress;
        })

        it("should set the right owner", async function () {
            expect(await voting.owner()).to.equal(owner.address);
        })

        it("should be possible to create voting by owner", async function(){
            const tx = await hardhatVoting.addVoting(addr1,addr2)
            await tx.wait()

        })
    })
})
    // it("should be impossible to create voting by non owner", async function(){
    //     const tx = await voting.addVoting(acc2,acc3)
    //     await tx.wait()
    //   })

    // it("should be possible to vote", async function(){
    //     const tx = await voting.addVoting(acc2,acc3)
    //     await tx.wait()
    //   })

    // it("should be possible to finish voting ", async function(){
    //     const tx = await voting.addVoting(acc2,acc3)
    //     await tx.wait()
    //   })

    // it("should be possible to get voting info", async function(){
    //     const tx = await voting.addVoting(acc2,acc3)
    //     await tx.wait()
    //   })

    // it("should be possible to withdraw comission after voting", async function(){
    //     const tx = await voting.addVoting(acc2,acc3)
    //     await tx.wait()
    //   })
