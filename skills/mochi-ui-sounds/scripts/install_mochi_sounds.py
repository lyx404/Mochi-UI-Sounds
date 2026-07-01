#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Install the Mochi UI Sounds Web Audio module into a frontend project."
    )
    parser.add_argument("--project", default=".", help="Target project root.")
    parser.add_argument(
        "--target",
        default="src/lib/sounds.ts",
        help="Target path relative to the project root.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite the target file if it already exists.",
    )
    args = parser.parse_args()

    skill_dir = Path(__file__).resolve().parents[1]
    source = skill_dir / "assets" / "sounds.ts"
    project = Path(args.project).expanduser().resolve()
    target = project / args.target

    if not source.exists():
        raise SystemExit(f"Missing bundled asset: {source}")
    if not project.exists():
        raise SystemExit(f"Project root does not exist: {project}")
    if target.exists() and not args.overwrite:
        raise SystemExit(
            f"Refusing to overwrite existing file: {target}\n"
            "Re-run with --overwrite if replacing it is intended."
        )

    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
    print(f"Installed Mochi UI Sounds to {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
