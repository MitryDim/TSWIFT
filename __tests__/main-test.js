"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
require("cdktf/lib/testing/adapters/jest"); // Load types for expect matchers
// import { Testing } from "cdktf";
describe("My CDKTF Application", () => {
    // The tests below are example tests, you can find more information at
    // https://cdk.tf/testing
    it.todo("should be tested");
    // // All Unit tests test the synthesised terraform code, it does not create real-world resources
    // describe("Unit testing using assertions", () => {
    //   it("should contain a resource", () => {
    //     // import { Image,Container } from "./.gen/providers/docker"
    //     expect(
    //       Testing.synthScope((scope) => {
    //         new MyApplicationsAbstraction(scope, "my-app", {});
    //       })
    //     ).toHaveResource(Container);
    //     expect(
    //       Testing.synthScope((scope) => {
    //         new MyApplicationsAbstraction(scope, "my-app", {});
    //       })
    //     ).toHaveResourceWithProperties(Image, { name: "ubuntu:latest" });
    //   });
    // });
    // describe("Unit testing using snapshots", () => {
    //   it("Tests the snapshot", () => {
    //     const app = Testing.app();
    //     const stack = new TerraformStack(app, "test");
    //     new TestProvider(stack, "provider", {
    //       accessKey: "1",
    //     });
    //     new TestResource(stack, "test", {
    //       name: "my-resource",
    //     });
    //     expect(Testing.synth(stack)).toMatchSnapshot();
    //   });
    //   it("Tests a combination of resources", () => {
    //     expect(
    //       Testing.synthScope((stack) => {
    //         new TestDataSource(stack, "test-data-source", {
    //           name: "foo",
    //         });
    //         new TestResource(stack, "test-resource", {
    //           name: "bar",
    //         });
    //       })
    //     ).toMatchInlineSnapshot();
    //   });
    // });
    // describe("Checking validity", () => {
    //   it("check if the produced terraform configuration is valid", () => {
    //     const app = Testing.app();
    //     const stack = new TerraformStack(app, "test");
    //     new TestDataSource(stack, "test-data-source", {
    //       name: "foo",
    //     });
    //     new TestResource(stack, "test-resource", {
    //       name: "bar",
    //     });
    //     expect(Testing.fullSynth(app)).toBeValidTerraform();
    //   });
    //   it("check if this can be planned", () => {
    //     const app = Testing.app();
    //     const stack = new TerraformStack(app, "test");
    //     new TestDataSource(stack, "test-data-source", {
    //       name: "foo",
    //     });
    //     new TestResource(stack, "test-resource", {
    //       name: "bar",
    //     });
    //     expect(Testing.fullSynth(app)).toPlanSuccessfully();
    //   });
    // });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi10ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9CLG1DQUFtQztBQUNuQywyQ0FBeUMsQ0FBQyxpQ0FBaUM7QUFDM0UsbUNBQW1DO0FBRW5DLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsc0VBQXNFO0lBQ3RFLHlCQUF5QjtJQUN6QixFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFNUIsaUdBQWlHO0lBQ2pHLG9EQUFvRDtJQUNwRCw0Q0FBNEM7SUFDNUMsbUVBQW1FO0lBQ25FLGNBQWM7SUFDZCx3Q0FBd0M7SUFDeEMsOERBQThEO0lBQzlELFdBQVc7SUFDWCxtQ0FBbUM7SUFFbkMsY0FBYztJQUNkLHdDQUF3QztJQUN4Qyw4REFBOEQ7SUFDOUQsV0FBVztJQUNYLHdFQUF3RTtJQUN4RSxRQUFRO0lBQ1IsTUFBTTtJQUVOLG1EQUFtRDtJQUNuRCxxQ0FBcUM7SUFDckMsaUNBQWlDO0lBQ2pDLHFEQUFxRDtJQUVyRCw0Q0FBNEM7SUFDNUMsd0JBQXdCO0lBQ3hCLFVBQVU7SUFFVix3Q0FBd0M7SUFDeEMsNkJBQTZCO0lBQzdCLFVBQVU7SUFFVixzREFBc0Q7SUFDdEQsUUFBUTtJQUVSLG1EQUFtRDtJQUNuRCxjQUFjO0lBQ2Qsd0NBQXdDO0lBQ3hDLDBEQUEwRDtJQUMxRCx5QkFBeUI7SUFDekIsY0FBYztJQUVkLHFEQUFxRDtJQUNyRCx5QkFBeUI7SUFDekIsY0FBYztJQUNkLFdBQVc7SUFDWCxpQ0FBaUM7SUFDakMsUUFBUTtJQUNSLE1BQU07SUFFTix3Q0FBd0M7SUFDeEMseUVBQXlFO0lBQ3pFLGlDQUFpQztJQUNqQyxxREFBcUQ7SUFFckQsc0RBQXNEO0lBQ3RELHFCQUFxQjtJQUNyQixVQUFVO0lBRVYsaURBQWlEO0lBQ2pELHFCQUFxQjtJQUNyQixVQUFVO0lBQ1YsMkRBQTJEO0lBQzNELFFBQVE7SUFFUiwrQ0FBK0M7SUFDL0MsaUNBQWlDO0lBQ2pDLHFEQUFxRDtJQUVyRCxzREFBc0Q7SUFDdEQscUJBQXFCO0lBQ3JCLFVBQVU7SUFFVixpREFBaUQ7SUFDakQscUJBQXFCO0lBQ3JCLFVBQVU7SUFDViwyREFBMkQ7SUFDM0QsUUFBUTtJQUNSLE1BQU07QUFDUixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgSGFzaGlDb3JwLCBJbmNcclxuLy8gU1BEWC1MaWNlbnNlLUlkZW50aWZpZXI6IE1QTC0yLjBcclxuaW1wb3J0IFwiY2RrdGYvbGliL3Rlc3RpbmcvYWRhcHRlcnMvamVzdFwiOyAvLyBMb2FkIHR5cGVzIGZvciBleHBlY3QgbWF0Y2hlcnNcclxuLy8gaW1wb3J0IHsgVGVzdGluZyB9IGZyb20gXCJjZGt0ZlwiO1xyXG5cclxuZGVzY3JpYmUoXCJNeSBDREtURiBBcHBsaWNhdGlvblwiLCAoKSA9PiB7XHJcbiAgLy8gVGhlIHRlc3RzIGJlbG93IGFyZSBleGFtcGxlIHRlc3RzLCB5b3UgY2FuIGZpbmQgbW9yZSBpbmZvcm1hdGlvbiBhdFxyXG4gIC8vIGh0dHBzOi8vY2RrLnRmL3Rlc3RpbmdcclxuICBpdC50b2RvKFwic2hvdWxkIGJlIHRlc3RlZFwiKTtcclxuXHJcbiAgLy8gLy8gQWxsIFVuaXQgdGVzdHMgdGVzdCB0aGUgc3ludGhlc2lzZWQgdGVycmFmb3JtIGNvZGUsIGl0IGRvZXMgbm90IGNyZWF0ZSByZWFsLXdvcmxkIHJlc291cmNlc1xyXG4gIC8vIGRlc2NyaWJlKFwiVW5pdCB0ZXN0aW5nIHVzaW5nIGFzc2VydGlvbnNcIiwgKCkgPT4ge1xyXG4gIC8vICAgaXQoXCJzaG91bGQgY29udGFpbiBhIHJlc291cmNlXCIsICgpID0+IHtcclxuICAvLyAgICAgLy8gaW1wb3J0IHsgSW1hZ2UsQ29udGFpbmVyIH0gZnJvbSBcIi4vLmdlbi9wcm92aWRlcnMvZG9ja2VyXCJcclxuICAvLyAgICAgZXhwZWN0KFxyXG4gIC8vICAgICAgIFRlc3Rpbmcuc3ludGhTY29wZSgoc2NvcGUpID0+IHtcclxuICAvLyAgICAgICAgIG5ldyBNeUFwcGxpY2F0aW9uc0Fic3RyYWN0aW9uKHNjb3BlLCBcIm15LWFwcFwiLCB7fSk7XHJcbiAgLy8gICAgICAgfSlcclxuICAvLyAgICAgKS50b0hhdmVSZXNvdXJjZShDb250YWluZXIpO1xyXG5cclxuICAvLyAgICAgZXhwZWN0KFxyXG4gIC8vICAgICAgIFRlc3Rpbmcuc3ludGhTY29wZSgoc2NvcGUpID0+IHtcclxuICAvLyAgICAgICAgIG5ldyBNeUFwcGxpY2F0aW9uc0Fic3RyYWN0aW9uKHNjb3BlLCBcIm15LWFwcFwiLCB7fSk7XHJcbiAgLy8gICAgICAgfSlcclxuICAvLyAgICAgKS50b0hhdmVSZXNvdXJjZVdpdGhQcm9wZXJ0aWVzKEltYWdlLCB7IG5hbWU6IFwidWJ1bnR1OmxhdGVzdFwiIH0pO1xyXG4gIC8vICAgfSk7XHJcbiAgLy8gfSk7XHJcblxyXG4gIC8vIGRlc2NyaWJlKFwiVW5pdCB0ZXN0aW5nIHVzaW5nIHNuYXBzaG90c1wiLCAoKSA9PiB7XHJcbiAgLy8gICBpdChcIlRlc3RzIHRoZSBzbmFwc2hvdFwiLCAoKSA9PiB7XHJcbiAgLy8gICAgIGNvbnN0IGFwcCA9IFRlc3RpbmcuYXBwKCk7XHJcbiAgLy8gICAgIGNvbnN0IHN0YWNrID0gbmV3IFRlcnJhZm9ybVN0YWNrKGFwcCwgXCJ0ZXN0XCIpO1xyXG5cclxuICAvLyAgICAgbmV3IFRlc3RQcm92aWRlcihzdGFjaywgXCJwcm92aWRlclwiLCB7XHJcbiAgLy8gICAgICAgYWNjZXNzS2V5OiBcIjFcIixcclxuICAvLyAgICAgfSk7XHJcblxyXG4gIC8vICAgICBuZXcgVGVzdFJlc291cmNlKHN0YWNrLCBcInRlc3RcIiwge1xyXG4gIC8vICAgICAgIG5hbWU6IFwibXktcmVzb3VyY2VcIixcclxuICAvLyAgICAgfSk7XHJcblxyXG4gIC8vICAgICBleHBlY3QoVGVzdGluZy5zeW50aChzdGFjaykpLnRvTWF0Y2hTbmFwc2hvdCgpO1xyXG4gIC8vICAgfSk7XHJcblxyXG4gIC8vICAgaXQoXCJUZXN0cyBhIGNvbWJpbmF0aW9uIG9mIHJlc291cmNlc1wiLCAoKSA9PiB7XHJcbiAgLy8gICAgIGV4cGVjdChcclxuICAvLyAgICAgICBUZXN0aW5nLnN5bnRoU2NvcGUoKHN0YWNrKSA9PiB7XHJcbiAgLy8gICAgICAgICBuZXcgVGVzdERhdGFTb3VyY2Uoc3RhY2ssIFwidGVzdC1kYXRhLXNvdXJjZVwiLCB7XHJcbiAgLy8gICAgICAgICAgIG5hbWU6IFwiZm9vXCIsXHJcbiAgLy8gICAgICAgICB9KTtcclxuXHJcbiAgLy8gICAgICAgICBuZXcgVGVzdFJlc291cmNlKHN0YWNrLCBcInRlc3QtcmVzb3VyY2VcIiwge1xyXG4gIC8vICAgICAgICAgICBuYW1lOiBcImJhclwiLFxyXG4gIC8vICAgICAgICAgfSk7XHJcbiAgLy8gICAgICAgfSlcclxuICAvLyAgICAgKS50b01hdGNoSW5saW5lU25hcHNob3QoKTtcclxuICAvLyAgIH0pO1xyXG4gIC8vIH0pO1xyXG5cclxuICAvLyBkZXNjcmliZShcIkNoZWNraW5nIHZhbGlkaXR5XCIsICgpID0+IHtcclxuICAvLyAgIGl0KFwiY2hlY2sgaWYgdGhlIHByb2R1Y2VkIHRlcnJhZm9ybSBjb25maWd1cmF0aW9uIGlzIHZhbGlkXCIsICgpID0+IHtcclxuICAvLyAgICAgY29uc3QgYXBwID0gVGVzdGluZy5hcHAoKTtcclxuICAvLyAgICAgY29uc3Qgc3RhY2sgPSBuZXcgVGVycmFmb3JtU3RhY2soYXBwLCBcInRlc3RcIik7XHJcblxyXG4gIC8vICAgICBuZXcgVGVzdERhdGFTb3VyY2Uoc3RhY2ssIFwidGVzdC1kYXRhLXNvdXJjZVwiLCB7XHJcbiAgLy8gICAgICAgbmFtZTogXCJmb29cIixcclxuICAvLyAgICAgfSk7XHJcblxyXG4gIC8vICAgICBuZXcgVGVzdFJlc291cmNlKHN0YWNrLCBcInRlc3QtcmVzb3VyY2VcIiwge1xyXG4gIC8vICAgICAgIG5hbWU6IFwiYmFyXCIsXHJcbiAgLy8gICAgIH0pO1xyXG4gIC8vICAgICBleHBlY3QoVGVzdGluZy5mdWxsU3ludGgoYXBwKSkudG9CZVZhbGlkVGVycmFmb3JtKCk7XHJcbiAgLy8gICB9KTtcclxuXHJcbiAgLy8gICBpdChcImNoZWNrIGlmIHRoaXMgY2FuIGJlIHBsYW5uZWRcIiwgKCkgPT4ge1xyXG4gIC8vICAgICBjb25zdCBhcHAgPSBUZXN0aW5nLmFwcCgpO1xyXG4gIC8vICAgICBjb25zdCBzdGFjayA9IG5ldyBUZXJyYWZvcm1TdGFjayhhcHAsIFwidGVzdFwiKTtcclxuXHJcbiAgLy8gICAgIG5ldyBUZXN0RGF0YVNvdXJjZShzdGFjaywgXCJ0ZXN0LWRhdGEtc291cmNlXCIsIHtcclxuICAvLyAgICAgICBuYW1lOiBcImZvb1wiLFxyXG4gIC8vICAgICB9KTtcclxuXHJcbiAgLy8gICAgIG5ldyBUZXN0UmVzb3VyY2Uoc3RhY2ssIFwidGVzdC1yZXNvdXJjZVwiLCB7XHJcbiAgLy8gICAgICAgbmFtZTogXCJiYXJcIixcclxuICAvLyAgICAgfSk7XHJcbiAgLy8gICAgIGV4cGVjdChUZXN0aW5nLmZ1bGxTeW50aChhcHApKS50b1BsYW5TdWNjZXNzZnVsbHkoKTtcclxuICAvLyAgIH0pO1xyXG4gIC8vIH0pO1xyXG59KTtcclxuIl19