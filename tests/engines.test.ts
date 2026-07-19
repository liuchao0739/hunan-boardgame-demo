import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { canHu, canQiDui, isHu, buildDeck } from "../src/engine/mahjong/tiles.js";
import { ChangshaMahjong } from "../src/engine/mahjong/game.js";
import { canPhzHu, buildPhzDeck, findPhzChi } from "../src/engine/paohuzi/tiles.js";
import { ShaoyangPaohuzi } from "../src/engine/paohuzi/game.js";

describe("长沙麻将胡牌", () => {
  it("标准面子胡", () => {
    // 123万 456万 789万 123条 55筒
    const hand = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 22];
    assert.equal(canHu(hand), true);
    assert.equal(isHu(hand), true);
  });

  it("七对", () => {
    const hand = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    assert.equal(canQiDui(hand), true);
  });

  it("牌墙 108 张", () => {
    assert.equal(buildDeck().length, 108);
  });

  it("开局发牌张数", () => {
    const g = new ChangshaMahjong();
    g.start();
    assert.equal(g.players[0].hand.length + g.players[1].hand.length + g.players[2].hand.length + g.players[3].hand.length, 14 + 13 * 3);
    assert.equal(g.phase, "wait_discard");
  });
});

describe("邵阳跑胡子", () => {
  it("牌墩 80 张", () => {
    assert.equal(buildPhzDeck().length, 80);
  });

  it("开局三人张数", () => {
    const g = new ShaoyangPaohuzi();
    g.start();
    assert.equal(g.players[0].hand.length, 21);
    assert.equal(g.players[1].hand.length, 20);
    assert.equal(g.players[2].hand.length, 20);
  });

  it("可找吃", () => {
    const hand = [0, 1, 5]; // 小壹贰 + 其他
    const chis = findPhzChi([0, 1, 3, 4, 5], 2); // 吃小叁 → 壹贰叁
    assert.ok(chis.some((c) => c.includes(2)));
  });

  it("胡息门槛", () => {
    // 粗测：不成牌返回 false
    assert.equal(canPhzHu([0, 1], 0, 15), false);
  });
});
