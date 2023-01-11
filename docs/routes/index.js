import * as docsModule from "./docs.js";
import * as homeModule from "./home.js";
import * as rootModule from "./root.js";

export default [
  {
    id: "root",
    module: rootModule,
    children: [
      {
        id: "home",
        index: true,
        module: homeModule,
      },
      {
        id: "docs",
        path: "docs",
        module: docsModule,
      },
    ],
  },
];
