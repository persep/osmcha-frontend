// @flow
import React from 'react';
import { Map, List, fromJS } from 'immutable';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Mousetrap from 'mousetrap';

import { Navbar } from '../navbar';
import { Floater } from './floater';
import { Header } from './header';
import { Features } from './features';
import { Box } from './box';
import { Discussions } from './discussions';
import { Button } from '../button';

// presentational component for view/changeset.js
export class Changeset extends React.PureComponent {
  state = {
    width: 0,
    left: 0,
    discussions: false,
    features: false,
    details: true,
    showAll: true
  };
  props: {
    changesetId: number,
    currentChangeset: Map<string, *>,
    scrollDown: () => void,
    scrollUp: () => void
  };
  componentDidMount() {
    Mousetrap.bind('ctrl+a', () => {
      this.toggleAll();
    });
    Mousetrap.bind('ctrl+s', () => {
      this.toggleFeatures();
    });
    Mousetrap.bind('ctrl+d', () => {
      this.toggleDiscussions();
    });
    Mousetrap.bind('ctrl+o', () => {
      this.toggleDetails();
    });
    Mousetrap.bind('ctrl+c', () => {
      this.toggleComment();
    });
  }
  setRef = (r: any) => {
    if (!r) return;
    var rect = r.getBoundingClientRect();
    this.setState({
      width: parseInt(rect.width, 10),
      left: parseInt(rect.left, 10)
    });
  };

  ref = null;

  showFloaters = () => {
    const { changesetId, currentChangeset } = this.props;
    const properties = currentChangeset.get('properties');

    return (
      <CSSTransitionGroup
        transitionName="floaters"
        transitionAppearTimeout={300}
        transitionAppear={true}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={150}
      >
        {this.state.details &&
          <Box key={3} className="transition w480 my3 round-tr round-br">
            <Header changesetId={changesetId} properties={properties} />
          </Box>}
        {this.state.features &&
          <Box key={2} className="transition w480 my3 round-tr round-br">
            <Features changesetId={changesetId} properties={properties} />
          </Box>}
        {this.state.discussions &&
          <Box key={1} className="transition w480 my3 round-tr round-br">
            <Discussions changesetId={changesetId} properties={properties} />
          </Box>}
      </CSSTransitionGroup>
    );
  };

  toggleAll = () => {
    this.setState({
      features: this.state.showAll,
      discussions: this.state.showAll,
      details: this.state.showAll,
      showAll: !this.state.showAll
    });
  };
  toggleFeatures = () => {
    this.setState({
      features: !this.state.features
    });
  };
  toggleDiscussions = () => {
    this.setState({
      discussions: !this.state.discussions
    });
  };
  toggleDetails = () => {
    this.setState({
      details: !this.state.details
    });
  };
  render() {
    const { changesetId } = this.props;

    const height = parseInt(window.innerHeight - 55, 10);

    return (
      <div
        className="flex-child w-full transition clip"
        style={{ height }}
        ref={this.setRef}
      >
        <Navbar
          className="bg-white color-gray border-b border--gray-light border--1"
          title={
            <div className="flex-parent flex-parent--row flex-parent--center-main flex-parent--wrap">
              <Button active={this.state.details} onClick={this.toggleDetails}>
                Details
              </Button>
              <Button
                active={this.state.features}
                onClick={this.toggleFeatures}
              >
                Suspicious
              </Button>
              <Button
                active={this.state.discussions}
                onClick={this.toggleDiscussions}
              >
                Discussions
              </Button>
              <Button active={!this.state.showAll} onClick={this.toggleAll}>
                {this.state.showAll ? 'Show all' : 'Hide all'}
              </Button>
            </div>
          }
        />
        <div className="flex-child flex-child--grow bg-black h-full">
          {' '}&nbsp;
        </div>
        <Floater
          style={{
            top: 55 * 2,
            width: 480,
            left: this.state.left + (this.state.width - 480) / 2
          }}
        >
          {this.showFloaters()}
        </Floater>
      </div>
    );
  }
}