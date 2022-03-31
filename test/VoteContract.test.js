const { expect } = require("chai");
const { ethers } = require("hardhat");
const {isCallTrace} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")

describe("Voting Contract", function() {
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let Voting;
    let voting;

    beforeEach(async function(){
        [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("VoteContract", owner);
        voting = await Voting.deploy();
        await voting.deployed();
        console.log(voting.address);
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

        // Контракт должен быть размещен
        it("should be deployed", async function () {
            expect(voting.address).to.be.properAddress;
        })

        // owner должен быть правильно назначен
        it("should set the right owner", async function () {
            expect(await voting.owner()).to.equal(owner.address);
        })
    })


    describe("Creating Voting", function (){

        // Owner может создавать голосования
        it("should be possible to create voting by owner", async function () {
            const tx = await voting.connect(owner).addVoting([addr1.address, addr2.address]);
            await tx.wait();
        })

        // Не owner не может создавать голосования
        it("should be impossible to create voting by non owner", async function(){
            await expect(
                voting.connect(addr1).addVoting([addr1.address, addr2.address])
              ).to.be.revertedWith("You are not owner");
        })

        // Возможно создать одновременно несколько голосований
        it("should be possible to create multiple votings", async function () {
            const tx1 = await voting.connect(owner).addVoting([addr1.address, addr2.address]);
            const tx2 = await voting.connect(owner).addVoting([addr3.address, addr4.address]);
            await tx1.wait();
            await tx2.wait();
        })

        // it("should be possible to get voting info", async function(){
        // const tx = await voting.connect(owner).addVoting([addr1.address, addr2.address]);
        // await tx.wait();
        // let info;
        // info = await voting.getVotingInfo("0");
        // console.log(info);
        // })
        

    })


    describe("Vote for candidate", function () {

    })


    describe("Finish Voting", function () {
        // it("should be impossible to finish voting before time ends", async function () {
        //     const tx = await voting.connect(owner).addVoting([addr1.address, addr2.address]);
        //     await expect(
        //         voting.finishVoting("0")
        //       ).to.be.revertedWith("Time not passed!");
        // })
    })


    describe("Withdraw Comission", function () {

        // Невозможно вывести ноль
        it("should be impossible to withdraw if there is nothing to withdraw", async function () {
            await expect(
                voting.connect(owner).withdrawComission()
              ).to.be.revertedWith("Nothing to withdraw");
        })
        
        // Невозможен вывод на не owner
        it("should be impossible to withdraw for not owner", async function () {
            await expect(
                voting.connect(addr1).withdrawComission()
              ).to.be.revertedWith("You are not owner");
        })

        // возможен вывод на owner
        it("should be possible to withdraw for owner", async function () {
            // создаем голосование
            const tx = await voting.connect(owner).addVoting([addr1.address, addr2.address]);
            // голосуем

            // завершаем голосование

            // выводим комиссию
            // await expect(
            //     voting.connect(owner).withdrawComission()
            //   ).to.be.revertedWith("Nothing to withdraw");
            
        })
    })    
})
