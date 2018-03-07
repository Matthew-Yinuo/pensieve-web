import React, { Component } from "react";
import PropTypes from "prop-types";
import { Header, Button, Form, Input, TextArea } from "semantic-ui-react";

import withErrors from "../../../helpers/withErrors";
import InputTags from "./InputTags";

import * as api from "../deckActions";

class DeckNew extends Component {
  state = {
    title: "",
    description: "",
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => this.createDeck();

  onCancel = () => this.props.history.push("/decks");

  createDeck = () => {
    const { title, description } = this.state;
    api.createDeck({ title, description }).then(response => {
      this.props.history.push(`/decks/${response.data._id}`);
    });
  };

  render() {
    const { title, description } = this.state;

    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-md-3">
            <Header as="h2" textAlign="center">
              <Header.Content>Create a new deck</Header.Content>
            </Header>
            <Form>
              <Form.Field required>
                <label>Deck title</label>
                <Input
                  value={title}
                  onChange={this.onChange}
                  name="title"
                  placeholder="Add a deck title..."
                />
              </Form.Field>
              <Form.Field>
                <label>Tags</label>
                <InputTags />
              </Form.Field>
              <Form.Field>
                <label>Deck description</label>
                <TextArea
                  value={description}
                  onChange={this.onChange}
                  name="description"
                  autoHeight
                  placeholder="Add a deck description..."
                />
              </Form.Field>
              <Form.Field className="mt-4">
                <Button onClick={this.onSubmit} primary fluid>
                  Create Deck
                </Button>
              </Form.Field>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

DeckNew.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withErrors(DeckNew);
