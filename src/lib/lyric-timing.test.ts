import { test } from "node:test";
import assert from "node:assert/strict";
import { lyricSeekTime } from "./lyric-timing";

test("tapping lyrics uses the same proportional timeline as scrolling", () => {
  assert.equal(lyricSeekTime(0, 4, 240), 0);
  assert.equal(lyricSeekTime(2, 4, 240), 120);
  assert.equal(lyricSeekTime(3, 4, 240), 180);
});

test("seek positions stay within a valid song timeline", () => {
  assert.equal(lyricSeekTime(-1, 4, 240), 0);
  assert.equal(lyricSeekTime(9, 4, 240), 180);
  assert.equal(lyricSeekTime(2, 4, 0), 0);
  assert.equal(lyricSeekTime(2, 0, 240), 0);
});