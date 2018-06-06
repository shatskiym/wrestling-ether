pragma solidity ^0.4.4;


contract Wrestling {

  address public wrestler1;
  address public wrestler2;

  bool public wrestler1Played;
  bool public wrestler2Played;

  uint public wrestler1Deposit;
  uint public wrestler2Deposit;

  bool public gameFinished;

  address public theWinner;

  uint gains;

  event WrestlingStartsEvent (address wrestler1, address wrestler2);

  event EndOfRoundEvent (uint wrestler1Deposit, uint wrestler2Deposit);

  event EndOfWrestlingEvent (address winner, uint gains);

  function registerAsWrestler1() public {
    wrestler1 = msg.sender;
  }

  function registerAsWrestler2() public {
    require((wrestler2 == address(0)) && (msg.sender != wrestler1));

    wrestler2 = msg.sender;

    emit WrestlingStartsEvent(wrestler1, wrestler2);
  }

  function wrestle() public payable {
    require(!gameFinished && (msg.sender == wrestler1 || msg.sender == wrestler2));

    if (msg.sender == wrestler1) {
      require(wrestler1Played == false);
      wrestler1Deposit += msg.value;
      wrestler1Played = true;
    } else {
      require(wrestler2Played == false);
      wrestler2Deposit += msg.value;
      wrestler2Played = true;
    }

    if (wrestler1Played && wrestler2Played) {
      if (wrestler1Deposit >= wrestler2Deposit * 2) {
        endOfGame(wrestler1);
      } else if (wrestler2Deposit >= wrestler1Deposit * 2) {
        endOfGame(wrestler2);
      } else {
        endOfRound();
      }
    }
  }

  function endOfRound() internal {
    wrestler1Played = false;
    wrestler2Played = false;

    emit EndOfRoundEvent(wrestler1Deposit, wrestler2Deposit);
  }

  function endOfGame(address winner) internal {
    gameFinished = true;
    theWinner = winner;

    gains = wrestler1Deposit + wrestler2Deposit;

    emit EndOfWrestlingEvent(winner, gains);
  }

  function withdraw() public {
    require(gameFinished && theWinner == msg.sender);

    uint amount = gains;

    gains = 0;

    msg.sender.transfer(amount);
  }
}
