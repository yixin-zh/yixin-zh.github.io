"""Serialization of inspected values into the `{type, contents, dtype, shape}` shape."""

from __future__ import annotations

from dataclasses import asdict, is_dataclass
from datetime import date, datetime, time
from pathlib import Path
from typing import Any

MAX_STRING = 4000
MAX_ITEMS = 256


def make_value(obj: Any) -> dict:
    """Serialize `obj` into the value dict consumed by the viewer."""
    return {
        "type": type(obj).__name__,
        "contents": serialize(obj),
        "dtype": _dtype(obj),
        "shape": _shape(obj),
    }


def serialize(obj: Any, depth: int = 0) -> Any:
    if obj is None or isinstance(obj, (bool, int, float, str)):
        return obj

    if depth > 6:
        return _short_repr(obj)

    if isinstance(obj, (datetime, date, time)):
        return obj.isoformat()

    if isinstance(obj, Path):
        return str(obj)

    if isinstance(obj, bytes):
        return _truncate(obj.decode("utf-8", errors="replace"))

    if is_dataclass(obj) and not isinstance(obj, type):
        return serialize(asdict(obj), depth + 1)

    if isinstance(obj, dict):
        items = list(obj.items())[:MAX_ITEMS]
        return {str(key): serialize(value, depth + 1) for key, value in items}

    if isinstance(obj, (set, frozenset)):
        return [serialize(item, depth + 1) for item in list(obj)[:MAX_ITEMS]]

    if isinstance(obj, (list, tuple)):
        return [serialize(item, depth + 1) for item in obj[:MAX_ITEMS]]

    # numpy arrays / torch tensors (only if such libraries happen to be used)
    tolist = getattr(obj, "tolist", None)
    if callable(tolist) and type(obj).__module__ not in {"builtins"}:
        try:
            return serialize(tolist(), depth + 1)
        except Exception:
            return _short_repr(obj)

    return _short_repr(obj)


def _short_repr(obj: Any) -> str:
    return _truncate(repr(obj))


def _truncate(value: str) -> str:
    if len(value) > MAX_STRING:
        return value[:MAX_STRING] + "… (truncated)"
    return value


def _dtype(obj: Any) -> str | None:
    dtype = getattr(obj, "dtype", None)
    return str(dtype) if dtype is not None else None


def _shape(obj: Any) -> list[int] | None:
    shape = getattr(obj, "shape", None)
    if shape is None:
        return None
    try:
        return [int(dim) for dim in shape]
    except (TypeError, ValueError):
        return None
