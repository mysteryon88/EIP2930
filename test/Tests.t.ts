import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

describe("AccessList", function () {
  async function deployFixture() {
    const Call = await ethers.getContractFactory("Call");
    const call = await Call.deploy();

    const AccessList = await ethers.getContractFactory("AccessList");
    const accessList = await AccessList.deploy(call.target);

    return { accessList, call };
  }

  describe("CALL + SSTORE", function () {
    it("Without access list", async function () {
      const { accessList } = await loadFixture(deployFixture);

      const tx = await accessList.callSSTORE(10);
      const sstore = await tx.wait();

      console.log("Without access list:", sstore?.gasUsed);
    });

    it("With access list", async function () {
      const { accessList, call } = await loadFixture(deployFixture);

      const tx = await accessList.callSSTORE(10, {
        type: 1,
        accessList: [
          {
            address: await call.getAddress(),
            storageKeys: [],
          },
        ],
      });
      const sstore = await tx.wait();

      console.log("With access list (address):", sstore?.gasUsed);
    });

    it("With access list", async function () {
      const { accessList, call } = await loadFixture(deployFixture);

      const coder = new ethers.AbiCoder();

      const tx = await accessList.callSSTORE(10, {
        type: 1,
        accessList: [
          {
            address: await call.getAddress(),
            storageKeys: [coder.encode(["uint256"], [0])],
          },
        ],
      });
      const sstore = await tx.wait();

      console.log("With access list (address + slots):", sstore?.gasUsed);
    });
  });

  describe("CALL + SLOAD", function () {
    it("Without access list", async function () {
      const { accessList } = await loadFixture(deployFixture);

      const tx = await accessList.callSLOAD();
      const sstore = await tx.wait();

      console.log("Without access list:", sstore?.gasUsed);
    });

    it("With access list", async function () {
      const { accessList, call } = await loadFixture(deployFixture);

      const tx = await accessList.callSLOAD({
        type: 1,
        accessList: [
          {
            address: await call.getAddress(),
            storageKeys: [],
          },
        ],
      });
      const sstore = await tx.wait();

      console.log("With access list (address):", sstore?.gasUsed);
    });

    it("With access list", async function () {
      const { accessList, call } = await loadFixture(deployFixture);

      const coder = new ethers.AbiCoder();

      const tx = await accessList.callSLOAD({
        type: 1,
        accessList: [
          {
            address: await call.getAddress(),
            storageKeys: [coder.encode(["uint256"], [0])],
          },
        ],
      });
      const sstore = await tx.wait();

      console.log("With access list (address + slots):", sstore?.gasUsed);
    });
  });
  describe("BAD access list", function () {
    it("Without access list", async function () {
      const { accessList } = await loadFixture(deployFixture);

      const tx = await accessList.sstore(10);
      const sstore = await tx.wait();

      console.log("Without access list:", sstore?.gasUsed);
    });

    it("With access list", async function () {
      const { accessList } = await loadFixture(deployFixture);

      const coder = new ethers.AbiCoder();
      const tx = await accessList.sstore(10, {
        type: 1,
        accessList: [
          {
            address: await accessList.getAddress(),
            storageKeys: [coder.encode(["uint256"], [0])],
          },
        ],
      });
      const sstore = await tx.wait();

      console.log("With access list:", sstore?.gasUsed);
    });

    it("With empty access list", async function () {
      const { accessList } = await loadFixture(deployFixture);

      const tx = await accessList.sstore(10, {
        type: 1,
        accessList: [],
      });
      const sstore = await tx.wait();

      console.log("With empty access list:", sstore?.gasUsed);
    });
  });

  describe("CallDeploy", function () {
    it("Without access list", async function () {
      const { call } = await loadFixture(deployFixture);

      const CallDeploy = await ethers.getContractFactory("CallDeploy");
      const callDeploy = await CallDeploy.deploy(call.target);

      const receiptCallDeploy = await callDeploy
        .deploymentTransaction()
        ?.wait();
      console.log("Without access list:", receiptCallDeploy?.gasUsed);
    });

    it("With access list", async function () {
      const { call } = await loadFixture(deployFixture);
      const CallDeployAL = await ethers.getContractFactory("CallDeploy");
      const callDeployAL = await CallDeployAL.deploy(call.target, {
        type: 1,
        accessList: [
          {
            address: await call.getAddress(),
            storageKeys: [],
          },
        ],
      });

      const receiptCallDeployAL = await callDeployAL
        .deploymentTransaction()
        ?.wait();
      console.log("With access list:", receiptCallDeployAL?.gasUsed);
    });
  });
});
