const Wrestling = artifacts.require('./contracts/Wrestling.sol');

contract('Wrestling', function(){
  let wrestling;
  let wrestler1 = web3.eth.accounts[0];
  let wrestler2 = web3.eth.accounts[1];
  let notWrestler = web3.eth.accounts[2];

  beforeEach('Setup contract for each test', async function () {
    // wrestling = await Wrestling.new(owner);
    wrestling = await Wrestling.new();
  });

  // it('has an owner', async function() {
    // assert.equal(await fundRaise.owner(), owner);
  // });

  it('First Wrestler Initialized Correct', async function() {
    await wrestling.registerAsWrestler1({from: wrestler1});
    assert.equal(await wrestling.wrestler1(), wrestler1);
  });

  it('Second Wrestler Initialized Correct', async function() {
    await wrestling.registerAsWrestler1({from: wrestler1});
    await wrestling.registerAsWrestler2({from: wrestler2});
    assert.equal(await wrestling.wrestler2(), wrestler2);
  });

  it('Second Wrestler Not Initialize Without Adress', async function() {
    await wrestling.registerAsWrestler1({from: wrestler1});
    try {
      await wrestling.registerAsWrestler2();
      assert.fail('Should Not Initialize without address')
    } catch(error) {
      revertedTransaction(error);
    }
  });

  it('Can Not register second wrestler 2 times', async function() {
    await wrestling.registerAsWrestler1({from: wrestler1});
    await wrestling.registerAsWrestler2({from: wrestler2});
    try {
      await wrestling.registerAsWrestler2({from: wrestler2});
      assert.fail('Should Not Initialize without address')
    } catch(error) {
      revertedTransaction(error);
    }
  });

  // TODO: Add test for 0x0 address

  it('Second Wrestler Can Not Initialize With First Wrestler Address', async function() {
    await wrestling.registerAsWrestler1({from: wrestler1});
    try {
      await wrestling.registerAsWrestler2({from: wrestler1});
      assert.fail('Should Not Initialize without address')
    } catch(error) {
      revertedTransaction(error);
    }
  });

  it('Increase Wrestler 1 Deposit when wrestle', async function() {
    await wrestling.registerAsWrestler1({from: wrestler1});
    await wrestling.registerAsWrestler2({from: wrestler2});
    let wrestler1Deposit = await wrestling.wrestler1Deposit();
    let earnedValue = web3.toWei(2, "ether");
    await wrestling.wrestle({from: wrestler1, value: earnedValue});
    assert.equal(await wrestling.wrestler1Deposit() - wrestler1Deposit, earnedValue);
  });

  it('Increase Wrestler 2 Deposit when wrestle', async function() {
    await wrestling.registerAsWrestler1({from: wrestler1});
    await wrestling.registerAsWrestler2({from: wrestler2});
    let wrestler2Deposit = await wrestling.wrestler2Deposit();
    let earnedValue = web3.toWei(2, "ether");
    await wrestling.wrestle({from: wrestler2, value: earnedValue})
    assert.equal(await wrestling.wrestler2Deposit() - wrestler2Deposit, earnedValue);
  });

  it('Revert wrestle if message sent not from wrestler1 or wrestler2', async function() {
    await wrestling.registerAsWrestler1({from: wrestler1});
    await wrestling.registerAsWrestler2({from: wrestler2});
    let earnedValue = web3.toWei(2, "ether");
    try {
      await wrestling.wrestle({from: notWrestler, value: earnedValue})
      assert.fail('Should not wrestle without registered wrestlers')
    } catch(error) {
      revertedTransaction(error);
    }
  });

  it('Wrestle 1 can wrestle only once per round', async function(){
    await wrestling.registerAsWrestler1({from: wrestler1});
    await wrestling.registerAsWrestler2({from: wrestler2});
    let earnedValue = web3.toWei(2, "ether");
    await wrestling.wrestle({from: wrestler1, value: earnedValue});
    try {
      await wrestling.wrestle({from: wrestler1, value: earnedValue})
      assert.fail('Can wrestle only once per round.')
    } catch(error) {
      revertedTransaction(error);
    }
  });

  it('Wrestle 2 can wrestle only once per round', async function(){
    await wrestling.registerAsWrestler1({from: wrestler1});
    await wrestling.registerAsWrestler2({from: wrestler2});
    let earnedValue = web3.toWei(2, "ether");
    await wrestling.wrestle({from: wrestler2, value: earnedValue});
    try {
      await wrestling.wrestle({from: wrestler2, value: earnedValue})
      assert.fail('Can wrestle only once per round.')
    } catch(error) {
      revertedTransaction(error);
    }
  });
});

function revertedTransaction(error) {
  assert.isAbove(error.message.search('VM Exception while processing transaction: revert'), -1);
}
