import { createElement } from "react";
import legacy from "../node_modules/react-dom/cjs/react-dom-server-legacy.browser.production.js";
const { renderToStaticMarkup } = legacy;
import { Sparkline } from "@microcharts/react/sparkline";
export const renderSparkline = (props) => renderToStaticMarkup(createElement(Sparkline, props));
