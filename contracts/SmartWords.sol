// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SmartWords is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    struct Text {
        string title;
        bytes32 textHash;
        uint256 textTimestamp;
    }

    Counters.Counter private _textId;

    mapping(uint256 => Text) private _texts;
    mapping(bytes32 => address) private _isHashes;

    constructor() ERC721("MyText", "MTXT") {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
        return super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _baseURI() internal view virtual override(ERC721) returns (string memory) {
        return "";
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        return super._beforeTokenTransfer(from, to, tokenId);
    }

    // mint NFT function
    function registerText(
        string memory title_,
        bytes32 textHash_,
        string memory nftURI_
    ) public returns (uint256) {
        require(_isHashes[textHash_] == address(0), "SmartWords: This text has already been registred with copyright");
        uint256 newTextId = _textId.current();
        _mint(msg.sender, newTextId);
        _textId.increment();
        uint256 textTimestamp = block.timestamp;
        _isHashes[textHash_] = msg.sender;
        _texts[newTextId] = Text(title_, textHash_, textTimestamp);
        _setTokenURI(newTextId, nftURI_);
        return newTextId;
    }

    function getTextInfo(uint256 textId)
        public
        view
        returns (
            string memory,
            bytes32,
            uint256
        )
    {
        Text memory t = _texts[textId];
        return (t.title, t.textHash, t.textTimestamp);
    }

    function getTextHashOf(uint256 textId) public view returns (bytes32) {
        Text memory t = _texts[textId];
        return (t.textHash);
    }

    function getTitleOf(uint256 textId) public view returns (string memory) {
        Text memory t = _texts[textId];
        return (t.title);
    }

    function getTimestampOf(uint256 textId) public view returns (uint256) {
        Text memory t = _texts[textId];
        return (t.textTimestamp);
    }

    function isCopyright(bytes32 textHash_) public view returns (bool) {
        bool isCr;
        if (_isHashes[textHash_] == address(0)) {
            isCr = false;
        } else {
            isCr = true;
        }
        return isCr;
    }
}
