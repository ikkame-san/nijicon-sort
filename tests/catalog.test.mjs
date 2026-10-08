import test from 'node:test';
import assert from 'node:assert/strict';
import {SONGS} from '../songs.js';
import {filterCatalog,variantKind} from '../catalog.js';

test('initial catalogue contains the Mobius original and excludes alternate versions',()=>{
  const initial=filterCatalog(SONGS);
  assert.equal(initial.length,108);
  assert.ok(initial.some(s=>s.title==='メビウス・メモリー'));
  assert.ok(initial.every(s=>variantKind(s)===null));
});

test('language and remix checkboxes can be enabled independently',()=>{
  const languages=filterCatalog(SONGS,{includeLanguages:true});
  const remixes=filterCatalog(SONGS,{includeRemixes:true});
  assert.equal(languages.length,112);
  assert.equal(remixes.length,133);
  assert.ok(languages.every(s=>variantKind(s)!=='remix'));
  assert.ok(remixes.every(s=>variantKind(s)!=='language'));
  assert.equal(filterCatalog(SONGS,{includeLanguages:true,includeRemixes:true}).length,137);
});

test('all 18 Mobius arrangements have preview links and are controlled by the remix checkbox',()=>{
  const variants=SONGS.filter(s=>s.title.startsWith('メビウス・メモリー ('));
  assert.equal(variants.length,18);
  assert.equal(new Set(variants.map(s=>s.id)).size,18);
  for(const song of variants){
    assert.equal(variantKind(song),'remix');
    assert.ok(song.preview.url.startsWith('https://drive.google.com/file/d/'));
    assert.ok(song.artwork.startsWith('./jackets/'));
    assert.ok(filterCatalog(SONGS,{includeRemixes:true}).includes(song));
    assert.ok(!filterCatalog(SONGS).includes(song));
  }
});

test('manually added songs remain available even when their titles contain Mix',()=>{
  const custom={id:'custom-example',title:'自分の曲 (Remix)',custom:true};
  assert.deepEqual(filterCatalog([custom]),[custom]);
});
