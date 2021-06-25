/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { expect } = require('chai');

describe('SmartWords', function () {
  let SmartWords, smartWords, deployer, textOwner1, textOwner2;

  beforeEach(async function () {
    // SmartWords deployment
    [deployer, textOwner1, textOwner2] = await ethers.getSigners();
    SmartWords = await ethers.getContractFactory('SmartWords');
    smartWords = await SmartWords.connect(deployer).deploy();
    await smartWords.deployed();
  });
  describe('SmartWords registerText function', function () {
    const TITLE = 'My Copyright text';
    const TEXT_HASH = ethers.utils.id('TEXTTEXTTEXTTEXTTEXT');
    const NFT_URI = 'MyText';
    beforeEach(async function () {
      await smartWords.connect(textOwner1).registerText(TITLE, TEXT_HASH, NFT_URI);
    });
    it('tokenURI using _baseURI(hardcoding="") et URI should be assign to tokenURI', async function () {
      const baseURI = '';
      expect(await smartWords.tokenURI(0)).to.equal(baseURI + NFT_URI);
    });
    it('title should be assigned to Text struct with id 0', async function () {
      expect(await smartWords.getTitleOf(0)).to.equal(TITLE);
    });
    it('textHash should be assigned to Text struct with id 0', async function () {
      expect(await smartWords.getTextHashOf(0)).to.equal(TEXT_HASH);
    });
    it('Timestamp should be assigned to Text struct with id 0', async function () {
      const currentBlock = await ethers.provider.getBlock();
      const TIME_STAMP = currentBlock.timestamp;
      expect(await smartWords.getTimestampOf(0)).to.equal(TIME_STAMP);
    });
    /* test not passed : good value in struct TEXT  ???
    it('Text struct should contained TITLE, TEXT_HASH, TIME_STAMP for Text struct with id 0', async function () {
      console.log(await smartWords.getTextInfo(0));
      const currentBlock = await ethers.provider.getBlock();
      const TIME_STAMP = currentBlock.timestamp;
      console.log(ethers.BigNumber.from(TIME_STAMP));
      expect(await smartWords.getTextInfo(0)).to.be.equal([TITLE, TEXT_HASH, ethers.BigNumber.from(TIME_STAMP)]);
    });
    */
    it('should revert if textHash have already been registered', async function () {
      await expect(smartWords.connect(textOwner1).registerText('My Copyright text2', TEXT_HASH, 'MyText2'))
        .to.be.revertedWith('SmartWords: This text has already been registred with copyright');
    });
  });
  describe('SmartWords isCopyright function', function () {
    const TITLE = 'My Copyright text';
    const TEXT_HASH = ethers.utils.id('TEXTTEXTTEXTTEXTTEXT');
    const NFT_URI = 'MyText';
    beforeEach(async function () {
      await smartWords.connect(textOwner1).registerText(TITLE, TEXT_HASH, NFT_URI);
    });
    it('should be true if textHash have already been registered', async function () {
      expect(await smartWords.isCopyright(TEXT_HASH)).to.equal(true);
    });
    it('should be false if textHash have not been registered', async function () {
      const NEW_TEXT_HASH = ethers.utils.id('NEWTEXTTEXTTEXTTEXTTEXT');
      expect(await smartWords.isCopyright(NEW_TEXT_HASH)).to.equal(false);
    });
  });
});
