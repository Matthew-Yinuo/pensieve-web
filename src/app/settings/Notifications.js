import React, { Component } from "react";
import { Button, Checkbox, Segment, Header, Form, Icon } from "semantic-ui-react";

import * as api from "./userActions";

const NOTIFS = {
  ALL: "all",
  DAILY: "daily",
  NEVER: "never",
};

class Notifications extends Component {
  state = { prefs: {} };

  componentWillMount() {
    this.fetchUser();
  }

  onEmailToggle = (event, data) => {
    this.setState(({ prefs }) => ({ prefs: { ...prefs, emailNotifs: data.checked } }));
  };

  fetchUser = () => {
    api.fetchUser().then(({ data }) => {
      const { name, email, prefs } = data;
      this.setState({ name, email, prefs });
    });
  };

  editNotifs = () => {
    const { name, email, prefs } = this.state;
    api.editUser({ name, email, prefs }).then(({ data }) => {
      const { name, email, prefs } = data;
      this.setState({ name, email, prefs });
    });
  };

  render() {
    const { prefs } = this.state;
    const isEmailOn = prefs.emailNotifs;

    return (
      <Segment padded>
        <Header>Notifications</Header>
        <Form>
          <Form.Field>
            <Checkbox
              onChange={this.onEmailToggle}
              checked={isEmailOn}
              name="emailNotifs"
              label={
                <label>
                  <Header size="small">
                    Send me email notifications{" "}
                    <span className="text-secondary font-weight-normal ml-2">once every day</span>
                    <Header.Subheader>
                      <Icon color="blue" name="info circle" />Emails are only sent when cards need
                      to be reviewed
                    </Header.Subheader>
                  </Header>
                </label>
              }
            />
          </Form.Field>
          <Form.Field>
            <Button onClick={this.editNotifs} primary>
              Update
            </Button>
          </Form.Field>
        </Form>
      </Segment>
    );
  }
}

export default Notifications;
