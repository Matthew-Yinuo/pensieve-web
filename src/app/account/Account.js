import React, { Component } from "react";
import { Button, Header, Form, Checkbox, Input, Segment } from "semantic-ui-react";

import withErrors from "../../helpers/withErrors";

import * as api from "./userActions";

import { DeleteUserModal, MODAL_TYPES } from "../../components/modals";

class Account extends Component {
  state = { user: { name: "", email: "", prefs: {} }, showModalType: undefined };

  componentWillMount = () => {
    this.fetchUser();
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState(({ user }) => ({ user: { ...user, [name]: value } }));
  };

  onPrefChange = (e, data) => {
    const { name, value } = data;
    this.setState(({ user }) => ({ user: { ...user, prefs: { ...user.prefs, [name]: value } } }));
  };

  onPrefToggle = (e, data) => {
    const { name, checked } = data;
    this.setState(({ user }) => ({ user: { ...user, prefs: { ...user.prefs, [name]: checked } } }));
  };

  onCloseModal = () => this.setState({ showModalType: undefined });

  onShowModal = (event, data) => this.setState({ showModalType: data.value });

  fetchUser = () => {
    api.fetchUser().then(({ data }) => {
      const { name, email, prefs } = data;
      this.setState({ user: { name, email, prefs } });
    });
  };

  editUser = () => {
    const { user } = this.state;
    api.editUser(user).then(({ data }) => {
      const { name, email, prefs } = data;
      this.setState({ user: { name, email, prefs } });
    });
  };

  deleteUser = () => {
    api.deleteUser().then(response => {
      this.props.history.push("/logout");
    });
  };

  render() {
    const { user, showModalType } = this.state;
    const { prefs } = user;

    return (
      <div className="account-page mt-4">
        <DeleteUserModal
          open={showModalType === MODAL_TYPES.DELETE_USER}
          onClose={this.onCloseModal}
          onSubmit={this.deleteUser}
        />
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
              <Segment>
                <Form>
                  <Header as="h3">Profile</Header>
                  <Form.Field>
                    <label>Name</label>
                    <Input
                      onChange={this.onChange}
                      name="name"
                      placeholder="Enter full name"
                      value={user.name}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Email</label>
                    <Input
                      onChange={this.onChange}
                      name="email"
                      placeholder="Enter email"
                      value={user.email}
                    />
                  </Form.Field>
                  <Header as="h3">Preferences</Header>
                  <Form.Field>
                    <label>Session size</label>
                    <Input
                      onChange={this.onPrefChange}
                      placeholder="Enter default session size"
                      name="sessionSize"
                      type="number"
                      value={String(prefs.sessionSize)}
                      min={0}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Email reminders</label>
                    <Checkbox
                      onClick={this.onPrefToggle}
                      checked={prefs.emailNotifs}
                      name="emailNotifs"
                      label="Send me notifications when cards need to be reviewed"
                    />
                  </Form.Field>
                  <Form.Field className="mt-4">
                    <Button onClick={this.editUser} primary>
                      Update
                    </Button>
                  </Form.Field>
                </Form>
              </Segment>
              <Segment className="mt-5" color="red">
                <Header as="h5">Delete your account</Header>
                <p>
                  Do you wish to delete your account? This is permament and all your data will be
                  permanently erased?
                </p>
                <Button negative onClick={this.onShowModal} value={MODAL_TYPES.DELETE_USER}>
                  Delete
                </Button>
              </Segment>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withErrors(Account);
