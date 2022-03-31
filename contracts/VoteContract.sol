// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract VoteContract {

    address private owner;

    // Проверка на owner
    modifier ownerOnly() {
        require(msg.sender == owner, "You are not owner");
        _;
    }

    // Структура для голосований
    struct Voting {
        mapping (uint=>Candidate) candidates;
        uint candidatesNum;
        mapping (address=>Voter) voters;
        uint votersNum;
        uint balance;
        uint comission;
        bool finished;
        uint endTime; // block.timestamp
    }

    // Структура для голосующих
    struct Voter {
        address voterAddr;
        bool voted;
    }

    // Структура для кандидатов
    struct Candidate{
        address candidateAddr;
        uint votes;
    }

    // Число голосований
    uint private numVotings = 0;

    // Хранение голосований
    mapping (uint => Voting) public votings;

    constructor(){
        owner = msg.sender;
    }

    // Создание голосования с передачей списка кандидатов
    //["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]
    //["0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", "0x617F2E2fD72FD9D5503197092aC168c91465E7f2"]
    function addVoting(address[] memory candidatesAddr) public ownerOnly returns(uint votingID) {
        votingID = numVotings++;
        Voting storage v = votings[votingID];
        for (uint i=0; i<candidatesAddr.length; i++){
            v.candidates[i] = Candidate({candidateAddr: candidatesAddr[i], votes:0});
        }
        v.endTime = block.timestamp;
        v.finished = false;
        v.balance = 0;
        v.votersNum = 0;
        v.candidatesNum = candidatesAddr.length;
    }

    // Голосование
    // Любой user выбирает ID голосования и адрес кандидата
    function vote(uint votingID, address candidateAddr) public payable{
        Voting storage v = votings[votingID];
        Voter storage sender = votings[votingID].voters[msg.sender];
        // Проверка суммы (больше 0.01 ETH)
        require(msg.value>=10000000000000000, "Payment must be 0.01 ETH");
        // Проверка уже голосовал
        require(!sender.voted, "Already voted!");
        // Учет голоса
        for (uint i=0; i<v.candidatesNum; i++){
            if (v.candidates[i].candidateAddr == candidateAddr){
                v.candidates[i].votes++;
            }
        }
        sender.voted = true;
        v.votersNum++;
        v.balance += msg.value;
    }


    // Получить информацию о голосовании по ID голосования
    function getVotingInfo(uint votingID) public view returns(address){
        Voting storage v = votings[votingID];
        address[] memory candidatesAddr;
        for(uint i=0; i<v.candidatesNum; i++){
            candidatesAddr[i] = (v.candidates[i].candidateAddr);
        }
        return v.candidates[0].candidateAddr;
    }

    
    // Завершение голосования
    function finishVoting(uint votingID) public payable {
        Voting storage v = votings[votingID];
        // проверка длительности голосования
        require(v.endTime-block.timestamp > 259200, "Time not passed!");
        // проверка количества проголосовавших
        require(v.votersNum>0, "Nobody voted!");
        // завершение голосования
        v.finished = true;
        // начисление вознаграждения
        address winner = v.candidates[0].candidateAddr;
        uint resultVotes = 0;
        for (uint i=0; i<v.candidatesNum; i++){
            if (v.candidates[i].votes > resultVotes){
                resultVotes = v.candidates[i].votes;
                winner = v.candidates[i].candidateAddr;
            }
        }
        address payable _to = payable(winner);
        v.comission = v.balance/10;
        _to.transfer(v.balance-v.comission);
        v.balance = 0;
    }


    // Вывод комиссий на счет owner
    function withdrawComission() public payable ownerOnly{
        address payable _to = payable(owner);
        uint amount = 0;
        for (uint i=0; i<numVotings; i++){
            Voting storage v = votings[i];
            if (v.finished){
                amount += v.comission;
                v.comission = 0;
            }
        }
        require(amount>0, "Nothing to withdraw!");
        _to.transfer(amount);
    }
}
