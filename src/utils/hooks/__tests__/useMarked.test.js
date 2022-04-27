import { useMarked } from "../useMarked";
import { renderHook, cleanup } from "@testing-library/react-hooks";

describe("useMarked", () => {
  afterEach(() => {
    cleanup()
  });
  it("should accept markdown and return html accordingly", () => {
    const { result } = renderHook(() => useMarked("# test"));
    expect(result.current).toBe("<h1>test</h1>\n");
  });
  it("should add target='_blank' for a href", () => {
    const { result } = renderHook(() => useMarked("This is an [example](https://example.com/)."));
    const received = String(result.current).valueOf();
    const expected = `<p>This is an <a href="https://example.com/" target="_blank" rel="noopener noreferrer">example</a>.</p>\n`;
    expect(received).toBe(String(expected).valueOf());
  });
});
