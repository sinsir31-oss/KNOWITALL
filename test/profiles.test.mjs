import test from 'node:test';
import assert from 'node:assert/strict';
import { createProfile, updateProfile, profileContext } from '../src/profiles.mjs';

test('a custom KIA profile validates and carries context without granting authority', () => {
  const p = createProfile({
    name: 'Music Helper',
    description: 'Help with music',
    instructions: 'Help me plan a release'
  });
  assert.match(profileContext(p), /NOT AUTHORITY/);
  assert.match(profileContext(p), /plan a release/);
  assert.equal(
    updateProfile(p, {
      name: 'Studio Helper',
      description: p.description,
      instructions: p.instructions
    }).id, p.id
  );
  assert.throws(
    () => createProfile({ name: '', description: 'x', instructions: 'x' }),
    /invalid_profile/
  );
});
