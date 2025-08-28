import React from "react";
import { Menu } from "antd";

function Navbar() {
  return (
    <Menu mode="horizontal" theme="dark">
      <Menu.Item key="home">Home</Menu.Item>
      <Menu.Item key="about">About</Menu.Item>
      <Menu.Item key="contact">Contact</Menu.Item>
    </Menu>
  );
}

export default Navbar;