# Artwork 2020 03
Moving from Quadtree to Octree for 3D packing

---

## Installation

Install the `canvas-sketch` CLI globally:
```
npm install canvas-sketch-cli -g
```

If streaming exports to GIF/MP4, install [ffmpeg](https://www.ffmpeg.org/), e.g. on Ubuntu:
```
sudo apt install ffmpeg
```


---

## Usage

### 1a. Basic:
```
canvas-sketch input/artwork.js --output=./output
```
Use the `--output` flag to ensure file structure continuity between projects


### 1b. With GIF export:
```
canvas-sketch input/artwork.js --output=./output --stream [ gif --scale=512:-1 ]
```
Allows the ability to export to GIF files at 512px wide using `Ctrl` + `Shift` + `S`

Additional CLI config options can be found in the [canvas-sketch CLI Docs](https://github.com/mattdesl/canvas-sketch/blob/master/docs/cli.md)


### 2. Open
Open `localhost:9966` in the browser


### 3. Iteration
Use `canvas-sketch`'s git hashing feature to iterate on artwork:
`Ctrl` + `K` performs a `git add` and `git commit`, so that previous iterations can easily be accessed and re-run via their SHA