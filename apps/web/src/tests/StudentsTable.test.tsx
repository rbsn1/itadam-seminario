import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StudentsTable } from "../components/StudentsTable";

describe("StudentsTable", () => {
  it("renders students", () => {
    render(
      <StudentsTable
        students={[{ id: "1", name: "Maria", email: "maria@local", document: "123", status: "em_dia" }]}
      />
    );

    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("Em dia")).toBeInTheDocument();
  });
});
