"""supply-chain CLI — run the supply-chain checks over a tree of repos.

Exit code is deliberately NOT key-hygiene's "0 even with findings": nothing
pings a dead-man switch from this command's ExecStartPost, and the point of a
cooldown check is to be gateable — a HIGH here means a repo resolves without a
publish-age gate, which should be able to fail a pipeline. Findings below HIGH
report and exit 0; only a real error raises.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import click
from estate.findings import Finding, Severity

from .cooldown import scan_tree

DEFAULT_ROOT = "~/code/rmai"
FAIL_AT = Severity.HIGH


def _emit(findings: list[Finding], as_json: bool) -> None:
    if as_json:
        click.echo(json.dumps([f.to_dict() for f in findings], indent=2))
        return
    if not findings:
        click.echo("no findings")
        return
    # Grouped worst-first: the top of the output is what has to be acted on.
    for severity in sorted({f.severity for f in findings}, reverse=True):
        group = [f for f in findings if f.severity == severity]
        click.echo(f"== {severity.name} ({len(group)}) ==")
        for f in sorted(group, key=lambda x: x.asset):
            click.echo(f"  {f.asset}: {f.summary}")
            click.echo(f"    actual:   {f.actual}")
            click.echo(f"    expected: {f.expected}")
            click.echo(f"    {f.evidence}")


@click.group()
def cli() -> None:
    """Supply-chain checks for the RMAI estate."""


@cli.command()
@click.option("--root", default=DEFAULT_ROOT, help="Tree to scan for uv repos.")
@click.option("--json", "as_json", is_flag=True)
def cooldown(root: str, as_json: bool) -> None:
    """Report uv repos whose publish-age cooldown is missing, shadowed or stale."""
    base = Path(root).expanduser()
    if not base.exists():
        raise click.ClickException(f"no such path: {base}")
    findings = scan_tree(base)
    _emit(findings, as_json)
    worst = max((f.severity for f in findings), default=None)
    if worst is not None and worst >= FAIL_AT:
        click.echo(f"{FAIL_AT.name} or worse present: {worst.name}", err=True)
        sys.exit(2)


if __name__ == "__main__":
    cli()
