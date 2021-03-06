/* @flow */
import { Map, fromJS } from 'immutable';

import {
  CHANGESET_CHANGE,
  CHANGESET_ERROR,
  CHANGESET_LOADING,
  CHANGESET_FETCHED,
  CHANGESET_MAP_CHANGE,
  CHANGESET_MAP_ERROR,
  CHANGESET_MAP_FETCHED,
  CHANGESET_MAP_LOADING,
  CHANGESET_MODIFY,
  CHANGESET_MODIFY_REVERT
} from './changeset_actions';

export type ChangesetType = Map<
  | 'changesets'
  | 'changesetId' // of the currentChangeset
  | 'loading'
  | 'loadingChangesetMap'
  | 'changesetMap'
  | 'errorChangesetMap'
  | 'errorChangeset',
  any
>;

const initial: ChangesetType = fromJS({
  changesetId: null,
  changesets: new Map(),
  loading: false,
  errorChangeset: null,
  changesetMap: new Map(),
  loadingChangesetMap: false,
  errorChangesetMap: null
});

export function changesetReducer(
  state: ChangesetType = initial,
  action: Object
): ChangesetType {
  switch (action.type) {
    case CHANGESET_CHANGE: {
      return state
        .set('changesetId', action.changesetId)
        .set('loading', false)
        .set('errorChangeset', null)
        .set('errorChangesetMap', null);
    }
    case CHANGESET_LOADING: {
      return state
        .set('changesetId', action.changesetId)
        .set('loading', true)
        .set('errorChangeset', null);
    }
    case CHANGESET_FETCHED: {
      const changesets = state
        .get('changesets')
        .set(action.changesetId, action.data);
      return state
        .set('changesets', changesets)
        .set('changesetId', action.changesetId)
        .set('loading', false)
        .set('errorChangeset', null);
    }
    case CHANGESET_ERROR: {
      return state
        .set('changesetId', action.changesetId)
        .set('loading', false)
        .set('errorChangeset', action.error);
    }
    case CHANGESET_MAP_CHANGE: {
      return state
        .set('changesetId', action.changesetId)
        .set('errorChangesetMap', null)
        .set('loadingChangesetMap', false);
    }
    case CHANGESET_MAP_FETCHED: {
      const changesetMap = state
        .get('changesetMap')
        .set(action.changesetId, action.data);
      return state
        .set('changesetMap', changesetMap)
        .set('changesetId', action.changesetId)
        .set('loadingChangesetMap', false)
        .set('errorChangesetMap', null);
    }
    case CHANGESET_MAP_LOADING: {
      return state
        .set('changesetId', action.changesetId)
        .set('loadingChangesetMap', true)
        .set('errorChangesetMap', null);
    }
    case CHANGESET_MAP_ERROR: {
      return state
        .set('changesetId', action.changesetId)
        .set('loadingChangesetMap', false)
        .set('errorChangesetMap', action.error);
    }
    case CHANGESET_MODIFY: {
      const changesets = state
        .get('changesets')
        .set(action.changesetId, action.changeset);
      return state.set('changesets', changesets);
    }
    case CHANGESET_MODIFY_REVERT: {
      const changesets = state
        .get('changesets')
        .set(action.changesetId, action.changeset);
      return state
        .set('changesets', changesets)
        .set('errorChangeset', action.error);
    }
    default: {
      return state;
    }
  }
}
