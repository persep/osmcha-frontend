// @flow
import React from 'react';
import { Map, List, fromJS } from 'immutable';
import CSSGroup from 'react-transition-group/CSSTransitionGroup';

import { getUserDetails } from '../../network/openstreetmap';
import { Floater } from './floater';
import { Header } from './header';
import { User } from './user';
import { Features } from './features';
import { Box } from './box';
import { Discussions } from './discussions';
import { MapOptions } from './map_options';
import { ControlLayout } from './control_layout';
import { keyboardToggleEnhancer } from '../keyboard_enhancer';
import { withFetchDataSilent } from '../fetch_data_enhancer';

import { osmCommentsApi, whosThat } from '../../config/constants';
import {
  CHANGESET_DETAILS_DETAILS,
  CHANGESET_DETAILS_SUSPICIOUS,
  CHANGESET_DETAILS_USER,
  CHANGESET_DETAILS_DISCUSSIONS,
  CHANGESET_DETAILS_MAP
} from '../../config/bindings';

// presentational component for view/changeset.js
class Changeset extends React.PureComponent {
  state = {
    left: 0
  };
  static defaultProps = {
    data: Map()
  };
  props: {
    data: Map<string, *>,
    filterChangesetsByUser: () => any,
    changesetId: number,
    currentChangeset: Map<string, any>,
    bindingsState: Map<string, ?boolean>,
    exclusiveKeyToggle: (label: string) => any
  };
  ref = null;

  componentDidMount() {
    this.toggleDetails();
  }

  setRef = (r: any) => {
    if (!r) return;
    var rect = r.parentNode.parentNode.parentNode.getBoundingClientRect();
    this.setState({
      left: parseInt(rect.left, 10)
    });
  };

  showFloaters = () => {
    const { changesetId, currentChangeset } = this.props;
    const bindingsState = this.props.bindingsState;
    const properties = currentChangeset.get('properties');
    return (
      <CSSGroup
        name="floaters"
        transitionName="floaters"
        transitionAppearTimeout={300}
        transitionAppear={true}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={250}
      >
        {bindingsState.get(CHANGESET_DETAILS_DETAILS.label) &&
          <Box key={3} className=" w420 round-tr round-br">
            <Header
              toggleUser={this.toggleUser}
              changesetId={changesetId}
              properties={properties}
              userEditCount={this.props.data.getIn(['userDetails', 'count'], 0)}
            />
          </Box>}
        {bindingsState.get(CHANGESET_DETAILS_SUSPICIOUS.label) &&
          <Box key={2} className=" w420 round-tr round-br">
            <Features changesetId={changesetId} properties={properties} />
          </Box>}
        {bindingsState.get(CHANGESET_DETAILS_DISCUSSIONS.label) &&
          <Box key={1} className=" w420  round-tr round-br">
            <Discussions
              changesetId={changesetId}
              discussions={this.props.data.getIn(
                ['osmComments', 'properties', 'comments'],
                List()
              )}
            />
          </Box>}
        {bindingsState.get(CHANGESET_DETAILS_USER.label) &&
          <Box key={0} className=" w420  round-tr round-br">
            <User
              userDetails={this.props.data.get('userDetails')}
              osmComments={this.props.data.get('osmComments')}
              whosThat={this.props.data.getIn(['whosThat', 0, 'names'], List())}
              filterChangesetsByUser={this.props.filterChangesetsByUser}
            />
          </Box>}
        {bindingsState.get(CHANGESET_DETAILS_MAP.label) &&
          <Box key={4} className=" w420  round-tr round-br">
            <MapOptions />
          </Box>}
      </CSSGroup>
    );
  };

  toggleFeatures = () => {
    this.props.exclusiveKeyToggle(CHANGESET_DETAILS_SUSPICIOUS.label);
  };
  toggleDiscussions = () => {
    this.props.exclusiveKeyToggle(CHANGESET_DETAILS_DISCUSSIONS.label);
  };
  toggleDetails = () => {
    this.props.exclusiveKeyToggle(CHANGESET_DETAILS_DETAILS.label);
  };
  toggleUser = () => {
    this.props.exclusiveKeyToggle(CHANGESET_DETAILS_USER.label);
  };
  toggleMapOptions = () => {
    this.props.exclusiveKeyToggle(CHANGESET_DETAILS_MAP.label);
  };

  render() {
    const features = this.props.currentChangeset.getIn([
      'properties',
      'features'
    ]);

    return (
      <div className="flex-child clip" ref={this.setRef}>
        <ControlLayout
          toggleDetails={this.toggleDetails}
          toggleFeatures={this.toggleFeatures}
          toggleDiscussions={this.toggleDiscussions}
          toggleUser={this.toggleUser}
          toggleMapOptions={this.toggleMapOptions}
          features={features}
          left={this.state.left}
          bindingsState={this.props.bindingsState}
          discussions={this.props.data.getIn(
            ['osmComments', 'properties', 'comments'],
            List()
          )}
        />
        <Floater
          style={{
            top: 55 * 1.1,
            width: 420,
            left: 40 + this.state.left
          }}
        >
          {this.showFloaters()}
        </Floater>
      </div>
    );
  }
}

Changeset = keyboardToggleEnhancer(
  true,
  [
    CHANGESET_DETAILS_DETAILS,
    CHANGESET_DETAILS_SUSPICIOUS,
    CHANGESET_DETAILS_USER,
    CHANGESET_DETAILS_DISCUSSIONS,
    CHANGESET_DETAILS_MAP
  ],
  Changeset
);
Changeset = withFetchDataSilent(
  {
    userDetails: props => getUserDetails(props.uid),
    osmComments: props =>
      fetch(`${osmCommentsApi}/${props.changesetId}`).then(r => r.json()),
    whosThat: props => fetch(`${whosThat}${props.user}`).then(r => r.json())
  },
  (nextProps, props) => props.changesetId !== nextProps.changesetId,
  Changeset
);

export { Changeset };
