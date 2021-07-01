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
    // test not passed : good value in struct TEXT  ???
    it('Text struct should contained TITLE, TEXT_HASH, TIME_STAMP for Text struct with id 0', async function () {
      const currentBlock = await ethers.provider.getBlock();
      const TIME_STAMP = currentBlock.timestamp;
      expect((await smartWords.getTextInfo(0))[0]).to.be.equal(TITLE);
      expect((await smartWords.getTextInfo(0))[1]).to.be.equal(TEXT_HASH);
      expect((await smartWords.getTextInfo(0))[2]).to.be.equal(ethers.BigNumber.from(TIME_STAMP));
    });
    it('should revert if textHash have already been registered', async function () {
      await expect(smartWords.connect(textOwner1).registerText('My Copyright text2', TEXT_HASH, 'MyText2'))
        .to.be.revertedWith('SmartWords: This text has already been registred with copyright');
    });
  });
  describe('SmartWords textHashOf function', function () {
    const TITLE = 'My Copyright text';
    const TEXT_HASH = ethers.utils.id('TEXTTEXTTEXTTEXTTEXT');
    const NFT_URI = 'MyText';
    beforeEach(async function () {
      await smartWords.connect(textOwner1).registerText(TITLE, TEXT_HASH, NFT_URI);
    });
    it('should be equal textOwner address if textHash have already been registered', async function () {
      expect(await smartWords.textHashOf((TEXT_HASH))).to.equal(textOwner1.address);
    });
    it('should be address(0) if textHash have not been registered', async function () {
      const NEW_TEXT_HASH = ethers.utils.id('NEWTEXTTEXTTEXTTEXTTEXT');
      expect(await smartWords.textHashOf(NEW_TEXT_HASH)).to.equal(ethers.constants.AddressZero);
    });
  });
});
