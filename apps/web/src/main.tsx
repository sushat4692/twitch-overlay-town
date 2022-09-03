import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import { SocketProvider } from "./contexts/Socket";
import { RecoilRoot } from "recoil";
import "uno.css";
import "@unocss/reset/tailwind.css";
import 'antd/dist/antd.css';

const root = document.getElementById("root") as HTMLElement;
render(
  <RecoilRoot>
    <SocketProvider>
      <App />
    </SocketProvider>
  </RecoilRoot>,
  root
);
