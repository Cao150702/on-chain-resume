// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title OnChainResume
/// @notice A decentralized credential NFT system for verifiable professional identities.
///         Each NFT represents a work experience, skill certification, or education record.
/// @dev Extends ERC-721 with enumerable and URI storage. Credentials are self-issued
///      and optionally endorsed by third parties.
contract OnChainResume is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    // ─────────────────────────────────────────────
    // Types
    // ─────────────────────────────────────────────

    enum CredentialCategory {
        WORK,          // Work experience
        SKILL,         // Technical skill / certification
        EDUCATION,     // Degree or course
        PROJECT,       // Open-source or personal project
        AWARD          // Hackathon win, recognition, etc.
    }

    struct Credential {
        string  title;            // e.g. "Senior Frontend Engineer"
        string  organization;     // e.g. "Tencent / ETH Global"
        string  description;      // Short bio of the role / skill
        string[] skills;          // Tagged skills, e.g. ["Solidity", "React"]
        CredentialCategory category;
        uint256 startDate;        // Unix timestamp
        uint256 endDate;          // 0 = present / ongoing
        address issuer;           // wallet that minted this credential
        bool    endorsed;         // has at least one third-party endorsement
        uint256 endorsementCount;
    }

    // ─────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────

    Counters.Counter private _tokenIdCounter;

    /// @dev tokenId => Credential metadata
    mapping(uint256 => Credential) private _credentials;

    /// @dev tokenId => endorser address => has endorsed
    mapping(uint256 => mapping(address => bool)) private _endorsements;

    /// @dev owner address => list of their tokenIds (for quick lookup)
    mapping(address => uint256[]) private _ownerCredentials;

    // ─────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────

    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed owner,
        CredentialCategory category,
        string title
    );

    event CredentialEndorsed(
        uint256 indexed tokenId,
        address indexed endorser,
        uint256 totalEndorsements
    );

    // ─────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────

    constructor() ERC721("OnChainResume", "OCR") Ownable(msg.sender) {}

    // ─────────────────────────────────────────────
    // Core: Mint
    // ─────────────────────────────────────────────

    /// @notice Mint a new credential NFT. Only the caller can mint credentials for themselves.
    /// @param title         Short title of the credential
    /// @param organization  Company, school, or project name
    /// @param description   Detailed description (stored off-chain via tokenURI / IPFS)
    /// @param skills        Array of skill tags
    /// @param category      Credential category enum
    /// @param startDate     Start timestamp (unix)
    /// @param endDate       End timestamp; 0 = ongoing
    /// @param tokenURI_     IPFS URI for full JSON metadata
    /// @return tokenId      The newly minted token ID
    function mintCredential(
        string calldata title,
        string calldata organization,
        string calldata description,
        string[] calldata skills,
        CredentialCategory category,
        uint256 startDate,
        uint256 endDate,
        string calldata tokenURI_
    ) external returns (uint256 tokenId) {
        require(bytes(title).length > 0, "OCR: title required");
        require(startDate > 0, "OCR: invalid start date");
        require(endDate == 0 || endDate >= startDate, "OCR: invalid date range");

        tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        _credentials[tokenId] = Credential({
            title: title,
            organization: organization,
            description: description,
            skills: skills,
            category: category,
            startDate: startDate,
            endDate: endDate,
            issuer: msg.sender,
            endorsed: false,
            endorsementCount: 0
        });

        _ownerCredentials[msg.sender].push(tokenId);

        emit CredentialMinted(tokenId, msg.sender, category, title);
    }

    // ─────────────────────────────────────────────
    // Core: Endorse
    // ─────────────────────────────────────────────

    /// @notice Endorse someone else's credential. Acts as an on-chain reference letter.
    /// @dev The endorser must not be the credential owner and cannot double-endorse.
    /// @param tokenId  The token ID to endorse
    function endorseCredential(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "OCR: nonexistent token");
        require(ownerOf(tokenId) != msg.sender, "OCR: cannot self-endorse");
        require(!_endorsements[tokenId][msg.sender], "OCR: already endorsed");

        _endorsements[tokenId][msg.sender] = true;
        _credentials[tokenId].endorsementCount += 1;
        _credentials[tokenId].endorsed = true;

        emit CredentialEndorsed(tokenId, msg.sender, _credentials[tokenId].endorsementCount);
    }

    // ─────────────────────────────────────────────
    // Reads
    // ─────────────────────────────────────────────

    /// @notice Get the full credential struct for a given token
    function getCredential(uint256 tokenId) external view returns (Credential memory) {
        require(_ownerOf(tokenId) != address(0), "OCR: nonexistent token");
        return _credentials[tokenId];
    }

    /// @notice Get all token IDs owned by a wallet address
    function getCredentialsByOwner(address owner_) external view returns (uint256[] memory) {
        return _ownerCredentials[owner_];
    }

    /// @notice Check whether a specific address has endorsed a credential
    function hasEndorsed(uint256 tokenId, address endorser) external view returns (bool) {
        return _endorsements[tokenId][endorser];
    }

    /// @notice Total credentials minted so far
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // ─────────────────────────────────────────────
    // ERC-721 Overrides (required by inheritance)
    // ─────────────────────────────────────────────

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
