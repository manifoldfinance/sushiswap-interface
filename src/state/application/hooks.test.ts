import * as hooks from "./hooks"
// @ponicode
describe("hooks.useBlockNumber", () => {
    test("0", () => {
        let callFunction: any = () => {
            hooks.useBlockNumber()
        }
    
        expect(callFunction).toThrow('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.')
    })
})
