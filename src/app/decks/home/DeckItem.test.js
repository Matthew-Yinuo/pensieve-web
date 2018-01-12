import React from "react";
import DeckItem from "./DeckItem";
import { shallow } from "enzyme";

it("renders without crashing", () => {
  const defaultProps = { card: {} };
  const wrapper = shallow(<DeckItem {...defaultProps} />);
  expect(wrapper).toHaveLength(1);
});
