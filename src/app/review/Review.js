import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button, Dropdown, Icon, Header, Label, Progress, Segment } from "semantic-ui-react";

import * as api from "./reviewActions";
import * as itemApi from "../items/itemActions";

import Results from "./Results";

import "./Review.css";

import { DeleteItemModal, EditItemModal, MODAL_TYPES } from "../../components/modals";

const REVIEW_TYPE = {
  EASY: "easy",
  GOOD: "good",
  HARD: "hard",
};

const EmptyView = () => (
  <div className="review-container">
    <div className="col-md-8 offset-md-2 text-center">
      <span style={{ fontSize: "80px", fontWeight: "bold" }} role="img" aria-label="jsx-a11y">
        😅
      </span>
      <h3 style={{ marginBottom: "40px" }}>Oops, something seems to have gone wrong.</h3>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  </div>
);

class Review extends Component {
  state = {
    index: 0,
    showFront: true,
    showAnswers: false,
    session: {},
    showModalType: undefined,
  };

  componentWillMount = () => {
    const { sessionId } = this.props.match.params;

    if (sessionId) {
      this.fetchSession(sessionId);
    }
  };

  onCloseModal = () => this.setState({ showModalType: undefined });

  onShowModal = (event, data) => this.setState({ showModalType: data.value });

  onGoto = (event, data) => this.props.history.push(data.value);

  onReview = (event, data) => {
    const { value } = data;
    const { index, session: { items } } = this.state;
    const item = items[index];

    this.reviewItem(item._id, value);
  };

  onReveal = () => {
    this.setState(({ showFront }) => ({
      showAnswers: true,
      showFront: !showFront,
    }));
  };

  fetchSession = sessionId => {
    api.fetchSession(sessionId).then(
      response => {
        this.setState({ session: response.data.session });
      },
      error => {
        console.log("error", error.response);
      },
    );
  };

  reviewItem = (itemId, value) => {
    api.reviewItem({ itemId, value }).then(
      response => {
        const { item } = response.data;
        this.setState(({ session, index }) => {
          const items = session.items.map(el => {
            return el._id === item._id ? item : el;
          });
          return {
            session: { ...session, items: items },
            index: index + 1,
            showAnswers: false,
            showFront: true,
          };
        });
      },
      error => {
        console.log("error", error);
      },
    );
  };

  editItem = item => {
    itemApi.editItem(item).then(
      response => {
        this.setState(({ session }) => {
          const items = session.items.map(el => {
            return el._id === item._id ? item : el;
          });
          return { session: { ...session, items: items } };
        });
        this.onCloseModal();
      },
      error => {
        console.log("error", error);
      },
    );
  };

  deleteItem = () => {
    const { index, session: { items } } = this.state;
    const item = items[index];

    itemApi.deleteItem(item._id).then(
      response => {
        const newItems = items.filter(el => el._id !== item._id);
        this.setState(({ session }) => ({
          session: { ...session, items: newItems },
          showAnswers: false,
          showFront: true,
        }));
        this.onCloseModal();
      },
      error => {
        console.log("error", error);
      },
    );
  };

  render() {
    const { index, session, showFront, showAnswers, showModalType } = this.state;
    const { items = [] } = session;

    if (items.length === 0) {
      return <EmptyView />;
    }

    if (index > items.length - 1) {
      return <Results items={items} />;
    }

    const item = items[index];
    const { deck } = item;
    const itemContent = showFront ? item.front : item.back;

    return (
      <div className="review-container">
        <DeleteItemModal
          open={showModalType === MODAL_TYPES.DELETE_ITEM}
          onClose={this.onCloseModal}
          onSubmit={this.deleteItem}
        />
        <EditItemModal
          item={item}
          open={showModalType === MODAL_TYPES.EDIT_ITEM}
          onClose={this.onCloseModal}
          onSubmit={this.editItem}
        />
        <div className="container mt-3">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="review-header d-flex justify-content-between align-items-end">
                <Header as="h3" className="text-uppercase m-0">
                  {session.type}
                </Header>
                <p className="text-secondary font-italic">
                  <strong>{index + 1}</strong> out of {items.length}
                </p>
              </div>
              <Segment className="review-container-panel mt-2 mb-4" onClick={this.onReveal}>
                <Dropdown
                  on="click"
                  icon={false}
                  pointing="top right"
                  trigger={
                    <Icon name="ellipsis vertical" size="large" className="text-secondary m-2" />
                  }
                  style={{ position: "absolute", right: "16px", top: "12px" }}
                >
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={this.onShowModal} value={MODAL_TYPES.EDIT_ITEM}>
                      Edit Item
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.onShowModal} value={MODAL_TYPES.DELETE_ITEM}>
                      Delete Item
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Progress attached="top" value={index} total={items.length} color="blue" />
                <Label attached="bottom" onClick={this.onGoto} value={`/decks/${deck._id}`} as="a">
                  {deck.title}
                </Label>
                <Label attached="bottom right">{showFront ? "Front" : "Back"}</Label>
                <Header as="h2" className="text-center my-5">
                  {itemContent}
                </Header>
              </Segment>
              <div className="review-actions">
                {showAnswers ? (
                  <div className="d-flex justify-content-between">
                    <Button
                      onClick={this.onReview}
                      value={REVIEW_TYPE.HARD}
                      size="large"
                      primary
                      fluid
                    >
                      Again
                    </Button>
                    <Button
                      onClick={this.onReview}
                      value={REVIEW_TYPE.GOOD}
                      size="large"
                      primary
                      fluid
                    >
                      Good
                    </Button>
                    <Button
                      onClick={this.onReview}
                      value={REVIEW_TYPE.EASY}
                      size="large"
                      primary
                      fluid
                    >
                      Easy
                    </Button>
                  </div>
                ) : (
                  <Button onClick={this.onReveal} size="large" primary fluid>
                    Show Answer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Review.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Review;
