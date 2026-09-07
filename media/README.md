# media/

Put demo videos / screen recordings here (e.g. `demo-inference.mp4`).

Files in this folder are copied to `var/media/` by `build.py` and served at
`<site>/media/<file>`, so a content script can embed them with:

```python
video("media/demo-inference.mp4", width=720)
```

Keep each clip under a few MB — GitHub Pages serves them as static files and
they are downloaded by every visitor.
