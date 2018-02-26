import cases from "jest-in-case";
import resolvePath from "../resolvePath";
cases(
  "resolvePath",
  ({ basePath, relativePath, returnedPath }) => {
    let res = resolvePath(basePath, relativePath);
    expect(res).toBe(returnedPath);
  },
  [
    { basePath: "a/b/c", relativePath: "../z", returnedPath: "a/z" },
    {
      basePath: "a/b/c",
      relativePath: "../../z/x",
      returnedPath: "z/x"
    },
    { basePath: "a/b/c", relativePath: "./z", returnedPath: "a/b/z" },
    {
      basePath: "a/b/c",
      relativePath: "../../../z/x",
      returnedPath: "a/b/c"
    },
    {
      basePath: "a/b/c",
      relativePath: "zxy",
      returnedPath: "a/b/c/zxy"
    },
    {
      basePath: "a/b/c/",
      relativePath: "./zxy",
      returnedPath: "a/b/zxy"
    }
  ]
);
