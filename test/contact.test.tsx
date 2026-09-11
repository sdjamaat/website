// @vitest-environment jsdom
import React from "react"
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const boundary = vi.hoisted(() => ({
  submit: vi.fn(),
  reset: vi.fn(),
  props: null as any,
}))
vi.mock("../src/lib/firebase", () => ({ functions: {} }))
vi.mock("firebase/functions", () => ({ httpsCallable: () => boundary.submit }))
vi.mock("../src/components/other/custom-message", () => ({ default: vi.fn() }))
vi.mock("@marsidev/react-turnstile", async () => {
  const React = await import("react")
  return {
    Turnstile: React.forwardRef((props: any, ref) => {
      boundary.props = props
      React.useImperativeHandle(ref, () => ({ reset: boundary.reset }))
      return <div aria-label="Security check" />
    }),
  }
})
import Contact from "../src/components/home/contact"

beforeEach(() => {
  boundary.submit.mockReset()
  boundary.reset.mockReset()
  boundary.props = null
  vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "test-only-public-key")
  window.matchMedia = vi
    .fn()
    .mockImplementation(() => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    }))
})
afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

function fillForm() {
  fireEvent.change(screen.getByLabelText("Name", { exact: true }), {
    target: { value: "Test Visitor" },
  })
  fireEvent.change(screen.getByLabelText("Email", { exact: true }), {
    target: { value: "visitor@example.com" },
  })
  fireEvent.change(screen.getByLabelText("Phone number"), {
    target: { value: "+1 (555) 555-0100" },
  })
  fireEvent.change(screen.getByLabelText("Message", { exact: true }), {
    target: { value: "Please share visiting hours." },
  })
}
function passSecurity() {
  act(() => boundary.props.onSuccess("test-token"))
}

describe("Contact form", () => {
  it("fails closed with an alternative contact address when configuration is missing", () => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "")
    render(<Contact />)
    expect(
      (screen.getByRole("button", { name: "Submit" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
    expect(
      screen.getByText(/temporarily unavailable.*umoor-dakhiliya/),
    ).toBeTruthy()
    expect(boundary.props).toBeNull()
  })

  it("requires a fresh token and disables submission on expiry or verification errors", () => {
    render(<Contact />)
    const button = screen.getByRole("button", {
      name: "Submit",
    }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    passSecurity()
    expect(button.disabled).toBe(false)
    act(() => boundary.props.onExpire())
    expect(button.disabled).toBe(true)
    passSecurity()
    act(() => boundary.props.onError())
    expect(button.disabled).toBe(true)
    expect(screen.getByText(/security check could not load/)).toBeTruthy()
    expect(boundary.submit).not.toHaveBeenCalled()
  })

  it("keeps entered text on a rate-limit error and resets the consumed token", async () => {
    boundary.submit.mockRejectedValue({ code: "functions/resource-exhausted" })
    render(<Contact />)
    fillForm()
    passSecurity()
    fireEvent.click(screen.getByRole("button", { name: "Submit" }))
    await screen.findByText(/Too many submissions/)
    expect(
      (screen.getByLabelText("Message", { exact: true }) as HTMLTextAreaElement)
        .value,
    ).toBe("Please share visiting hours.")
    expect(boundary.reset).toHaveBeenCalledOnce()
    expect(
      (screen.getByRole("button", { name: "Submit" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true)
  })

  it("sends the token and international phone number, blocks double submits, and clears on success", async () => {
    let resolve: (value: unknown) => void = () => {}
    boundary.submit.mockImplementation(
      () =>
        new Promise(r => {
          resolve = r
        }),
    )
    render(<Contact />)
    fillForm()
    passSecurity()
    const button = screen.getByRole("button", {
      name: "Submit",
    }) as HTMLButtonElement
    fireEvent.click(button)
    await waitFor(() => expect(boundary.submit).toHaveBeenCalledOnce())
    fireEvent.submit(button.closest("form")!)
    await act(async () => {})
    expect(boundary.submit).toHaveBeenCalledOnce()
    expect(boundary.submit).toHaveBeenCalledWith({
      name: "Test Visitor",
      email: "visitor@example.com",
      phone: "+1 (555) 555-0100",
      message: "Please share visiting hours.",
      website: "",
      turnstileToken: "test-token",
    })
    await act(async () => resolve({ data: { id: "contact-id" } }))
    await waitFor(() =>
      expect(
        (
          screen.getByLabelText("Message", {
            exact: true,
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(""),
    )
    expect(button.disabled).toBe(true)
    expect(boundary.reset).toHaveBeenCalledOnce()
  })
})
