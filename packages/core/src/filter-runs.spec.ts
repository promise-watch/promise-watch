import { filterRunsWithoutRequiredFields } from "./filter-runs";

describe("filterRunsWithoutRequiredFields", () => {
  const validPage = {
    name: "successful run",
    options: { interval: 1 },
    run: async () => {},
  }

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("missing run function alerts and is skipped", () => {
    const missingRunFunction: any = { name: "my-test", options: { interval: 1 } };
    expect(filterRunsWithoutRequiredFields([missingRunFunction, validPage])).toStrictEqual([validPage]);
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  it("invalid options function alerts and is skipped", () => {
    const invalidPageOptions: any = {
      run: async () => {
      },
    };
    expect(filterRunsWithoutRequiredFields([invalidPageOptions, validPage])).toStrictEqual([validPage]);
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});

