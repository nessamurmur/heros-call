import test from 'node:test';
import assert from 'node:assert/strict';
import {CHAPTERS,groupForSection,stageFromClass,chapterFromProgress} from '../scripts/model.mjs';

test('native optional sub-stages stay with their parent chapter',()=>{
  for(const [id,group] of [['0',0],['0b',0],['0c',0],['1a',1],['1b',1],['1c',1],['2b',2],['3',3],['4',4],['5',5],['6',6],['7',7]]) assert.equal(groupForSection(`creator-123-stage-${id}`),group);
  assert.equal(groupForSection('creator-123-background-spells'),2);
});
test('unknown or future native sections cannot be hidden as known chapters',()=>{
  for(const id of ['creator-future-options','creator-stage-20','creator-stage-1-weird','']) assert.equal(groupForSection(id),null);
});
test('native progress classes resolve even when other classes are present',()=>{
  assert.equal(stageFromClass('nimble-progress-bar nimble-progress-bar--stage-6 svelte-abc'),6);
  assert.equal(stageFromClass(undefined),0);
  assert.equal(stageFromClass('nimble-progress-bar--stage-99'),CHAPTERS.length-1);
});
test('background spell choices remain in Background when Nimble reuses stage 0c',()=>{
  assert.equal(chapterFromProgress('nimble-progress-bar--stage-0',true),2);
  assert.equal(chapterFromProgress('nimble-progress-bar--stage-0',false),0);
  assert.equal(chapterFromProgress('nimble-progress-bar--stage-3',true),3);
});
