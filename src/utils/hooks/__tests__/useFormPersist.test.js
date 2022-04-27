import React from "react";
import { act, render, fireEvent, cleanup } from "@testing-library/react";
import { useForm } from "react-hook-form";
import MutationObserver from "mutation-observer";
import useFormPersist from "../useFormPersist";

global.MutationObserver = MutationObserver;

const STORAGE_KEY = "storageKey";

const wait = () => new Promise(resolve => setTimeout(resolve, 1000));
const memory = {};
const storageMock = () => ({
  getItem: jest.fn(key => {
    const value = memory[key];
    return typeof value === "string" ? JSON.parse(value) : null;
  }),
  setItem: jest.fn((key, value) => {
    memory[key] = value;
  })
});

afterEach(cleanup);

const FormComponentMock = ({ register, handleSubmit }) => (
  <form data-testid="form" onSubmit={handleSubmit(() => null)}>
    <label>
      foo:
      <input name="foo" defaultValue="fooValue" {...register("foo")} />
    </label>
    <label>
      bar (required):
      <input name="bar" defaultValue="barValue" {...register("bar")} />
    </label>
    <label>
      baz (excluded):
      <input name="baz" defaultValue="bazValue" {...register("baz")} />
    </label>
    <input type="submit" />
  </form>
);

describe("Form persist hook", () => {
  it("should persist all form fields in storage by default", async () => {
    const storage = storageMock();
    const Form = () => {
      const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
          foo: "fooValue",
          bar: "barValue",
          baz: "bazValue"
        }
      });

      useFormPersist(`${STORAGE_KEY}-all`, { watch, setValue }, { storage });

      return (
        <FormComponentMock register={register} handleSubmit={handleSubmit} />
      );
    };
    act(() => {
      const { getByTestId } = render(<Form />);
      fireEvent.submit(getByTestId("form"));
    });

    await wait();

    expect(storage.getItem).toHaveBeenCalled();
    expect(storage.setItem).toHaveBeenCalled();
    expect(storage.getItem(`${STORAGE_KEY}-all`)).toEqual({
      foo: "fooValue",
      bar: "barValue",
      baz: "bazValue"
    });
  });
  it("should persist only specified fields in storage", async () => {
    const storage = storageMock();

    const Form = () => {
      const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
          foo: "fooValue",
          bar: "barValue",
          baz: "bazValue"
        }
      });

      useFormPersist(
        `${STORAGE_KEY}-include`,
        { watch, setValue },
        { storage, include: ["bar"] }
      );

      return (
        <FormComponentMock register={register} handleSubmit={handleSubmit} />
      );
    };

    act(() => {
      const { getByTestId } = render(<Form />);
      fireEvent.submit(getByTestId("form"));
    });

    await wait();

    expect(storage.getItem).toHaveBeenCalled();
    expect(storage.setItem).toHaveBeenCalled();
    expect(storage.getItem(`${STORAGE_KEY}-include`)).toEqual({
      bar: "barValue"
    });
  });
  it("should not persist excluded fields in storage", async () => {
    const storage = storageMock();

    const Form = () => {
      const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
          foo: "fooValue",
          bar: "barValue",
          baz: "bazValue"
        }
      });

      useFormPersist(
        `${STORAGE_KEY}-exclude`,
        { watch, setValue },
        { storage, exclude: ["baz"] }
      );

      return (
        <FormComponentMock register={register} handleSubmit={handleSubmit} />
      );
    };

    act(() => {
      const { getByTestId } = render(<Form />);
      fireEvent.submit(getByTestId("form"));
    });

    await wait();

    expect(storage.getItem).toHaveBeenCalled();
    expect(storage.setItem).toHaveBeenCalled();
    expect(storage.getItem(`${STORAGE_KEY}-exclude`)).toEqual({
      foo: "fooValue",
      bar: "barValue"
    });
  });
});
