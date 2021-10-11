"use strict";

import { go, resize, click, test, l, Locator } from 'testim';



Locator.set(require('./locators/locators.js'));

test("render-window", async () => {
  await go("http://app.sushi.com");
  await resize({width: 1024, height: 680});
  await click(l("Swap_Limit_Liquidity_113_Swap_From:"));
  await resize({width: 1269, height: 791});
  await click(l("Select_a_token"));
  await click(l("SUSHI"));

}); // end of test
