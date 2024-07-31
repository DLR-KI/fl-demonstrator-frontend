// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
// SPDX-FileCopyrightText: 2024 Florian Heinrich <florian.heinrich@dlr.de>
//
// SPDX-License-Identifier: CC-BY-4.0

document$.subscribe(({ body }) => {
  renderMathInElement(body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
  })
})
