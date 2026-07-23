import "@testing-library/jest-dom/vitest";
import { tmpdir } from "node:os";
import path from "node:path";

process.env.NIGHTSHIFT_DB_PATH = path.join(tmpdir(), `nightshift-test-${process.pid}.db`);
